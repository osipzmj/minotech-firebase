import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import Curso from 'src/app/interfaces/curso.interface';
import { CursosService } from 'src/app/services/cursos.service';
import { ToastrService } from 'ngx-toastr';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { User } from '@angular/fire/auth';

@Component({
  selector: 'app-contenido-curso',
  templateUrl: './contenido-curso.component.html',
  styleUrls: ['./contenido-curso.component.css']
})
export class ContenidoCursoComponent implements OnInit {
  curso: Curso | null = null;
  isInscrito = false;
  isUserLoggedIn = false;
  rol: 'estandar' | 'admin' | null = null;

  constructor(
    private route: ActivatedRoute,
    private cursoService: CursosService,
    private toastr: ToastrService,
    private usuariosService: UsuariosService
  ) { }

  async ngOnInit(): Promise<void> {
    const cursoUid = this.route.snapshot.paramMap.get('cursoUid');

    if (cursoUid) {
      this.cursoService.getCursoByUid(cursoUid)
        .then(curso => {
          if (curso) {
            this.curso = curso;
          } else {
            console.log("No se encontró el curso con el UID proporcionado.");
          }
        })
        .catch(error => {
          console.error("Error al obtener los datos del curso:", error);
        });
    } else {
      console.log("No se proporcionó un UID de curso válido en la URL");
    }

    (await this.usuariosService.stateUser()).subscribe((user: User | null) => {
      if (user) {
        this.isUserLoggedIn = true;
        // Realizar acciones adicionales si el usuario está autenticado
      } else {
        this.isUserLoggedIn = false;
        this.rol = null;
      }
    });
}

onInscribir(curso: Curso) {
  console.log("isUserLoggedIn:", this.isUserLoggedIn);
  if (this.isUserLoggedIn) {

    this.isInscrito = true
      const cursoUid = curso.id;
      const url = `/examen/${cursoUid}`;
      window.open(url, '_blank');
  } else {
      this.toastr.info('Debes iniciar sesión para inscribirte.');
  }
}
}
