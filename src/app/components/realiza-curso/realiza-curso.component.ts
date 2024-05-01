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
  }

  onExam(curso: Curso) {
    const cursoUid = curso.id; 
    const url = `/examen/${cursoUid}`;
    window.open(url, '_blank');
}
}