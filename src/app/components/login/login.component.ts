import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { ToastrService } from 'ngx-toastr';
import { User, user } from '@angular/fire/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  formulario: FormGroup;
  passwordType: string = 'password';
  router = inject(Router);

  
  constructor( private usuarioService: UsuariosService, private fb: FormBuilder,private toastr: ToastrService) {
    this.formulario = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      
  });
  }

  togglePasswordVisibility(): void {
    this.passwordType = this.passwordType === 'password' ? 'text' : 'password';
  }

  onSubmit(): void {
    if (!this.formulario.valid) {
        this.formulario.markAllAsTouched();
        this.toastr.warning('Por favor, completa todos los campos correctamente.');
        return;
    }

    this.usuarioService.login(this.formulario.value)
        .then(async (response) => {
            console.log(response);

            // Obtén el usuario autenticado
            const usuario: User = response.user;

            try {
                // Verificar correo electrónico del usuario
                await this.usuarioService.verificarCorreoElectronico(usuario);

                // Si el correo está verificado, permite al usuario navegar a la página de inicio
                this.router.navigate(['/home']);
                this.toastr.success("Bienvenido de nuevo " + this.formulario.value.email);
            } catch (error) {
                console.error('Error durante la verificación de correo electrónico:', error);
                this.toastr.info('Por favor verifica tu correo electrónico para continuar.');
                
                // Cierra sesión para evitar que el usuario acceda sin verificar su correo
                await this.usuarioService.logout();
                
                // Redirige al usuario a la página de inicio de sesión
                this.router.navigate(['/login']);
            }
        })
        .catch(error => {
            console.error('Error durante el inicio de sesión:', error);
            this.toastr.warning('Ups... Parece que algo salió mal. Revisa que tu correo o tu contraseña sean correctos.');
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
          rol: 'estandar' || 'admin' || null
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


}
