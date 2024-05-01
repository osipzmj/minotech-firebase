import { ElementRef, HostListener, OnInit, Renderer2 } from '@angular/core';
import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/interfaces/usuario';
import { CursosService } from 'src/app/services/cursos.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-navegacion',
  templateUrl: './navegacion.component.html',
  styleUrls: ['./navegacion.component.css']
})
export class NavegacionComponent implements OnInit{
  mostrarMenuSecundario: boolean = false;
  menuValue:boolean = false;
  menu_icon: string = 'bi bi-list';
  rol: 'estandar' | 'admin' | 'profesor' | null = null;
  nombre = '';
  terminoBusqueda: string = '';
  formulario: FormGroup;
  isUserLoggedIn: boolean = false;

  
  constructor(
    private  _cursoService: CursosService,
    private el: ElementRef,
    private authService: UsuariosService, 
    private router: Router,
    private toastr: ToastrService,   
  ){ 
    this.formulario = new FormGroup({
      username: new FormControl(),
      email: new FormControl(),
      password: new FormControl(),
    })

  }

  ngOnInit(): void {
    this.authService.stateUser().subscribe(async user => {
        if (user) {
            this.isUserLoggedIn = true;
            await this.getDatosUser(user.uid);
        } else {
            this.isUserLoggedIn = false;
            this.rol = null;
        }
    });
}

  async getDatosUser(uid: string) {
    const path = 'Usuarios';
    const fieldName = 'uid';
    const id = uid;
    try {
        const usuario = await this._cursoService.getDocumentByName<Usuario>(path,fieldName, id);
        if (usuario) {
            this.rol = usuario.rol;
            console.log(this.rol)
            this.nombre = usuario.nombre;
        } else {
            console.log("Usuario no encontrado");
            this.rol = null;
        }
    } catch (error) {
        console.error("Error al obtener los datos del usuario:", error);
        this.rol = null;
    }
  }

  abrirMenu(){
    this.menuValue = !this.menuValue;
    this.menu_icon = this.menuValue ? 'bi bi-x' : 'bi bi-list';
  }

  cerrarMenu(){
    this.menuValue = false;
    this.menu_icon = 'bi bi-list'; 
  }

  @HostListener('document:keydown.escape', ['$event'])
  onDocumentEscape(event: KeyboardEvent): void {
    this.cerrarMenu();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const clickedInsideMenu = this.el.nativeElement.contains(event.target);
    
    if (!clickedInsideMenu) {
      this.cerrarMenu();
    }
  }

  login() {
    this.authService.login(this.formulario.value);
  }

  register() {
    this.authService.registro(this.formulario.value);
  }

  logout(){
    this.authService.logout();
    this.toastr.info("Sesión finalizada")
    this.router.navigate(['/login'])
  }

  buscar(busqueda: string) {
    const busquedaNormalizada = busqueda.trim().toLowerCase();
    if (busquedaNormalizada.includes('inicio')) {
        this.router.navigate(['/home']);
    } else if (busquedaNormalizada.includes('cursos')) {
        this.router.navigate(['/cursos']);
    } else if (busquedaNormalizada.includes('crear curso')) {
        this.router.navigate(['/agregar-curso']);
    } else if (busquedaNormalizada.includes('crear')) {
      this.router.navigate(['/agregar-curso']);
    } else if (busquedaNormalizada.includes('iniciar sesión')) {
        this.router.navigate(['/login']);
    } else if (busquedaNormalizada.includes('iniciar sesion')) {
      this.router.navigate(['/login']);
    } else if (busquedaNormalizada.includes('iniciar')) {
      this.router.navigate(['/login']);
    } else if (busquedaNormalizada.includes('sesion')) {
      this.router.navigate(['/login']);
    } else if (busquedaNormalizada.includes('sesión')) {
      this.router.navigate(['/login']);
    } else if (busquedaNormalizada.includes('registro')) {
        this.router.navigate(['/registro']);
    } else if (busquedaNormalizada.includes('cerrar sesión')) {
        this.router.navigate(['/login']);
    } else if (busquedaNormalizada.includes('mapa del sitio')) {
        this.router.navigate(['/mapa']);
    } else if (busquedaNormalizada.includes('mapa')) {
      this.router.navigate(['/mapa']);
    } else if (busquedaNormalizada.includes('sitio')) {
      this.router.navigate(['/mapa']);
    } else if (busquedaNormalizada.includes('preguntas')) {
      this.router.navigate(['/preguntas']);
    } else if (busquedaNormalizada.includes('preguntas frecuentes')) {
      this.router.navigate(['/preguntas']);
    } else {
        console.log('No se encontró ninguna página para el término de búsqueda ingresado.');
    }
}
}
