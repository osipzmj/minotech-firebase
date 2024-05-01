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
    UserCredential,
    RecaptchaVerifier,
    signInWithPhoneNumber,
} from '@angular/fire/auth';
import { Usuario } from '../interfaces/usuario';
import { BehaviorSubject, Observable } from 'rxjs';
import { Firestore, doc, updateDoc } from '@angular/fire/firestore';

@Injectable({
    providedIn: 'root',
})
export class UsuariosService {
    telefono: any;
    reCaptchaVerifier: any;
    private loggedInSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    constructor(private auth: Auth , private firestore: Firestore ) { }

  isLoggedIn(): Observable<boolean> {
    return this.loggedInSubject.asObservable();
  }

  setLoggedIn(value: boolean) {
    this.loggedInSubject.next(value);
  }

    async cambiarEstadoVerificacion(uid: string, estadoVerificacion: boolean): Promise<void> {
        try {
            const usuarioDoc = doc(this.firestore, 'Usuarios', uid);
            console.log('Actualizando documento con UID:', uid, 'y estadoVerificacion:', estadoVerificacion);
            
            await updateDoc(usuarioDoc, { verificadoPersonalizado: estadoVerificacion });
        } catch (error) {
            console.log('Error al cambiar el estado de verificación del correo electrónico:', error);
            throw error;
        }
    }

    async login(datosU: Usuario): Promise<UserCredential> {
        return signInWithEmailAndPassword(this.auth, datosU.email, datosU.password);
    }
    async logout(): Promise<void> {
            await this.auth.signOut();
    }
    
    obtenerOTP(){
        this.reCaptchaVerifier = new RecaptchaVerifier(this.auth,'recaptcha-container', {'size': 'invisible'} )

        return signInWithPhoneNumber(this.auth, this.telefono, this.reCaptchaVerifier).then((confirmationResult) => {
            console.log(confirmationResult)
        })
    }
    
    async verificarCorreoElectronico(usuario: User): Promise<void> {
        if (!usuario.emailVerified) {
            await sendEmailVerification(usuario);
            throw new Error('El correo electrónico no está verificado. Se ha enviado un correo de verificación.');
        }
    }

    async loginWithGoogle(): Promise<UserCredential> {
        const provider = new GoogleAuthProvider();
        return signInWithPopup(this.auth, provider);
    }

    async loginWithFacebook(): Promise<UserCredential> {
        const provider = new FacebookAuthProvider();
        return signInWithPopup(this.auth, provider);
    }
    
    async registro(datosU: Usuario): Promise<UserCredential> {
        if (!this.esContrasenaSegura(datosU.password)) {
            throw new Error('La contraseña no cumple con los requisitos de seguridad.');
        }

        const userCredential = await createUserWithEmailAndPassword(
            this.auth,
            datosU.email,
            datosU.password
        );

        await this.enviarEmailDeVerificacion(userCredential.user);

        return userCredential;
    }

     async enviarEmailDeVerificacion(usuario: User): Promise<void> {
        await sendEmailVerification(usuario);
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
    
    private esContrasenaSegura(password: string): boolean {
        const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[\d!@#$%^&*()_+]).{8,}$/;
        return regex.test(password);
    }

    async recuperarContrasena(datosU: Usuario): Promise<void> {
        try {
            await sendPasswordResetEmail(this.auth, datosU.email);
            console.log('Se ha enviado un enlace de recuperación de contraseña a tu email.');
        } catch (error) {
            console.error('Error al enviar el email de recuperación:', error);
            throw error;
        }
    }
}