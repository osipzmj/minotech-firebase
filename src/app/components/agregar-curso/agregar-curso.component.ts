import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { CursosService } from 'src/app/services/cursos.service';
//import { Storage, ref, uploadBytes } from '@angular/fire/storage';

@Component({
  selector: 'app-agregar-curso',
  templateUrl: './agregar-curso.component.html',
  styleUrls: ['./agregar-curso.component.css']
})
export class AgregarCursoComponent implements OnInit {

  cursoForm: FormGroup;

  constructor(
    private cursoService: CursosService,
    //private storage: Storage
  ) {
    this.cursoForm = new FormGroup({
      nombreCurso: new FormControl(),
      horas: new FormControl(),
      tipoCurso: new FormControl(),
      img: new FormControl(),
      descripcion: new FormControl(),
      idioma: new FormControl(),
      valoracion: new FormControl(),
      pais: new FormControl(),
      precio: new FormControl()
    })
  }

  ngOnInit(): void {
  }

  async enviarDatos(){
    console.log(this.cursoForm.value)
    const response = await this.cursoService.addCurso(this.cursoForm.value);
    console.log(response)
  }

  // uploadImage($event: any){
  //   const file = $event.target.files[0];
  //   console.log(file);

  //   const imgRef = ref(this.storage, `img/${file.name}`)

  //   uploadBytes(imgRef, file)
  //   .then()
  //   .catch(error => console.log(error));

  // }

}
