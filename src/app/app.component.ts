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
  private sessionClosureTimeout: any; 
  private readonly inactivityLimit = 60000;
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

    document.addEventListener('click', this.resetInactivityTimer);
    document.addEventListener('mousemove', this.resetInactivityTimer);
    document.addEventListener('keydown', this.resetInactivityTimer);
    document.addEventListener('scroll', this.resetInactivityTimer, true); 
  }

  ngOnDestroy(): void {
    document.removeEventListener('click', this.resetInactivityTimer);
    document.removeEventListener('mousemove', this.resetInactivityTimer);
    document.removeEventListener('keydown', this.resetInactivityTimer);
    document.removeEventListener('scroll', this.resetInactivityTimer);
    if (this.userSubscription) {
        this.userSubscription.unsubscribe();
    }
    this.clearInactivityTimer();
    clearTimeout(this.sessionClosureTimeout);
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
    clearTimeout(this.sessionClosureTimeout);
  }
}
