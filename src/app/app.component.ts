import { Component, OnDestroy, OnInit } from '@angular/core';
import { UsuariosService } from './services/usuarios.service';
import { Toast, ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'minotech';
  private inactivityTimeout: any;
  private readonly inactivityLimit = 60 * 1000; // 60 segundos de inactividad
  private userSubscription: Subscription | null = null;

  private isAuthenticated = false;

  constructor(private authService: UsuariosService, private toastr: ToastrService) {}

  ngOnInit(): void {
    // Suscribirse a los cambios en el estado de autenticación del usuario
    this.userSubscription = this.authService.stateUser().subscribe((user) => {
      this.isAuthenticated = !!user; // Actualiza el estado de autenticación
      if (this.isAuthenticated) {
        this.startInactivityTimer();
      } else {
        this.clearInactivityTimer(); // Limpia el temporizador si no hay usuario autenticado
      }
    });

    // Configurar eventos para detectar actividad del usuario
    document.addEventListener('click', this.resetInactivityTimer);
    document.addEventListener('mousemove', this.resetInactivityTimer);
    document.addEventListener('keydown', this.resetInactivityTimer);
  }

  ngOnDestroy(): void {
    // Elimina los eventos de escucha al destruir el componente
    document.removeEventListener('click', this.resetInactivityTimer);
    document.removeEventListener('mousemove', this.resetInactivityTimer);
    document.removeEventListener('keydown', this.resetInactivityTimer);

    // Verifica si userSubscription no es nulo antes de llamar a unsubscribe
    if (this.userSubscription) {
        this.userSubscription.unsubscribe();
    }
}


  private startInactivityTimer(): void {
    this.inactivityTimeout = setTimeout(() => {
      if (this.isAuthenticated) {
        // Llamar a la función de logout en el servicio de autenticación
        this.authService.logout().then(() => {
          // Redirigir o hacer otras acciones después de cerrar sesión
          console.log('Sesión caducada por inactividad');
          this.toastr.show('Tu sesión ha caducado por falta de actividad', 'Upsss... lo siento', {
            timeOut: 0, // Esto hace que la notificación no caduque
            closeButton: true // Muestra el botón de cierre para que el usuario pueda cerrar la notificación manualmente
          });
        });
      }
    }, this.inactivityLimit);
  }

  private resetInactivityTimer = (): void => {
    if (this.isAuthenticated) {
      // Limpiar el temporizador actual
      clearTimeout(this.inactivityTimeout);
      // Iniciar un nuevo temporizador
      this.startInactivityTimer();
    }
  };

  private clearInactivityTimer(): void {
    clearTimeout(this.inactivityTimeout);
  }
}
