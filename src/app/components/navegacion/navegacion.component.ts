import { ElementRef, HostListener, OnInit, Renderer2 } from '@angular/core';
import { Component } from '@angular/core';
import { User } from '@angular/fire/auth';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import Curso from 'src/app/interfaces/curso.interface';
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

  }

  // ngOnInit(): void {
  //   this.authService.stateUser();
  //   this.authService.stateUser().subscribe((user: User | null) => {
  //     if (user) {
  //       this.isUserLoggedIn = true;
  //       this.rol = 'admin' || 'estandar'; // Esta función debería eventualmente asignar 'estandar' o 'admin' a `rol`
  //     } else {
  //       this.isUserLoggedIn = false;
  //       this.rol = null; // Asegúrate que '' o null esté permitido según tu elección en la definición del tipo
  //     }
  //   });
  //   this.route.url.subscribe(url => {
  //     this.mostrarMenuSecundario = url[0].path === 'cursos';
  //   });    
  // }
  ngOnInit(): void {
    // Suscríbete al estado del usuario autenticado
    this.authService.stateUser().subscribe(user => {
        if (user) {
            // Si hay un usuario autenticado, establece isUserLoggedIn como true
            this.isUserLoggedIn = true;
            // Llama a getDatosUser para obtener los datos del usuario autenticado
            this.getDatosUser(user.uid);
            this.rol = this.rol
        } else {
            // Si no hay un usuario autenticado, establece isUserLoggedIn como false
            this.isUserLoggedIn = false;
            // Establece el rol como null
            this.rol = null;
        }
    });
  }
//   getDatosUser() {
//     const collectionPath = 'Usuarios';

//     this._cursoService.getDocument<Usuario>(collectionPath).subscribe(
//       (usuarios: Usuario[]) => {
//           // Iterar sobre cada usuario
//           usuarios.forEach(usuario => {
//               // Aquí puedes realizar las operaciones que necesites con cada usuario
//               console.log(usuario);
//           });
//       },
//       (error) => {
//           console.error("Error al obtener los datos de los usuarios:", error);
//       }
//   );
// }

//   getDatosUser(uid: string) {
//     const path = "Usuarios";
//     this._cursoService.getDocument<Usuario>(path).subscribe(user => {
//       console.log('datos ->', user);
//       if (user) {
//           this.rol = user.rol; // Utilizando el rol del usuario
//       }
//   });
// }

  // getDatosUser(uid: string) {
  //   const path = "Usuarios"; // Ruta de la colección de usuarios en Firestore

  //   // Llama al método getDatos de tu servicio para obtener los datos del usuario
  //   this._cursoService.getDocument<Usuario>(path, uid).subscribe(res => {
  //       if (res) {
  //           // Si hay una respuesta, asigna el rol del usuario a this.rol
  //           this.rol = res.rol;
  //       } else {
  //           // Si no se encontró el usuario, puedes manejarlo de acuerdo a tus necesidades
  //           console.log("Usuario no encontrado");
  //           this.rol = null;
  //       }
  //   }, (error) => {
  //       // Maneja los errores de la suscripción si es necesario
  //       console.error("Error al obtener los datos del usuario:", error);
  //       this.rol = null;
  //   });
  // }

  //NUEVAAAAAAAAAAAA
  getDatosUser(uid: string) {
    // Ruta de la colección en Firestore
    const path = 'Usuarios';
    const id = uid;
    console.log(uid)
    
    // Llama al método getDocument para obtener los datos del usuario
    this._cursoService.getDocument<Usuario>(path, id).subscribe(
        (res) => {
            if (res) {
                // Si el usuario existe, asigna el rol del usuario a this.rol
                this.rol = res.rol;
            } else {
                // Si el usuario no fue encontrado, establece el rol como null
                console.log(res)
                console.log("Usuario no encontrado");
                this.rol = null;
            }
        },
        (error) => {
            // Maneja los errores de la suscripción
            console.error("Error al obtener los datos del usuario:", error);
            this.rol = null; // Establece el rol como null en caso de error
        }
    );
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
