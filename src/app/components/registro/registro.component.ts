import { Component, inject } from '@angular/core';
import { EmailAuthCredential } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/interfaces/usuario';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { CursosService } from 'src/app/services/cursos.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css'],
})
export class RegistroComponent {
  showModal: boolean = false;
  passwordStrengthScore: number = 0;  // Puntuación de fortaleza de la contraseña
  passwordStrengthLevel: string = '';
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
    // Validación manual de los campos de datosU
    this.validationErrors = {};

    // Verifica que el nombre esté presente
    if (!this.datosU.nombre) {
        this.validationErrors.nombre = 'El nombre es obligatorio.';
    }

    // Verifica que la edad esté presente y sea mayor de 18 años
    if (this.datosU.edad === null || this.datosU.edad < 18) {
        this.validationErrors.edad = 'Debes ser mayor de edad.';
    }

    // Verifica que el teléfono esté presente
    if (!this.datosU.telefono) {
      this.validationErrors.telefono = 'El teléfono es obligatorio.';
  } else {
      // Expresión regular para verificar el formato del número de teléfono
      const phoneRegex = /^\+?[1-10]\d{1,14}$/; // Formato internacional
      if (!phoneRegex.test(this.datosU.telefono)) {
          this.validationErrors.telefono = 'Ingresa un número de teléfono válido.';
      }
  }

    // Verifica que el correo electrónico esté presente y sea válido
    if (!this.datosU.email) {
        this.validationErrors.email = 'El correo electrónico es obligatorio.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.datosU.email)) {
        this.validationErrors.email = 'Ingresa un correo electrónico válido.';
    }

    // Verifica que la contraseña esté presente y cumpla con los criterios de seguridad
    if (!this.datosU.password) {
        this.validationErrors.password = 'La contraseña es obligatoria.';
    } else {
        // Verificar la longitud de la contraseña
        if (this.datosU.password.length < 8) {
            this.validationErrors.password = 'La contraseña debe tener al menos 8 caracteres.';
        }
        // Verificar si la contraseña contiene mayúsculas
        else if (!/[A-Z]/.test(this.datosU.password)) {
            this.validationErrors.password = 'La contraseña debe contener al menos una letra mayúscula.';
        }
        // Verificar si la contraseña contiene minúsculas
        else if (!/[a-z]/.test(this.datosU.password)) {
            this.validationErrors.password = 'La contraseña debe contener al menos una letra minúscula.';
        }
        // Verificar si la contraseña contiene números
        else if (!/[0-9]/.test(this.datosU.password)) {
            this.validationErrors.password = 'La contraseña debe contener al menos un número.';
        }
        // Verificar si la contraseña contiene símbolos especiales
        else if (!/[!@#$%^&*(),.?":{}|<>]/.test(this.datosU.password)) {
            this.validationErrors.password = 'La contraseña debe contener al menos un símbolo especial.';
        } else {
            // Puedes calcular la fortaleza de la contraseña aquí y actualizar la barra de progreso visual si es necesario.
            // Por ejemplo:
            this.updatePasswordStrengthIndicator(this.datosU.password);
        }
    }

    // Si hay errores, muestra alertas
    if (Object.keys(this.validationErrors).length > 0) {
        // Puedes usar alertas o simplemente salir de la función para no proceder con el registro
        return;
    }

    // Si no hay errores, procede con el registro
    try {
        const res = await this.usuarioService.registro(this.datosU);
        console.log('Registro exitoso');
        const path = 'Usuarios';
        const id = res.user.uid;
        this.datosU.uid = id;
        this.datosU.password = '';

        // Guarda los datos en Firestore o realiza otras operaciones
        await this.cursoService.createDoc(this.datosU, path, id);

        this.toastr.success(`Registro exitoso. Bienvenido ${this.datosU.nombre}`);
        this.router.navigate(['/home']);
    } catch (error: any) {
        console.error('Error en el registro:', error);
        if (error.code === 'auth/email-already-in-use') {
            this.toastr.info(
                'Este correo electrónico ya está en uso. Por favor, utiliza otro correo.'
            );
        } else {
            this.toastr.warning(
                'Ocurrió un error durante el registro. Por favor, inténtalo de nuevo.'
            );
        }
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
}
