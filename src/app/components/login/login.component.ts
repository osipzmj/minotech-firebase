import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { ToastrService } from 'ngx-toastr';
import { ApplicationVerifier, Auth, RecaptchaVerifier, User, signInWithPhoneNumber } from '@angular/fire/auth';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  formulario: FormGroup;
  passwordType: string = 'password';
  router = inject(Router);
  phoneNumber: any;
  private loggedInSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private recaptchaVerifier: ApplicationVerifier | null = null;
  
  constructor( private usuarioService: UsuariosService, private fb: FormBuilder,private toastr: ToastrService, private auth: Auth) {
    this.formulario = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phoneNumber: ['', [Validators.required, Validators.minLength(10)]],
      
  });
  }


  togglePasswordVisibility(): void {
    this.passwordType = this.passwordType === 'password' ? 'text' : 'password';
  }

  onSubmit(): void {
    if (!this.formulario.valid) {
        this.formulario.markAllAsTouched();
        this.toastr.warning('phoneNumber: stringPor favor, completa todos los campos correctamente.');
        return;
    }

    this.usuarioService.login(this.formulario.value)
        .then(async (response) => {
            console.log(response);
            const usuario: User = response.user;
            try {
                await this.usuarioService.verificarCorreoElectronico(usuario)
                this.router.navigate(['/home']);
                this.toastr.success("Bienvenido de nuevo " + this.formulario.value.email);
            } catch (error) {
                console.error('Error durante la verificación de correo electrónico:', error);
                this.toastr.info('Por favor verifica tu correo electrónico para continuar.');
                await this.usuarioService.logout();
                this.router.navigate(['/login']);
            }
        })
        .catch(error => {
            console.error('Error durante el inicio de sesión:', error);
            this.toastr.warning('Ups... Parece que algo salió mal. Revisa que tu correo o tu contraseña sean correctos.');
        });
  }


  resetPassword(event: Event) {
    event.preventDefault();
    const emailControl = this.formulario.get('email');
    if (emailControl && emailControl.value) {
        const email = emailControl.value;
        this.usuarioService.recuperarContrasena({
          email,
          uid: undefined,
          nombre: undefined,
          edad: undefined,
          phoneNumber: undefined,
          password: undefined,
          rol: 'estandar' || 'admin' || null
        })
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

obtenerOTP(phoneNumber: string){
  this.recaptchaVerifier = new RecaptchaVerifier(this.auth,'recaptcha-container', {'size': 'invisible'} )
  console.log("puto2")
  return signInWithPhoneNumber(this.auth, phoneNumber, this.recaptchaVerifier)
  .then((confirmationResult) => {
    localStorage.setItem('verificationId', JSON.stringify(confirmationResult.verificationId))
    this.router.navigate(['/verificacion'])
  }).catch((error) => {
      setTimeout(() => {
          window.location.reload();
      }, 10000); 
    console.error('Error en signInWithPhoneNumber:', error);
  });
}

}