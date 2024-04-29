import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { User } from '@angular/fire/auth';
import Curso from 'src/app/interfaces/curso.interface';
import { Usuario } from 'src/app/interfaces/usuario';
import { CursosService } from 'src/app/services/cursos.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-contenido-curso',
  templateUrl: './contenido-curso.component.html',
  styleUrls: ['./contenido-curso.component.css']
})
export class ContenidoCursoComponent {
  @ViewChild('paypal', { static: true }) paypalElement!: ElementRef;
  cursos: Curso[] = [];
  searchTerm = '';
  isUserLoggedIn = false;
  isInscrito = false;
  nombreCurso = ''
  rol: 'estandar' | 'admin' | null = null;
  modalAbierto = -1;

  constructor(
    private route: ActivatedRoute,
    private cursoService: CursosService,
    private authService: UsuariosService,
    private toastr: ToastrService
  ) {}

  async ngOnInit(): Promise<void> {
    // Obtener el UID del curso desde la ruta
    const id = this.route.snapshot.paramMap.get('id');

    // Obtener todos los cursos
      if (id !== null) {
        // Solo realiza la llamada si id tiene un valor válido
        this.cursoService.getDocumentByName<Curso>('cursos', 'id', id)
            .then(curso => {
                if (curso) {
                    // Lógica para manejar el curso obtenido
                    console.log(curso);
                } else {
                    console.log("Curso no encontrado");
                }
            })
            .catch(error => {
                console.error("Error al obtener los datos del curso:", error);
            });
    } else {
        console.log("No se encontró el UID en la URL");
    }


    // Observar el estado de autenticación del usuario
    (await this.authService.stateUser()).subscribe((user: User | null) => {
      if (user) {
        this.isUserLoggedIn = true;
        // Realizar acciones adicionales si el usuario está autenticado
      } else {
        this.isUserLoggedIn = false;
        this.rol = null;
      }
    });
  }

  cerrarModal(modalId: string): void {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('show');
    }
  }
  onInscribir(curso: Curso) {
    if (this.isUserLoggedIn) {
      // Aquí puedes agregar la lógica para inscribir al usuario en el curso
      this.isInscrito = true;
      const cursoUid = curso.id; // Asumiendo que cada curso tiene un UID
      const url = `/curso/${cursoUid}`;
      window.open(url, '_blank'); // Abre una nueva pestaña con la URL del curso específico
    } else {
      this.toastr.info('Debes iniciar sesión para inscribirte.');
    }
  }
}
