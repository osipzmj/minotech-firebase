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
  styleUrls: ['./registro.component.css'],
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
    password: null, // Inicializado a undefined
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
    private cursoService: CursosService
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
    }

    // Verifica que el correo electrónico esté presente y sea válido
    if (!this.datosU.email) {
      this.validationErrors.email = 'El correo electrónico es obligatorio.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.datosU.email)) {
      this.validationErrors.email = 'Ingresa un correo electrónico válido.';
    }

    // Verifica que la contraseña esté presente y tenga al menos 6 caracteres
    if (!this.datosU.password) {
      this.validationErrors.password = 'La contraseña es obligatoria.';
    } else if (this.datosU.password.length < 6) {
      this.validationErrors.password =
        'La contraseña debe tener al menos 6 caracteres.';
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
      this.datosU.password = null;

      // Guarda los datos en Firestore o realiza otras operaciones
      await this.cursoService.createDoc(this.datosU, path, id);

      alert(`Registro exitoso. Bienvenido ${this.datosU.nombre}`);
      this.router.navigate(['/home']);
    } catch (error: any) {
      console.error('Error en el registro:', error);
      if (error.code === 'auth/email-already-in-use') {
        alert(
          'Este correo electrónico ya está en uso. Por favor, utiliza otro correo.'
        );
      } else {
        alert(
          'Ocurrió un error durante el registro. Por favor, inténtalo de nuevo.'
        );
      }
    }
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
