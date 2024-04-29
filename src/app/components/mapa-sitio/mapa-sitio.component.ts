import { Component, OnInit } from '@angular/core';
import { CursosService } from 'src/app/services/cursos.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { Usuario } from 'src/app/interfaces/usuario';

@Component({
  selector: 'app-mapa-sitio',
  templateUrl: './mapa-sitio.component.html',
  styleUrls: ['./mapa-sitio.component.css']
})
export class MapaSitioComponent implements OnInit {
  isLoggedIn: boolean = false;
  isAdmin: boolean = false;
  rol: 'estandar' | 'admin' | null = null;
  isUserLoggedIn: boolean = false;

  constructor(
    private  _cursoService: CursosService,
    private userSer: UsuariosService) { }

  ngOnInit(): void {
    // Suscríbete al estado del usuario autenticado
    this.userSer.stateUser().subscribe(async user => {
        if (user) {
            // Si hay un usuario autenticado, establece isUserLoggedIn como true
            this.isUserLoggedIn = true;
            // Llama a getDatosUser para obtener los datos del usuario autenticado
            await this.getDatosUser(user.uid);
            // Después de que getDatosUser haya completado su ejecución,
            // el rol estará disponible aquí
            console.log(this.rol);
        } else {
            // Si no hay un usuario autenticado, establece isUserLoggedIn como false
            this.isUserLoggedIn = false;
            // Establece el rol como null
            this.rol = null;
        }
    });
}

  async getDatosUser(uid: string) {
    // Ruta de la colección en Firestore
    const path = 'Usuarios';
    const fieldName = 'uid';
    const id = uid;
    try {
        const usuario = await this._cursoService.getDocumentByName<Usuario>(path,fieldName, id);
        if (usuario) {
            this.rol = usuario.rol;
        } else {
            console.log("Usuario no encontrado");
            this.rol = null;
        }
    } catch (error) {
        console.error("Error al obtener los datos del usuario:", error);
        this.rol = null;
    }
}

  esAdmin(): boolean {
    return this.isAdmin;
  }

  noEstaAutenticado(): boolean {
    return !this.isLoggedIn;
  }
}