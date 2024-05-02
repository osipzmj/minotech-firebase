import { Component, ElementRef, ViewChild } from '@angular/core';
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
  passwordStrengthScore: number = 0;  
  passwordStrengthLevel: string = '';
  captchaVerified = false;
  captchaVisible = false;
  @ViewChild('reCaptcha') reCaptchaRef: ElementRef | undefined;

  datosU: Usuario = {
    uid: '',
    nombre:'',
    edad: '',
    email: '',
    phoneNumber: '',
    rol: 'estandar',
    password: '',
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
    this.validationErrors = {};
    this.validateFields();
    if (Object.keys(this.validationErrors).length > 0) {
        this.toastr.error('Por favor, corrige los errores en el formulario.');
        return;
    }
    
    if (!this.captchaVerified) {
        this.captchaVisible = true; 
        this.toastr.info('Por favor, completa el reCAPTCHA para continuar.');
        return; 
    }

    try {
        const res = await this.usuarioService.registro(this.datosU);
        console.log('Registro exitoso');
        const path = 'Usuarios';
        const id = res.user.uid;
        this.datosU.uid = id;
        this.datosU.password = ''; 
        await this.cursoService.createDoc(this.datosU, path, id);
        this.toastr.success(`Registro exitoso. Bienvenido ${this.datosU.email}`);
        this.router.navigate(['/home']);
    } catch (error) {
        console.error('Error en el registro:', error);
        this.handleRegistrationError(error);
    }
}

  validateFields() {
    if (!this.datosU.nombre) {
        this.validationErrors.nombre = 'El nombre es obligatorio.';
    }
    if (this.datosU.edad === null || this.datosU.edad < 18) {
        this.validationErrors.edad = 'Debes ser mayor de edad.';
    }
    if (!this.datosU.phoneNumber) {
        this.validationErrors.telefono = 'El teléfono es obligatorio.';
    } else {
        const phoneRegex = /^\d{10,}$/;
        if (!phoneRegex.test(this.datosU.phoneNumber)) {
            this.validationErrors.telefono = 'Ingresa un número de teléfono válido con al menos 10 dígitos.';
        }
    }
    if (!this.datosU.email) {
        this.validationErrors.email = 'El correo electrónico es obligatorio.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.datosU.email)) {
        this.validationErrors.email = 'Ingresa un correo electrónico válido.';
    }
    if (!this.datosU.password) {
        this.validationErrors.password = 'La contraseña es obligatoria.';
    } else {
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
    let strengthScore = 0;
    if (password.length >= 8) {
        strengthScore += 20;
    } else if (password.length >= 12) {
        strengthScore += 30;
    } else if (password.length >= 16) {
        strengthScore += 40;
    }
    if (/[A-Z]/.test(password)) {
        strengthScore += 20;
    }
    if (/[a-z]/.test(password)) {
        strengthScore += 20;
    }
    if (/[0-9]/.test(password)) {
        strengthScore += 20;
    }
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        strengthScore += 20;
    }
    this.updatePasswordStrengthVisual(strengthScore);
}

updatePasswordStrengthVisual(strengthScore: number) {
    this.passwordStrengthScore = strengthScore;
    if (strengthScore < 40) {
        this.passwordStrengthLevel = 'Tu contraseña es débil';
    } else if (strengthScore >= 40 && strengthScore < 85) {
        this.passwordStrengthLevel = 'Tu contraseña es intermedia';
    } else {
        this.passwordStrengthLevel = 'Tu contraseña es fuerte';
    }
}

  async signInWithGoogle() {
    try {
      const response = await this.usuarioService.loginWithGoogle();
      console.log('Inicio de sesión con Google exitoso.', response);
    } catch (error) {
      console.error('Error en el inicio de sesión con Google:', error);
    }
  }

  async signInWithFacebook() {
    try {
      const response = await this.usuarioService.loginWithFacebook();
      console.log('Inicio de sesión con Facebook exitoso.', response);
    } catch (error) {
      console.error('Error en el inicio de sesión con Facebook:', error);
    }
  }

  onCaptchaResolved(token: string | null): void {
    if (token) {
      this.captchaVerified = true;
      this.onSubmit();
    } else {
      this.captchaVerified = false;
    }
  }
}