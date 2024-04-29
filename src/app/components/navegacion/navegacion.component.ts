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
  rol: 'estandar' | 'admin' | null = null;
  nombre = '';
  // isLoginIn: boolean = false;
  terminoBusqueda: string = '';
  formulario: FormGroup;
  isUserLoggedIn: boolean = false;

  
  constructor(
    private  _cursoService: CursosService,
    private el: ElementRef, private renderer: Renderer2,
    private authService: UsuariosService, 
    private router: Router,
    private toastr: ToastrService,
    private route: ActivatedRoute
    
  ){ 
    this.formulario = new FormGroup({
      username: new FormControl(),
      email: new FormControl(),
      password: new FormControl(),
    })

    this.authService.stateUser().subscribe(res => {
      if(res){
        res.uid
        console.log('Esta logueado');
        this.isUserLoggedIn = true;
        this.getDatosUser(res.uid);
      }
      else{
        console.log('No esta logueado');
        this.isUserLoggedIn = false
      }
    })

  }

  ngOnInit(): void {
    // Suscríbete al estado del usuario autenticado
    this.authService.stateUser().subscribe(async user => {
        if (user) {
            // Si hay un usuario autenticado, establece isUserLoggedIn como true
            this.isUserLoggedIn = true;
            // Llama a getDatosUser para obtener los datos del usuario autenticado
            await this.getDatosUser(user.uid);
            // Después de que getDatosUser haya completado su ejecución,
            // el rol estará disponible aquí
        } else {
            // Si no hay un usuario autenticado, establece isUserLoggedIn como false
            this.isUserLoggedIn = false;
            // Establece el rol como null
            this.rol = null;
        }
    });
}

  async getDatosUser(uid: string) {
    // Ruta de la colección en Firestore
    const path = 'Usuarios';
    const fieldName = 'uid';
    const id = uid;
    try {
        const usuario = await this._cursoService.getDocumentByName<Usuario>(path,fieldName, id);
        if (usuario) {
            this.rol = usuario.rol;
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
    this.authService.login(this.formulario.value); // Llama al método de inicio de sesión del servicio de autenticación
  }

  register() {
    this.authService.registro(this.formulario.value); // Llama al método de registro del servicio de autenticación
  }

  logout(){
    this.authService.logout();
    this.toastr.info("Sesión finalizada")
    this.router.navigate(['/login'])
  }

  buscar(busqueda: string) {
    // Elimina los espacios en blanco al inicio y al final del término de búsqueda
    const busquedaNormalizada = busqueda.trim().toLowerCase();

    // Redirige a la página correspondiente según el término de búsqueda
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
