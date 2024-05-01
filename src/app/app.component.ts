import { Component, OnDestroy, OnInit } from '@angular/core';
import { UsuariosService } from './services/usuarios.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'minotech';
  private inactivityTimeout: any;
  private sessionClosureTimeout: any; // Nuevo temporizador para el cierre final de la sesión
  private readonly inactivityLimit = 60000;  // 10 segundos de inactividad
  private userSubscription: Subscription | null = null;

  private isAuthenticated = false;

  constructor(private authService: UsuariosService, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.userSubscription = this.authService.stateUser().subscribe((user) => {
      this.isAuthenticated = !!user;
      if (this.isAuthenticated) {
        this.startInactivityTimer();
      } else {
        this.clearInactivityTimer();
      }
    });

    // Añadir eventos de actividad del usuario
    document.addEventListener('click', this.resetInactivityTimer);
    document.addEventListener('mousemove', this.resetInactivityTimer);
    document.addEventListener('keydown', this.resetInactivityTimer);
    document.addEventListener('scroll', this.resetInactivityTimer, true); // True para capturar el evento más ampliamente
  }

  ngOnDestroy(): void {
    // Remover todos los event listeners cuando el componente se destruya
    document.removeEventListener('click', this.resetInactivityTimer);
    document.removeEventListener('mousemove', this.resetInactivityTimer);
    document.removeEventListener('keydown', this.resetInactivityTimer);
    document.removeEventListener('scroll', this.resetInactivityTimer);
    if (this.userSubscription) {
        this.userSubscription.unsubscribe();
    }
    this.clearInactivityTimer();
    clearTimeout(this.sessionClosureTimeout); // Asegurarse de limpiar el nuevo temporizador también
  }

  private startInactivityTimer(): void {
    this.clearInactivityTimer();
    this.inactivityTimeout = setTimeout(() => this.showSessionTimeoutWarning(), this.inactivityLimit);
  }

  private showSessionTimeoutWarning(): void {
    if (!this.isAuthenticated) return;

    const toastrRef = this.toastr.info('Tu sesión está a punto de caducar por inactividad. Clic aquí para extender.', 'Aviso', {
        timeOut: 60000,
        closeButton: true,
        progressBar: true,
        tapToDismiss: false
    });

    let extendSessionClicked = false;

    toastrRef.onTap.subscribe(() => {
        extendSessionClicked = true;
        this.toastr.clear(toastrRef.toastId);
        this.resetInactivityTimer();
    });

    toastrRef.onHidden.subscribe(() => {
        if (!extendSessionClicked) {
            // Esperar 10 segundos adicionales antes de cerrar la sesión.
            this.sessionClosureTimeout = setTimeout(() => {
                this.authService.logout().then(() => {
                    this.toastr.error('Tu sesión ha sido cerrada por inactividad.', 'Sesión Cerrada', {
                        closeButton: true,
                        timeOut: 50000
                    });
                    console.log('Sesión caducada por inactividad.');
                });
            }, 60000);
        }
    });
  }

  private resetInactivityTimer = (): void => {
    if (this.isAuthenticated) {
      this.startInactivityTimer();
    }
  };

  private clearInactivityTimer(): void {
    clearTimeout(this.inactivityTimeout);
    clearTimeout(this.sessionClosureTimeout); // Limpia el temporizador de cierre de sesión también
  }
}
