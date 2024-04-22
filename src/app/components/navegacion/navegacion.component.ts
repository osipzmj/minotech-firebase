import { ElementRef, HostListener, OnInit, Renderer2 } from '@angular/core';
import { Component } from '@angular/core';
import { User } from '@angular/fire/auth';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import Curso from 'src/app/interfaces/curso.interface';
import { Usuario } from 'src/app/interfaces/usuario';
import { CursosService } from 'src/app/services/cursos.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
@Component({
  selector: 'app-navegacion',
  templateUrl: './navegacion.component.html',
  styleUrls: ['./navegacion.component.css']
})
export class NavegacionComponent implements OnInit{

  menuValue:boolean = false;
  menu_icon: string = 'bi bi-list';
  rol: 'estandar' | 'admin' | null = null;
  // isLoginIn: boolean = false;

  terminoBusqueda: string = '';
  resultados: Curso[] | undefined;
  formulario: FormGroup;
  isUserLoggedIn: boolean = false;

  
  constructor(
    private  _cursoService: CursosService,
    private el: ElementRef, private renderer: Renderer2,
    private authService: UsuariosService, 
    private router: Router
    
  ){ 
    this.formulario = new FormGroup({
      username: new FormControl(),
      email: new FormControl(),
      password: new FormControl(),
    })

  }

  ngOnInit(): void {
    this.authService.stateUser().subscribe((user: User | null) => {
      if (user) {
        this.isUserLoggedIn = true;
        this.getDatosUser(user.uid); // Esta función debería eventualmente asignar 'estandar' o 'admin' a `rol`
      } else {
        this.isUserLoggedIn = false;
        this.rol = 'admin' || 'estandar'; // Asegúrate que '' o null esté permitido según tu elección en la definición del tipo
      }
    });
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
    alert("Sesión finalizada")
    this.router.navigate(['/login'])
  }

  getDatosUser(uid: string) {
    const path = "Usuarios";
    this._cursoService.getDatos<Usuario>(path, uid).subscribe(user => {
        console.log('datos ->', user);
        if (user) {
            this.rol = user.rol; // Utilizando el rol del usuario
        }
    });
}
}
