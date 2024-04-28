import { Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  GoogleAuthProvider,
  signInWithPopup,
  FacebookAuthProvider,
  User,
  sendPasswordResetEmail,
  onAuthStateChanged,
  multiFactor,
  PhoneMultiFactorGenerator,
  RecaptchaVerifier,
  confirmPasswordReset,
  UserCredential
} from '@angular/fire/auth';
//    import { Firestore, collection, addDoc, collectionData, doc, deleteDoc, DocumentData  } from '@angular/fire/firestore';
// import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Usuario } from '../interfaces/usuario';
import { Observable, catchError, from, map, of } from 'rxjs';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class UsuariosService {
  isUserLoggedIn: boolean = false;
  adminUid: string = 'TIdGkwFzztT66rxgnNNCd2QUPRj1';

  isUserAdmin(uid: string): boolean {
    return uid === this.adminUid;
  }

  constructor(
    private auth: Auth, private firestore: Firestore
  ) { }

  //////////////////////////////////////////////////// METODOS DE LOGUEO DEL USUARIO //////////////////////////////////////////////////// 

  login(datosU: Usuario) {
    return signInWithEmailAndPassword(this.auth, datosU.email, datosU.password);
  }


  async signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(this.auth, provider);
  }

  async signInWithFacebook() {
    const provider = new FacebookAuthProvider();
    return signInWithPopup(this.auth, provider);
  }

  logout(): Promise<void> {
    return this.auth.signOut();
  }

  //////////////////////////////////////////////////// METODOS DE REGISTRO DEL USUARIO //////////////////////////////////////////////////// 

  async registro(datosU: Usuario): Promise<UserCredential> {
    // Verifica si la contraseña es segura antes de crear el usuario
    if (!this.esContrasenaSegura(datosU)) {
      throw new Error('La contraseña no cumple con los requisitos de seguridad.');
    }

    // Crea el usuario con email y contraseña
    const userCredential: UserCredential = await createUserWithEmailAndPassword(
      this.auth,
      datosU.email,
      datosU.password
    );

    // Envía el email de verificación
    await this.enviarEmailDeVerificacion(userCredential.user);
    
    // Devuelve las credenciales del usuario
    return userCredential;
  }

  // Método para enviar el email de verificación
  private async enviarEmailDeVerificacion(usuario: User): Promise<void> {
    await sendEmailVerification(usuario);
  }

 //////////////////////////////////////////////////// METODOS DE FUNCIONES DEL USUARIO //////////////////////////////////////////////////// 

 stateUser(): Observable<User | null> {
  return new Observable<User | null>((observer) => {
    const unsubscribe = onAuthStateChanged(this.auth, (user) => {
      observer.next(user);
    }, (error) => {
      observer.error(error);
    });
    return () => unsubscribe();
  });
}


  private esContrasenaSegura(datosU: Usuario): boolean {
    // Expresión regular para verificar los requisitos de la contraseña
    const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[\d!@#$%^&*()_+]).{8,}$/;
    return regex.test(datosU.password);
  }

  async recuperarContrasena(datosU: Usuario): Promise<void> {
    try {
      // Llama a sendPasswordResetEmail con await
      await sendPasswordResetEmail(this.auth, datosU.email);
      console.log(
        'Se ha enviado un enlace de recuperación de contraseña a tu email.'
      );
    } catch (error) {
      // Maneja los errores que puedan surgir durante la llamada a sendPasswordResetEmail
      console.error('Error al enviar el email de recuperación:', error);
      throw error; // Re-lanza el error para que pueda ser manejado por la llamada a esta función
    }
  }

  // async cambiarContrasena(datosU: Usuario): Promise<void> {
  //   // Verifica si la nueva contraseña es segura
  //   if (!this.esContrasenaSegura(datosU.password)) {
  //     console.error('La nueva contraseña no cumple con los requisitos de seguridad.');
  //     return;
  //   }
  
  //   try {
  //     // Cambia la contraseña del usuario utilizando el enlace de recuperación
  //     const actionCode = ''; // Debes obtener el código de acción de la URL de restablecimiento
  
  //     // Llama a confirmPasswordReset para cambiar la contraseña
  //     await confirmPasswordReset(this.auth, actionCode, datosU.password);
  //     console.log('Contraseña cambiada con éxito.');
  //   } catch (error) {
  //     console.error('Error al cambiar la contraseña:', error);
  //   }
  // }
}
