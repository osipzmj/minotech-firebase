// import { Component, Input, Provider, inject } from '@angular/core';
// import { Router } from '@angular/router';
// import { UsuariosService } from 'src/app/services/usuarios.service';

// @Component({
//   selector: 'app-botones',
//   templateUrl: './botones.component.html',
//   styleUrls: ['./botones.component.css']
// })
// export class BotonesComponent {
//   @Input() login = false;

//   private usuariosService = inject(UsuariosService);
//   private _router = inject(Router);
//   Provider = Provider;

//   providerAction(provider: Provider): void {
//     // Compara con los valores de la enumeración en lugar de con strings
//     if (provider === Provider.Google) {
//       this.signUpWithGoogle();
//     } else {
//       // this.signUpWithGithub();
//     }
//   }
//   async signUpWithGoogle(): Promise<void> {
//     try {
//       const result = await this.usuariosService.signInWithGoogleProvider();
//       this._router.navigateByUrl('/');
//       console.log(result);
//     } catch (error) {
//       console.log(error);
//     }
//   }


// }
