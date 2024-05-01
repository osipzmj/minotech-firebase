import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import Curso from 'src/app/interfaces/curso.interface';
import { CursosService } from 'src/app/services/cursos.service';

@Component({
  selector: 'app-realiza-curso',
  templateUrl: './realiza-curso.component.html',
  styleUrls: ['./realiza-curso.component.css']
})
export class RealizaCursoComponent {
  curso: Curso | null = null;

  constructor(
    private route: ActivatedRoute,
    private cursoService: CursosService
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
  }

  onExam(curso: Curso) {
    const cursoUid = curso.id; // Asumiendo que cada curso tiene un UID
    const url = `/examen/${cursoUid}`;
    window.open(url, '_blank'); // Abre una nueva pestaña con la URL del curso específico
}
}