import { Component, inject } from '@angular/core';
import { EmailAuthCredential } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/interfaces/usuario';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { CursosService } from 'src/app/services/cursos.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {
 
  showModal: boolean = false;
  datosU: Usuario = {
    uid: null,
    nombre: null,
    edad: null, // Inicializado a null
    email: null,
    telefono: null,
    rol: 'estandar',
    password: null // Inicializado a undefined
};


  constructor(private usuarioService: UsuariosService,
    private router: Router, private cursoService: CursosService
    ) {
  }


  async onSubmit() {

    console.log( 'datosU -> ', this.datosU)
    const res  = await this.usuarioService.registro(this.datosU).catch(error => {
      console.log(error)
    })
    if (res){
      console.log("Registro exitoso");
      const path = 'Usuarios';
      const id = res.user.uid
      this.datosU.uid= id;
      this.datosU.password = null
     await this.cursoService.createDoc(this.datosU, path, id)
     alert("Registro exitoso. Bienvenido " + this.datosU.nombre)
     this.router.navigate(['/home'])
    }
    // try {
    //   const response = await this.usuarioService.registro(this.datosU);
    //   // Manejo después del registro exitoso...
    //   console.log('Registro exitoso, por favor verifica tu correo electrónico.', response);
    //   this.showModal = true;
    // } catch (error: any) { // Aquí se utiliza 'any' para poder acceder a 'error.code'
    //   console.error('Error en el registro:', error);

    //   // Asegurándonos de que el error tiene la propiedad 'code' antes de comparar
    //   if (error.code === 'auth/email-already-in-use') {
    //     alert('Este correo electrónico ya está en uso. Por favor, utiliza otro correo.');
    //   } else {
    //     // Manejo de otros errores
    //     alert('Ocurrió un error durante el registro. Por favor, inténtalo de nuevo.');
    //   }
    // }
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