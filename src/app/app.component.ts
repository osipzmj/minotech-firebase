import { Component, OnDestroy, OnInit } from '@angular/core';
import { UsuariosService } from './services/usuarios.service';
import { Toast, ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'minotech';

  private inactivityTimeout: any;
  private readonly inactivityLimit = 60 * 1000;

  constructor(private authService: UsuariosService, private toastr:ToastrService) {}

  ngOnInit(): void {
    // Configurar eventos para detectar actividad del usuario
    document.addEventListener('click', this.resetInactivityTimer);
    document.addEventListener('mousemove', this.resetInactivityTimer);
    document.addEventListener('keydown', this.resetInactivityTimer);
    
    // Iniciar el temporizador de inactividad
    this.startInactivityTimer();
  }

  ngOnDestroy(): void {
    // Limpiar eventos al destruir el componente
    document.removeEventListener('click', this.resetInactivityTimer);
    document.removeEventListener('mousemove', this.resetInactivityTimer);
    document.removeEventListener('keydown', this.resetInactivityTimer);
  }

  private startInactivityTimer(): void {
    this.inactivityTimeout = setTimeout(() => {
      // Llamar a la función de logout en el servicio de autenticación
      this.authService.logout().then(() => {
        // Redirigir o hacer otras acciones después de cerrar sesión
        console.log('Sesión caducada por inactividad');
        this.toastr.show('Sesión caducada por inactividad', 'Upsss...', {
          timeOut: 0, // Esto hace que la notificación no caduque
          closeButton: true // Muestra el botón de cierre para que el usuario pueda cerrar la notificación manualmente
        });
      });
    }, this.inactivityLimit);
  }

  private resetInactivityTimer = (): void => {
    // Limpiar el temporizador actual
    clearTimeout(this.inactivityTimeout);
    // Iniciar un nuevo temporizador
    this.startInactivityTimer();
  };
}
