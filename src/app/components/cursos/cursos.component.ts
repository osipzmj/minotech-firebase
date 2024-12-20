import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { User } from '@angular/fire/auth';
import Curso from 'src/app/interfaces/curso.interface';
import { CursosService } from 'src/app/services/cursos.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-cursos',
  templateUrl: './cursos.component.html',
  styleUrls: ['./cursos.component.css']
})
export class CursosComponent implements OnInit {
  @ViewChild('paypal', { static: true }) paypalElement!: ElementRef;
  @ViewChild('btnCompartir', { static: false }) btnCompartir!: ElementRef;
  @ViewChild('mensaje', { static: false }) mensaje!: ElementRef;
  
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
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('uid');
    this.cursoService.obtenerCursos().subscribe(cursos => {
      this.cursos = cursos;
      if (id !== null) {
        this.cursoService.getDocumentByName<Curso>('cursos', 'uid', id)
            .then(curso => {
                if (curso) {
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
    });

    (await this.authService.stateUser()).subscribe((user: User | null) => {
      if (user) {
        this.isUserLoggedIn = true;
      } else {
        this.isUserLoggedIn = false;
        this.rol = null;
      }
    });

    this.initWebShare();
  }

  initWebShare(): void {
    if (navigator.share) {
      const btnCompartir = this.btnCompartir.nativeElement;
      btnCompartir.addEventListener('click', () => {
        const opciones = {
          title: 'Conociendo el API Web Share',
          text: 'Compartiendo contenido a través de la API',
          url: 'https://minotech-bf654.firebaseapp.com/'
        };

        navigator
          .share(opciones)
          .then(() => console.log('¡Compartido exitosamente!'))
          .catch(error => console.log('Error al compartir:', error));
      });
    } else {
      const mensaje = this.mensaje.nativeElement;
      this.btnCompartir.nativeElement.style.display = 'none';
      mensaje.textContent =
        'Este navegador no tiene soporte para el API Web Share';
    }
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
      this.cursoService.obtenerCursos().subscribe(cursos => {
        this.cursos = cursos;
      });
    } else {
      this.cursoService.obtenerCursos().subscribe(cursos => {
        this.cursos = cursos.filter(curso =>
          curso.nombreCurso.toLowerCase().includes(this.searchTerm.trim().toLowerCase())
        );
      });
    }
  }

  verInfo(curso: Curso) {
    const cursoUid = curso.id;
    this.router.navigate([`/contenido-curso/${cursoUid}`]);
  }
}
