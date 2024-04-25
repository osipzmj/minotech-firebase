import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  formulario: FormGroup;
  captchaVerified = false;
  captchaVisible = false;
  @ViewChild('reCaptcha') reCaptchaRef: ElementRef | undefined;

  passwordType: string = 'password';


  

  //usersService = inject(UsersService);
  router = inject(Router)

  constructor( private usuarioService: UsuariosService, private fb: FormBuilder,private toastr: ToastrService) {
    this.formulario = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
  });
  }
  showSuccess() {
    this.toastr.success('Hello world!', 'Toastr fun!');
  }
  togglePasswordVisibility(): void {
    this.passwordType = this.passwordType === 'password' ? 'text' : 'password';
}

  onSubmit(): void {
    if (!this.formulario.valid) {
        // Marca todos los controles como tocados para mostrar errores
        this.formulario.markAllAsTouched();
        this.toastr.warning('Por favor, completa todos los campos correctamente.');
        return;
    }
    
    if (!this.captchaVerified) {
        // Si el captcha no está verificado, solicita que lo complete
        this.captchaVisible = true;
        this.toastr.info('Por favor, completa el reCAPTCHA para continuar.');
        return;
    }

    // Si el formulario es válido y el captcha está verificado, envía la solicitud de inicio de sesión
    this.usuarioService.login(this.formulario.value)
        .then(response => {
            console.log(response);
            this.router.navigate(['/home']);
            this.toastr.success("Bienvenido de nuevo " + this.formulario.value.email);
        })
        .catch(error => {
            console.error(error);
            this.toastr.warning("Upss... Parece que algo salió mal. Revisa que tu correo o tu contraseña sean correctos.");
            
            // Intenta reiniciar el reCAPTCHA después de un breve retraso
            setTimeout(() => {
                if (this.reCaptchaRef && this.reCaptchaRef.nativeElement) {
                    this.reCaptchaRef.nativeElement.reset();
                    this.captchaVerified = false;
                }
            }, 1000);
        });
}

  

  resetPassword(event: Event) {
    event.preventDefault(); // Evita que el enlace navegue a otra página.

    // Obtén el control de correo electrónico.
    const emailControl = this.formulario.get('email');

    // Verifica que el control de correo electrónico existe y tiene un valor válido.
    if (emailControl && emailControl.value) {
        const email = emailControl.value;
        this.usuarioService.recuperarContrasena({
          email,
          uid: undefined,
          nombre: undefined,
          edad: undefined,
          telefono: undefined,
          password: undefined,
          rol: 'estandar'
        }) // Asegúrate de pasar un objeto con el campo `email`.
            .then(() => {
                this.toastr.info('Se ha enviado un correo de recuperación de contraseña.');
            })
            .catch(error => {
                console.error('Error al enviar el correo de recuperación:', error);
                this.toastr.warning('Error al intentar recuperar la contraseña.');
            });
    } else {
        this.toastr.warning('Por favor ingresa un correo electrónico válido.');
    }
}

// Método que se llama cuando el reCAPTCHA se resuelve
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
