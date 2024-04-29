import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { User } from '@angular/fire/auth';
import Curso from 'src/app/interfaces/curso.interface';
import { Usuario } from 'src/app/interfaces/usuario';
import { CursosService } from 'src/app/services/cursos.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-cursos',
  templateUrl: './cursos.component.html',
  styleUrls: ['./cursos.component.css']
})
export class CursosComponent implements OnInit {
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
    const id = this.route.snapshot.paramMap.get('uid');

    // Obtener todos los cursos
    this.cursoService.obtenerCursos().subscribe(cursos => {
      this.cursos = cursos;
      // Intentar obtener el curso por UID
      if (id !== null) {
        // Solo realiza la llamada si id tiene un valor válido
        this.cursoService.getDocumentByName<Curso>('cursos', 'uid', id)
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

      // Este bloque de código no está completo, se debe completar la lógica para obtener el curso.
    });

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

  async onClickDelete(curso: Curso) {
    // Llama al servicio para eliminar el curso
    const response = await this.cursoService.eliminarCurso(curso);
    // if (response) {
    //   // Realizar acciones adicionales si se elimina correctamente
    // }
  }

  abrirModal(modalId: string): void {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('show');
    }
  }

  cerrarModal(modalId: string): void {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('show');
    }
  }

  applyFilter() {
    if (this.searchTerm.trim() === '') {
      // Si la barra de búsqueda está vacía, muestra todos los cursos
      this.cursoService.obtenerCursos().subscribe(cursos => {
        this.cursos = cursos;
      });
    } else {
      // Si hay un término de búsqueda, filtra los cursos
      this.cursoService.obtenerCursos().subscribe(cursos => {
        this.cursos = cursos.filter(curso =>
          curso.nombreCurso.toLowerCase().includes(this.searchTerm.trim().toLowerCase())
        );
      });
    }
  }

  onInscribir(curso: Curso) {
    if (this.isUserLoggedIn) {
      // Aquí puedes agregar la lógica para inscribir al usuario en el curso
      this.isInscrito = true;
      const cursoUid = curso.id; // Asumiendo que cada curso tiene un UID
      const url = `/contenido-curso/${cursoUid}`;
      window.open(url, '_blank'); // Abre una nueva pestaña con la URL del curso específico
    } else {
      this.toastr.info('Debes iniciar sesión para inscribirte.');
    }
  }
}
