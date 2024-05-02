import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { ToastrService } from 'ngx-toastr';
import { CursosService } from 'src/app/services/cursos.service';
import { Usuario } from 'src/app/interfaces/usuario';
import { User } from '@angular/fire/auth';

@Component({
  selector: 'app-login',
  templateUrl:  './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent  implements OnInit{
  formulario: FormGroup;
  passwordType: string = 'password';
  router = inject(Router);
  phoneNumber: any;
  rol: 'estandar' | 'admin' | 'profesor' | null = null;
  isUserLoggedIn: boolean = false;
  nombre = '';
  isUserEnrolledInMFA: boolean = false;

  constructor( private usuarioService: UsuariosService, private fb: FormBuilder,private toastr: ToastrService, private _cursosService: CursosService) {
    this.formulario = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      // phoneNumber: ['', [Validators.required, Validators.minLength(10)]],
      
  });
  }

  ngOnInit(): void {
   this.usuarioService.stateUser().subscribe(async user => {
        if (user) {
            this.isUserLoggedIn = true;
            await this.getDatosUser(user.uid);
        } else {
            this.isUserLoggedIn = false;
            this.rol = null;
        }
    });
  }

  async getDatosUser(uid: string) {
    const path = 'Usuarios';
    const fieldName = 'uid';
    const id = uid;
    try {
        const usuario = await this._cursosService.getDocumentByName<Usuario>(path,fieldName, id);
        if (usuario) {
            this.rol = usuario.rol;
            console.log(this.rol)
            this.nombre = usuario.nombre;
        } else {
            console.log("Usuario no encontrado");
            this.rol = null;
        }
    } catch (error) {
        console.error("Error al obtener los datos del usuario:", error);
        this.rol = null;
    }
  }

  togglePasswordVisibility(): void {
    this.passwordType = this.passwordType === 'password' ? 'text' : 'password';
  }

  async onSubmit(): Promise<void> {
    if (!this.formulario.valid) {
        this.formulario.markAllAsTouched();
        this.toastr.warning('Por favor, completa todos los campos correctamente.');
        return;
    }

    try {
        const response = await this.usuarioService.login(this.formulario.value);
        const usuario = response.user;

        // Verifica si el correo electrónico está verificado
        await this.usuarioService.verificarCorreoElectronico(usuario);

        // Después de un inicio de sesión exitoso, redirige a la página de verificación
        this.router.navigate(['/home']);
        this.toastr.success('Hola... Bienvenido' +' '+ usuario.email);
    } catch (error) {
        console.error('Error durante el inicio de sesión:', error);
        this.toastr.warning('Error durante el inicio de sesión.');
    }
  }



  async checkUserMFAStatus(user: User) {
    // Verifica si el usuario está inscrito en MFA
    this.isUserEnrolledInMFA = await this.usuarioService.verifyIsUserIsEnrolled(user);
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

  // loginTel(phoneNumber: string){
  //   this.usuarioService.obtenerOTP(phoneNumber)
  //   console.log("ENTRANDO A CÓDIGO")
  // }


}