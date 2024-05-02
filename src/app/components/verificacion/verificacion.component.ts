import { Component, OnInit } from '@angular/core';
import { Auth, PhoneAuthProvider, signInWithCredential } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CursosService } from 'src/app/services/cursos.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { Usuario } from 'src/app/interfaces/usuario';

@Component({
  selector: 'app-verificacion',
  templateUrl: './verificacion.component.html',
  styleUrls: ['./verificacion.component.css']
})
export class VerificacionComponent implements OnInit {
  otp!: string
  verify: any;
  nombre = '';
  rol: 'estandar' | 'admin' | 'profesor' | null = null;
  terminoBusqueda: string = '';
  isUserLoggedIn: boolean = false;

  constructor( private cursoService: CursosService, private authService: UsuariosService, private toastr: ToastrService, private auth: Auth, private router: Router ){
      this.nombre 
    }
  
  ngOnInit() {
    this.verify = JSON.parse(localStorage.getItem('verificationId') || '{}')
    console.log(this.verify);
  }

  config = {
    allowNumbersOnly: true,
    length: 6,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: '',
    inputStyles: {
      width: '50px',
      height: '50px',
    },
  };

  async getDatosUser(uid: string) {
    const path = 'Usuarios';
    const fieldName = 'uid';
    const id = uid;
    try {
        const usuario = await this.cursoService.getDocumentByName<Usuario>(path,fieldName, id);
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

  onOtpChange(otpCode: any){
    this.otp = otpCode;
    console.log(this.otp);
  }

  async handleClick() {
    try {
        // Obtiene las credenciales usando el verificationId y el OTP
        const credentials = PhoneAuthProvider.credential(this.verify, this.otp);

        // Realiza la autenticación con las credenciales
        const response = await signInWithCredential(this.auth, credentials);

        // Si la autenticación es exitosa, almacena los datos del usuario
        localStorage.setItem('user-data', JSON.stringify(response));

        // Redirige al usuario a la página de inicio
        this.router.navigate(['/home']);
        this.toastr.success('Código verificado con éxito. Bienvenido ' + this.nombre);
    } catch (error) {
        console.error('Error de autenticación:', error);
        // Mostrar mensaje de error
        this.toastr.warning('Código de verificación inválido, por favor inténtalo de nuevo.');
    }
  }

  


}
