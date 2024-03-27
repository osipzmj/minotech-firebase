import { Component } from '@angular/core';
import Curso from 'src/app/interfaces/curso.interface';
import { CursosService } from 'src/app/services/cursos.service';
import { FilterPipe } from 'src/pipes/filter.pipe';

@Component({
  selector: 'app-cursos',
  templateUrl: './cursos.component.html',
  styleUrls: ['./cursos.component.css']
})
export class CursosComponent {

cursos: Curso[];
searchTerm='';

modalAbierto: number = -1;

constructor( private cursoService: CursosService ){
this.cursos = []
}

ngOnInit(): void{
  this.cursoService.obtenerCursos().subscribe(cursos => {
    this.cursos = cursos;
  })
}

async onClickDelete(curso: Curso){
  const response = await this.cursoService.eliminarCurso(curso)
}

abrirModal(modalId: string): void {
  const modal = document.getElementById(modalId);
  if (modal) {
      modal.classList.add('show'); // Agrega la clase show para mostrar el modal con la animación
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
    this.cursoService.obtenerCursos();
  } else {
    this.cursos = new FilterPipe().transform(this.cursos, this.searchTerm);
  }
}

}
