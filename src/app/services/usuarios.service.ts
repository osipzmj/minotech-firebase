import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification,
   GoogleAuthProvider, signInWithPopup, FacebookAuthProvider, 
   User,
   user} from '@angular/fire/auth';
   import { Firestore, collection, addDoc, collectionData, doc, deleteDoc, DocumentData  } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Usuario } from '../interfaces/usuario';
import { Observable } from 'rxjs';
import { CursosService } from './cursos.service';
import { NavegacionComponent } from '../components/navegacion/navegacion.component';


@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  isUserLoggedIn: boolean | undefined;

  constructor(private auth: Auth, private firestore: Firestore, private cursos: CursosService) {

   
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


  stateUser() {
    return this.auth.onAuthStateChanged((user) => {
        if (user) {
            console.log("Está logueado");
            this.isUserLoggedIn = true;
            this.getDatosUser(user.uid)
        } else {
            console.log("No está logueado");
            this.isUserLoggedIn = false;
        }
    });
}

getDatosUser(uid: string){
  const path = "Usuarios";
  const id = uid;
  this.cursos.getDatos(path, id).subscribe(res => {
    console.log('datos ->', res)
  })
}
}