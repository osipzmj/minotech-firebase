import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuariosService } from 'src/app/services/usuarios.service';


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

  
  //usersService = inject(UsersService);
  router = inject(Router)

  constructor( private usuarioService: UsuariosService) {
    this.formulario = new FormGroup({
      email: new FormControl(),
      password: new FormControl()
    })
  }

  onSubmit(): void {
    if (this.formulario.valid && this.captchaVerified) {
      this.usuarioService.login(this.formulario.value)
        .then(response => {
          console.log(response);
          this.router.navigate(['/home']);
          alert("Bienvenido de nuevo " + this.formulario.value.email);
        })
        .catch(error => {
          console.error(error);
          alert("Upss... Parece que algo salió mal. Revisa que tu correo o tu contraseña sean correctos.");
          
          // Intenta reiniciar el reCAPTCHA después de un breve retraso
          setTimeout(() => {
            if (this.reCaptchaRef && this.reCaptchaRef.nativeElement) {
              this.reCaptchaRef.nativeElement.reset();
              this.captchaVerified = false;
            }
          }, 1000);
        });
    } else if (this.formulario.valid && !this.captchaVerified) {
      this.captchaVisible = true;
      alert('Por favor, completa el reCAPTCHA para continuar.');
    } else if (!this.formulario.valid && !this.captchaVerified)
    {
      this.captchaVisible = false;
    } else {
      alert('Por favor, completa todos los campos correctamente.');
    }
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
                alert('Se ha enviado un correo de recuperación de contraseña.');
            })
            .catch(error => {
                console.error('Error al enviar el correo de recuperación:', error);
                alert('Error al intentar recuperar la contraseña.');
            });
    } else {
        alert('Por favor ingresa un correo electrónico válido.');
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
