import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
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

    canActivate(): Observable<boolean> | Promise<boolean> {
        return new Promise((resolve) => {
            this.authService.stateUser().subscribe(async (user) => {
                if (user) {
                    const usuario = await this.getDatosUser(user.uid);
                    if (usuario && usuario.rol === 'admin' || usuario && usuario.rol === 'profesor') {
                        resolve(true);
                    } else {
                        // Redirigir a la página de error si el usuario no tiene rol de admin
                        this.router.navigate(['**']);
                        resolve(false);
                    }
                } else {
                    // Redirigir a la página de inicio de sesión si el usuario no está autenticado
                    this.router.navigate(['/login']);
                    resolve(false);
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
