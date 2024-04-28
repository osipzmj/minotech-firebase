import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { EmailAuthCredential } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/interfaces/usuario';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { CursosService } from 'src/app/services/cursos.service';
import { ToastrService } from 'ngx-toastr';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css'],
  animations: [
    trigger('fadeInOut', [
        state('in', style({ opacity: 1 })),
        transition('void => *', [
            style({ opacity: 0 }),
            animate(500)
        ]),
        transition('* => void', [
            animate(500, style({ opacity: 0 }))
        ])
    ])
]
})
export class RegistroComponent {
  showModal: boolean = false;
  passwordStrengthScore: number = 0;  // Puntuación de fortaleza de la contraseña
  passwordStrengthLevel: string = '';
  captchaVerified = false;
  captchaVisible = false;
  @ViewChild('reCaptcha') reCaptchaRef: ElementRef | undefined;

  datosU: Usuario = {
    uid: '',
    nombre:'',
    edad: 0, // Inicializado a null
    email: '',
    telefono: '',
    rol: 'estandar',
    password: '', // Inicializado a undefined
  };
  passwordType: string = 'password';
  validationErrors: {
    nombre?: string;
    edad?: string;
    telefono?: string;
    email?: string;
    password?: string;
  } = {};

  constructor(
    private usuarioService: UsuariosService,
    private router: Router,
    private cursoService: CursosService,
    private toastr: ToastrService
  ) {}

  togglePasswordVisibility() {
    this.passwordType = this.passwordType === 'password' ? 'text' : 'password';
  }

  async onSubmit() {
    // Restablece los errores de validación
    this.validationErrors = {};
    
    // Llama a la función para validar los campos
    this.validateFields();
    
    // Si hay errores de validación, muestra un mensaje y detiene el proceso
    if (Object.keys(this.validationErrors).length > 0) {
        this.toastr.error('Por favor, corrige los errores en el formulario.');
        return; // Detiene el proceso de registro
    }
    
    // Si no hay errores de validación, verifica el reCAPTCHA
    if (!this.captchaVerified) {
        this.captchaVisible = true; // Muestra el reCAPTCHA
        this.toastr.info('Por favor, completa el reCAPTCHA para continuar.');
        return; // Detiene el proceso de registro hasta que el reCAPTCHA esté verificado
    }

    // Continúa con el proceso de registro si todo está validado
    try {
        const res = await this.usuarioService.registro(this.datosU);
        console.log('Registro exitoso');
        const path = 'Usuarios';
        const id = res.user.uid;
        this.datosU.uid = id;
        this.datosU.password = ''; // Limpia la contraseña por seguridad

        await this.cursoService.createDoc(this.datosU, path, id);
        
        // Muestra un mensaje de éxito
        this.toastr.success(`Registro exitoso. Bienvenido ${this.datosU.email}`);
        
        // Redirige al usuario
        this.router.navigate(['/home']);
    } catch (error) {
        console.error('Error en el registro:', error);
        this.handleRegistrationError(error);
    }
}

  validateFields() {
    // Validación del nombre
    if (!this.datosU.nombre) {
        this.validationErrors.nombre = 'El nombre es obligatorio.';
    }

    // Validación de la edad
    if (this.datosU.edad === null || this.datosU.edad < 18) {
        this.validationErrors.edad = 'Debes ser mayor de edad.';
    }

    // Validación del teléfono
    if (!this.datosU.telefono) {
        this.validationErrors.telefono = 'El teléfono es obligatorio.';
    } else {
        // Expresión regular para verificar que el número de teléfono tenga al menos 10 dígitos
        const phoneRegex = /^\d{10,}$/;
        if (!phoneRegex.test(this.datosU.telefono)) {
            this.validationErrors.telefono = 'Ingresa un número de teléfono válido con al menos 10 dígitos.';
        }
    }

    // Validación del correo electrónico
    if (!this.datosU.email) {
        this.validationErrors.email = 'El correo electrónico es obligatorio.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.datosU.email)) {
        this.validationErrors.email = 'Ingresa un correo electrónico válido.';
    }

    // Validación de la contraseña
    if (!this.datosU.password) {
        this.validationErrors.password = 'La contraseña es obligatoria.';
    } else {
        // Llama a tu método de validación de contraseña para verificar otros criterios de seguridad
        this.validatePassword();
    }
}

