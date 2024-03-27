// import { Component } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';
// import { CursosService } from 'src/app/services/cursos.service';

// @Component({
//   selector: 'app-curso-detalle',
//   templateUrl: './curso-detalle.component.html',
//   styleUrls: ['./curso-detalle.component.css']
// })
// export class CursoDetalleComponent {

//   constructor(
//     private route: ActivatedRoute,
//     private cursosService: CursosService
//   ) { }
  
//   ngOnInit(): void {
//     this.obtenerCursoId();
//   }

//   obtenerCursoId(): void {
//     const _id = this.route.snapshot.paramMap.get('_id');
//     if (_id) {
//       this.cursosService.obtenerCursos(id).subscribe(curso => {
//         this.curso = curso;
//       });
//       console.log(this.curso)
//     } else {
//       // Manejar caso de ID nulo (por ejemplo, redirigir a una página de error)
//     }
//   }
// }
