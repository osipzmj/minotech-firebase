import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification,
   GoogleAuthProvider, signInWithPopup, FacebookAuthProvider } from '@angular/fire/auth';
import { Usuario } from '../interfaces/usuario';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  constructor(private auth: Auth) { }

  async registro({ email, password }: any) {
    const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
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
}