  validatePassword() {
    if (this.datosU.password.length < 8) {
      this.validationErrors.password = 'La contraseña debe tener al menos 8 caracteres.';
    } else if (!/[A-Z]/.test(this.datosU.password)) {
      this.validationErrors.password = 'La contraseña debe contener al menos una letra mayúscula.';
    } else if (!/[a-z]/.test(this.datosU.password)) {
      this.validationErrors.password = 'La contraseña debe contener al menos una letra minúscula.';
    } else if (!/[0-9]/.test(this.datosU.password)) {
      this.validationErrors.password = 'La contraseña debe contener al menos un número.';
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(this.datosU.password)) {
      this.validationErrors.password = 'La contraseña debe contener al menos un símbolo especial.';
    }
  }

  handleRegistrationError(error: any) {
    if (error.code === 'auth/email-already-in-use') {
      this.toastr.info('Este correo electrónico ya está en uso. Por favor, utiliza otro correo.');
    } else {
      this.toastr.warning('Ocurrió un error durante el registro. Por favor, inténtalo de nuevo.');
    }
 }

  updatePasswordStrengthIndicator(password: string) {
    // Puntuación inicial de fortaleza de la contraseña
    let strengthScore = 0;

    // Verifica la longitud de la contraseña
    if (password.length >= 8) {
        strengthScore += 20;
    } else if (password.length >= 12) {
        strengthScore += 30;
    } else if (password.length >= 16) {
        strengthScore += 40;
    }

    // Verifica si la contraseña contiene mayúsculas
    if (/[A-Z]/.test(password)) {
        strengthScore += 20;
    }

    // Verifica si la contraseña contiene minúsculas
    if (/[a-z]/.test(password)) {
        strengthScore += 20;
    }

    // Verifica si la contraseña contiene números
    if (/[0-9]/.test(password)) {
        strengthScore += 20;
    }

    // Verifica si la contraseña contiene símbolos especiales
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        strengthScore += 20;
    }

    // Actualiza el indicador visual de fortaleza de contraseña
    this.updatePasswordStrengthVisual(strengthScore);
}

updatePasswordStrengthVisual(strengthScore: number) {
    // Aquí puedes actualizar la barra de progreso visual o cualquier otro indicador de fortaleza de contraseña en tu interfaz de usuario.
    // Por ejemplo, puedes asignar el `strengthScore` a una variable que esté vinculada a un componente de barra de progreso en tu HTML.
    this.passwordStrengthScore = strengthScore;

    // También podrías definir diferentes niveles de fortaleza según el `strengthScore`.
    if (strengthScore < 40) {
        this.passwordStrengthLevel = 'Tu contraseña es débil';
    } else if (strengthScore >= 40 && strengthScore < 85) {
        this.passwordStrengthLevel = 'Tu contraseña es intermedia';
    } else {
        this.passwordStrengthLevel = 'Tu contraseña es fuerte';
    }

    // Puedes utilizar `passwordStrengthLevel` para mostrar mensajes o cambiar el estilo visual en tu HTML.
}


  async signInWithGoogle() {
    try {
      const response = await this.usuarioService.signInWithGoogle();
      console.log('Inicio de sesión con Google exitoso.', response);
      // Redireccionar o realizar alguna acción después del inicio de sesión exitoso
    } catch (error) {
      console.error('Error en el inicio de sesión con Google:', error);
      // Manejar errores de inicio de sesión con Google, si es necesario
    }
  }

  async signInWithFacebook() {
    try {
      const response = await this.usuarioService.signInWithFacebook();
      console.log('Inicio de sesión con Facebook exitoso.', response);
      // Redireccionar o realizar alguna acción después del inicio de sesión exitoso
    } catch (error) {
      console.error('Error en el inicio de sesión con Facebook:', error);
      // Manejar errores de inicio de sesión con Facebook, si es necesario
    }
  }

  onCaptchaResolved(token: string | null): void {
    if (token) {
      // Si se resuelve el reCAPTCHA con éxito, actualiza captchaVerified a true
      this.captchaVerified = true;
      // Ejecutar el envío automático del formulario
      this.onSubmit();
    } else {
      // Si el token es nulo, el captcha no se ha completado correctamente
      this.captchaVerified = false;
    }
  }
}
