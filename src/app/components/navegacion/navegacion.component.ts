import { ElementRef, HostListener, OnInit, Renderer2 } from '@angular/core';
import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import Curso from 'src/app/interfaces/curso.interface';
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
    this.authService.stateUser();
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

  getDatosUser(uid: string){
    const path = "Usuarios";
    const id = uid;
    this._cursoService.getDatos(path, id).subscribe(res => {
      console.log('datos ->', res)
    })
  }
}
