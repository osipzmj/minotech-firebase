import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { CursosService } from 'src/app/services/cursos.service';
import { Storage, ref, uploadBytes, listAll, getDownloadURL } from '@angular/fire/storage';

// Lista de países válidos
const paisesValidos = ['Argentina', 'Estados Unidos','Canadá', 'Bolivia', 'Brasil', 'Chile', 'Colombia', 'Costa Rica', 'Cuba', 'Ecuador', 'El Salvador', 'Guatemala', 'Honduras', 'México', 'Nicaragua', 'Panamá', 'Paraguay', 'Perú', 'Puerto Rico', 'República Dominicana', 'Uruguay', 'Venezuela'];
const idiomasValidos = ['Español', 'Inglés', 'Portugués', 'Frances'];

@Component({
  selector: 'app-agregar-curso',
  templateUrl: './agregar-curso.component.html',
  styleUrls: ['./agregar-curso.component.css']
})
export class AgregarCursoComponent implements OnInit {
  cursoForm: FormGroup;
  images: string[];
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
      temas: new FormControl('', Validators.required)
    });
    this.images = [];
  }

  ngOnInit(): void {
    this.getImagenes();
  }

  async enviarDatos() {
    this.formTouched = true; // Marcamos el formulario como tocado al enviar los datos
    
    // Verificamos si el formulario es válido
    if (this.cursoForm.valid) {
      // Obtenemos el curso desde el formulario
      const cursoData = this.cursoForm.value;
      
    
    // Si hay una imagen, la subimos y obtenemos la URL
    if (cursoData.img) {
      const file = cursoData.img;
      const imgRef = ref(this.storage, `img/${file.name}`);
      
      try {
        const response = await uploadBytes(imgRef, file);
        console.log('Imagen subida con éxito:', response);
        
        // Obtenemos la URL de la imagen subida
        const imageUrl = await getDownloadURL(imgRef);
        
        // Agregamos la URL de la imagen a los datos del curso
        cursoData.imgUrl = imageUrl;
      } catch (error) {
        console.log('Error al subir imagen:', error);
        return;
      }
    }
    
    // Enviamos los datos del curso al servicio
    try {
      const response = await this.cursoService.addCurso(cursoData);
      console.log('Curso agregado con éxito:', response);
      // Limpiamos el formulario después de enviar los datos correctamente
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

    // Guardamos el archivo en el formulario
    this.cursoForm.patchValue({ img: file });
  }

  async getImagenes() {
    const imagesRef = ref(this.storage, 'img');
    
    try {
      const response = await listAll(imagesRef);
      console.log('Imágenes encontradas:', response);
      
      // Limpia la lista de imágenes
      this.images = [];
      
      for (let item of response.items) {
        const url = await getDownloadURL(item);
        this.images.push(url);
      }
      
      console.log('URLs de imágenes:', this.images);
    } catch (error) {
      console.log('Error al obtener imágenes:', error);
    }
  }

  // Validador personalizado para verificar si el país es válido
validarPais(control: FormControl): { [key: string]: boolean } | null {
  if (control.value && paisesValidos.indexOf(control.value) === -1) {
    return { 'paisInvalido': true };
  }
  return null;
}

  // Validador personalizado para verificar si el idioma es válido
  validarIdioma(control: FormControl): { [key: string]: boolean } | null {
    if (control.value && idiomasValidos.indexOf(control.value) === -1) {
      return { 'idiomaInvalido': true };
    }
    return null;
  }

// Método para limpiar las validaciones del formulario
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