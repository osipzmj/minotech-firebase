import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import Curso from 'src/app/interfaces/curso.interface';
import { CursosService } from 'src/app/services/cursos.service';
import { ToastrService } from 'ngx-toastr';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-contenido-curso',
  templateUrl: './contenido-curso.component.html',
  styleUrls: ['./contenido-curso.component.css']
})
export class ContenidoCursoComponent implements OnInit {
  curso: Curso | null = null;
  isInscrito = false;
  isUserLoggedIn = false;

  constructor(
    private route: ActivatedRoute,
    private cursoService: CursosService,
    private toastr: ToastrService,
    private usuariosService: UsuariosService
  ) { }

  ngOnInit(): void {
    // Obtener el UID del curso desde la ruta
    const cursoUid = this.route.snapshot.paramMap.get('cursoUid');

    // Obtener el curso por UID
    if (cursoUid) {
      this.cursoService.getCursoByUid(cursoUid)
        .then(curso => {
          if (curso) {
            // Asignar el curso obtenido para mostrar en el HTML
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
    // Suscríbete al observable de isLoggedIn del servicio de usuarios
  this.usuariosService.isLoggedIn().subscribe((loggedIn: boolean) => {
    this.isUserLoggedIn = loggedIn; // Actualiza el estado de inicio de sesión
  });
}

  onInscribir(curso: Curso) {
    if (this.isUserLoggedIn) {
      // Aquí puedes agregar la lógica para inscribir al usuario en el curso
      const cursoUid = curso.id; // Asumiendo que cada curso tiene un UID
      const url = `/examen/${cursoUid}`;
      window.open(url, '_blank'); // Abre una nueva pestaña con la URL del curso específico
    } else {
      this.toastr.info('Debes iniciar sesión para inscribirte.');
    }
  }
}
