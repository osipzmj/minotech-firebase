import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CursosService } from 'src/app/services/cursos.service';
import { Storage } from '@angular/fire/storage';

const paisesValidos = ['Argentina', 'Estados Unidos','Canadá', 'Bolivia', 'Brasil', 'Chile', 'Colombia', 'Costa Rica', 'Cuba', 'Ecuador', 'El Salvador', 'Guatemala', 'Honduras', 'México', 'Nicaragua', 'Panamá', 'Paraguay', 'Perú', 'Puerto Rico', 'República Dominicana', 'Uruguay', 'Venezuela'];
const idiomasValidos = ['Español', 'Inglés', 'Portugués', 'Frances'];

@Component({
  selector: 'app-agregar-curso',
  templateUrl: './agregar-curso.component.html',
  styleUrls: ['./agregar-curso.component.css']
})
export class AgregarCursoComponent implements OnInit {
  cursoForm: FormGroup;
  formTouched: boolean = false;

  constructor(
    private cursoService: CursosService,
    private storage: Storage
  ) {
    this.cursoForm = new FormGroup({
      nombreCurso: new FormControl('', Validators.required),
      horas: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$')]),
      tipoCurso: new FormControl('', Validators.required),
      img: new FormControl(),
      descripcion: new FormControl('', Validators.required),
      idioma: new FormControl('', [Validators.required, this.validarIdioma.bind(this)]),
      valoracion: new FormControl('', Validators.pattern('^[0-9]*$')),
      pais: new FormControl('', [Validators.required, this.validarPais.bind(this)]),
      precio: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$')]),
      contenido: new FormControl('', Validators.required),
      temas: new FormControl('', Validators.required),
      lectura: new FormControl('', Validators.required),
      pregunta1: new FormControl('', Validators.required),
      p1res1: new FormControl('', Validators.required),
      p1res2: new FormControl('', Validators.required),
      p1res3: new FormControl('', Validators.required),
      pregunta2: new FormControl('', Validators.required),
      p2res1: new FormControl('', Validators.required),
      p2res2: new FormControl('', Validators.required),
      p2res3: new FormControl('', Validators.required),
      pregunta3: new FormControl('', Validators.required),
      p3res1: new FormControl('', Validators.required),
      p3res2: new FormControl('', Validators.required),
      p3res3: new FormControl('', Validators.required),
      pregunta4: new FormControl('', Validators.required),
      p4res1: new FormControl('', Validators.required),
      p4res2: new FormControl('', Validators.required),
      p4res3: new FormControl('', Validators.required),
      pregunta5: new FormControl('', Validators.required),
      p5res1: new FormControl('', Validators.required),
      p5res2: new FormControl('', Validators.required),
      p5res3: new FormControl('', Validators.required)
    });
  }

  ngOnInit(): void {}

  async enviarDatos() {
    this.formTouched = true;
    
    if (this.cursoForm.valid) {
      const cursoData = this.cursoForm.value;

    try {
      const response = await this.cursoService.addCurso(cursoData);
      console.log('Curso agregado con éxito:', response);
      this.cursoForm.reset();
      this.clearFormValidators(this.cursoForm);
    } catch (error) {
      console.log('Error al agregar curso:', error);
    }
  } else {
    console.log('El formulario no es válido.');
  }
}

  uploadImage($event: any) {
    const file = $event.target.files[0];
    console.log('Archivo seleccionado:', file);
  }

validarPais(control: FormControl): { [key: string]: boolean } | null {
  if (control.value && paisesValidos.indexOf(control.value) === -1) {
    return { 'paisInvalido': true };
  }
  return null;
}

  validarIdioma(control: FormControl): { [key: string]: boolean } | null {
    if (control.value && idiomasValidos.indexOf(control.value) === -1) {
      return { 'idiomaInvalido': true };
    }
    return null;
  }

clearFormValidators(form: FormGroup) {
  Object.keys(form.controls).forEach(key => {
    const control = form.get(key);
    if (control) {
      control.clearValidators();
      control.updateValueAndValidity();
    }
  });
}

}