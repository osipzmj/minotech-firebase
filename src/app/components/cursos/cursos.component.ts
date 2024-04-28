import { Component } from '@angular/core';
import { User } from '@angular/fire/auth';
import Curso from 'src/app/interfaces/curso.interface';
import { Usuario } from 'src/app/interfaces/usuario';
import { CursosService } from 'src/app/services/cursos.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { FilterPipe } from 'src/pipes/filter.pipe';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cursos',
  templateUrl: './cursos.component.html',
  styleUrls: ['./cursos.component.css']
})
export class CursosComponent {

cursos: Curso[];
searchTerm='';
isUserLoggedIn: boolean = false;
isInscrito = false;
rol: 'estandar' | 'admin' | null = null;

modalAbierto: number = -1;

constructor( private cursoService: CursosService, private authService: UsuariosService, private toastr: ToastrService ){
this.cursos = []
}

  async ngOnInit(): Promise<void>{
  this.cursoService.obtenerCursos().subscribe(cursos => {
    this.cursos = cursos;
  })

  // ;(await this.authService.stateUser()).subscribe((user: User | null) => {
  //   if (user) {
  //     this.isUserLoggedIn = true;
  //     // this.getDatosUser(user.uid);
  //   } else {
  //     this.isUserLoggedIn = false;
  //     this.rol = 'admin' || 'estandar';
  //   }
  // });
}

async onClickDelete(curso: Curso){
  const response = await this.cursoService.eliminarCurso(curso)
}

abrirModal(modalId: string): void {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('show');
  }
}

cerrarModal(modalId: string): void {
  const modal = document.getElementById(modalId);
  if (modal) {
      modal.classList.remove('show'); // Remueve la clase show para ocultar el modal con la animación
  }

}

applyFilter() {
  if (this.searchTerm.trim() === '') {
    // Si la barra de búsqueda está vacía, muestra todos los cursos
    this.cursoService.obtenerCursos().subscribe(cursos => {
      this.cursos = cursos;
    });
  } else {
    // Si hay un término de búsqueda, filtra los cursos
    this.cursoService.obtenerCursos().subscribe(cursos => {
      this.cursos = cursos.filter(curso =>
        curso.nombreCurso.toLowerCase().includes(this.searchTerm.trim().toLowerCase())
      );
    });
  }
}

onInscribir() {
  if (this.isUserLoggedIn) {
    // Aquí puedes agregar la lógica para inscribir al usuario en el curso
    // Si la inscripción es exitosa, cambia el estado de isInscrito a true
    this.isInscrito = true;
    // También puedes realizar otras acciones, como enviar datos al backend
  } else {
    this.toastr.info('Debes iniciar sesión para inscribirte.');
  }
}

// getDatosUser(uid: string) {
//   const path = "Usuarios";
//   this.cursoService.getDatos<Usuario>(path, uid).subscribe(user => {
//       console.log('datos ->', user);
//       if (user) {
//           this.rol = user.rol; // Utilizando el rol del usuario
//       }
//   });
// }


}
