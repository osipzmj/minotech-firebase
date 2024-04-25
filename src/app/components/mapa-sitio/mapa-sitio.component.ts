import { Component, OnInit } from '@angular/core';
import { UsuariosService } from '../../services/usuarios.service';

@Component({
  selector: 'app-mapa-sitio',
  templateUrl: './mapa-sitio.component.html',
  styleUrls: ['./mapa-sitio.component.css']
})
export class MapaSitioComponent implements OnInit {
  isLoggedIn: boolean = false;
  isAdmin: boolean = false;

  constructor(private usuariosService: UsuariosService) { }

  ngOnInit(): void {
    // Verificar el estado del usuario al iniciar el componente
    this.usuariosService.stateUser().subscribe((user: any) => {
      if (user) {
        // El usuario está autenticado
        this.isLoggedIn = true;
        // Verificar si el usuario es administrador
        this.isAdmin = this.usuariosService.isUserAdmin(user.uid);
      } else {
        // El usuario no está autenticado
        this.isLoggedIn = false;
        this.isAdmin = false;
      }
    });
  }

  esAdmin(): boolean {
    return this.isAdmin;
  }

  noEstaAutenticado(): boolean {
    return !this.isLoggedIn;
  }
}