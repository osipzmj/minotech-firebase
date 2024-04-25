import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { CursosService } from 'src/app/services/cursos.service';
import { Storage, ref, uploadBytes, listAll, getDownloadURL } from '@angular/fire/storage';

@Component({
  selector: 'app-agregar-curso',
  templateUrl: './agregar-curso.component.html',
  styleUrls: ['./agregar-curso.component.css']
})
export class AgregarCursoComponent implements OnInit {
  cursoForm: FormGroup;
  images: string[];

  constructor(
    private cursoService: CursosService,
    private storage: Storage
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
      precio: new FormControl(),
      contenido: new FormControl()
    });
    this.images = [];
  }

  ngOnInit(): void {
    this.getImagenes();
  }

  async enviarDatos() {
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
    } catch (error) {
      console.log('Error al agregar curso:', error);
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
}