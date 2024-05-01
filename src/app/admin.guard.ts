import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UsuariosService } from './services/usuarios.service';
import { CursosService } from './services/cursos.service';
import { Usuario } from './interfaces/usuario';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AdminGuard implements CanActivate {
    constructor(
        private cursoService: CursosService,
        private authService: UsuariosService,
        private router: Router
    ) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> {
        return new Promise((resolve) => {
            this.authService.stateUser().subscribe(async (user) => {
                if (user) {
                    const usuario = await this.getDatosUser(user.uid);
                    if (usuario) {
                        const userRole = usuario.rol;
                        const url = state.url;
                        if (userRole === 'admin' || (userRole === 'profesor' && url === '/agregar-curso')) {
                            resolve(true);
                        } else {
                            this.router.navigate(['**']);
                            resolve(false);
                        }
                    } else {
                        this.router.navigate(['/login']);
                        resolve(false);
                    }
                }
            });
        });
    }

    async getDatosUser(uid: string): Promise<Usuario | null> {
        const path = 'Usuarios';
        const fieldName = 'uid';
        try {
            const usuario = await this.cursoService.getDocumentByName<Usuario>(path, fieldName, uid);
            if (usuario) {
                return usuario;
            } else {
                console.log("Usuario no encontrado");
                return null;
            }
        } catch (error) {
            console.error("Error al obtener los datos del usuario:", error);
            return null;
        }
    }
}