import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification,
   GoogleAuthProvider, signInWithPopup, FacebookAuthProvider, 
   User,
   user,
   sendPasswordResetEmail,
   onAuthStateChanged} from '@angular/fire/auth';
   import { Firestore, collection, addDoc, collectionData, doc, deleteDoc, DocumentData  } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Usuario } from '../interfaces/usuario';
import { Observable } from 'rxjs';
import { CursosService } from './cursos.service';



@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  isUserLoggedIn: boolean = false;
  adminUid: string = 'TIdGkwFzztT66rxgnNNCd2QUPRj1'; // UID del administrador


  constructor(private auth: Auth, private cursos: CursosService) {

   
   }

   // Método para verificar si el usuario es administrador
  isUserAdmin(uid: string): boolean {
    return uid === this.adminUid;
  }
  
  async registro(datosU: Usuario) {
    const userCredential = await createUserWithEmailAndPassword(this.auth, datosU.email, datosU.password);
    await this.enviarEmailDeVerificacion(userCredential.user);
    return userCredential;
  }

  private async enviarEmailDeVerificacion(usuario: any) {
    await sendEmailVerification(usuario);
  }
 
  login({ email, password }: any) {
    return signInWithEmailAndPassword(this.auth, email, password);
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
  
  async recuperarContrasena(datosU: Usuario): Promise<void> {
    try {
      // Llama a sendPasswordResetEmail con await
      await sendPasswordResetEmail(this.auth, datosU.email);
      console.log('Se ha enviado un enlace de recuperación de contraseña a tu email.');
    } catch (error) {
      // Maneja los errores que puedan surgir durante la llamada a sendPasswordResetEmail
      console.error('Error al enviar el email de recuperación:', error);
      throw error; // Re-lanza el error para que pueda ser manejado por la llamada a esta función
    }
  }

}