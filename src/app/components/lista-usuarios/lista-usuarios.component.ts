import { Component, ElementRef, ViewChild } from '@angular/core';
import { Usuario } from 'src/app/interfaces/usuario';
import { CursosService } from 'src/app/services/cursos.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { ToastrService } from 'ngx-toastr';
import { User } from '@angular/fire/auth';

@Component({
  selector: 'app-lista-usuarios',
  templateUrl: './lista-usuarios.component.html',
  styleUrls: ['./lista-usuarios.component.css']
})
export class ListaUsuariosComponent {

usuarios: Usuario[];
searchTerm='';
isUserLoggedIn: boolean = false;
isInscrito = false;
rol: 'estandar' | 'admin' | null = null;

constructor( private cursoService: CursosService, private authService: UsuariosService, private toastr: ToastrService ){
  this.usuarios = []
  }

  async ngOnInit(): Promise<void>{
    this.cursoService.obtenerUsuarios().subscribe(usuarios => {
      this.usuarios = usuarios;
    })
  
    ;(await this.authService.stateUser()).subscribe((user: User | null) => {
      if (user) {
        this.isUserLoggedIn = true;
      } else {
        this.isUserLoggedIn = false;
        this.rol = null;
      }
    });
  }

  actualizarRolUsuario(usuario: Usuario) {
    const confirmacion = confirm('¿Estás seguro de que deseas actualizar el rol de este usuario?');
    
    if (confirmacion) {
      const datosActualizados = {
        nombre: usuario.nombre,
        email: usuario.email,
        phoneNumber: usuario.phoneNumber,
        edad: usuario.edad,
        rol: usuario.rol
      };
  
      this.cursoService.actualizarUsuario(usuario.uid, datosActualizados)
        .then(() => {
          this.toastr.success('El rol del usuario ha sido actualizado.');
        })
        .catch(error => {
          console.error('Error al actualizar el usuario:', error);
          this.toastr.error('Error al actualizar el usuario.');
        });
    }
  }
  

confirmarEliminacion(usuario: Usuario) {
    if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
        this.cursoService.eliminarUsuario(usuario)
            .then(() => {
                this.toastr.success('Usuario eliminado con éxito.');
            })
            .catch((error) => {
                console.error('Error al eliminar usuario:', error);
                this.toastr.error('Error al eliminar usuario.');
            });
    }
}

  applyFilter() {
    if (this.searchTerm.trim() === '') {
      this.cursoService.obtenerCursos().subscribe(cursos => {
        this.usuarios = this.usuarios;
      });
    } else {
      this.cursoService.obtenerUsuarios().subscribe(usr => {
        this.usuarios = usr.filter(usr =>
          usr.nombre.toLowerCase().includes(this.searchTerm.trim().toLowerCase())
        );
      });
    }
  }
}

