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
  private readonly inactivityLimit = 10 * 1000; // 60 segundos de inactividad
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
  // Establecer un temporizador para mostrar el toastr cuando la sesión esté a punto de caducar
  this.inactivityTimeout = setTimeout(() => {
      if (this.isAuthenticated) {
          // Mostrar toastr con opción de extender la sesión
          const toastrRef = this.toastr.warning('Tu sesión está a punto de caducar por inactividad.', 'Advertencia', {
              timeOut: 10000, // Duración de la notificación en milisegundos (1 minuto)
              closeButton: true, // Muestra un botón de cierre
              progressBar: true, // Muestra una barra de progreso
              tapToDismiss: false // Deshabilita el cierre al hacer clic fuera de la notificación
          });

          // Agregar un botón de acción personalizado para extender la sesión
          toastrRef.onAction.subscribe(() => {
              // Extender la sesión
              this.resetInactivityTimer();
              this.toastr.clear(toastrRef.toastId); // Cerrar la notificación
          });

          // Si el usuario no extiende la sesión, llamar a la función de logout después de un minuto
          setTimeout(() => {
              if (toastrRef.toastId) {
                  // Cerrar la sesión si la notificación aún está activa y no se ha interactuado con ella
                  this.authService.logout().then(() => {
                      console.log('Sesión caducada por inactividad');
                  });
              }
          }, 60000); // Espera 1 minuto para cerrar sesión si no se extiende la sesión
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
