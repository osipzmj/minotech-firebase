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
    getAuth,
    multiFactor,
    ApplicationVerifier,
    MultiFactorResolver
} from '@angular/fire/auth';
import { Usuario } from '../interfaces/usuario';
import { BehaviorSubject, Observable } from 'rxjs';
import { Firestore, doc, updateDoc } from '@angular/fire/firestore';
import { switchMap } from 'rxjs'; 
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root',
})
export class UsuariosService {
    phoneNumber: any;
    private loggedInSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    private recaptchaVerifier: ApplicationVerifier | null = null;
    verificationId: string | null = null;
    resolver: MultiFactorResolver | null = null;

    constructor(private auth: Auth , private firestore: Firestore, private router: Router ) { }

  isLoggedIn(): Observable<boolean> {
    return this.loggedInSubject.asObservable();
  }

    obtenerOTP(phoneNumber: string){
        this.recaptchaVerifier = new RecaptchaVerifier(this.auth,'recaptcha-container', {'size': 'invisible'} )

        return signInWithPhoneNumber(this.auth, phoneNumber, this.recaptchaVerifier)
        .then((confirmationResult) => {
          localStorage.setItem('verificationId', JSON.stringify(confirmationResult.verificationId))
          console.log("puto")
        }).catch((error) => {
            setTimeout(() => {
                window.location.reload();
            }, 5000); 
          console.error('Error en signInWithPhoneNumber:', error);
        });
    }


  setLoggedIn(value: boolean) {
    this.loggedInSubject.next(value);
  }

    async login(datosU: Usuario): Promise<UserCredential> {
        return signInWithEmailAndPassword(this.auth, datosU.email, datosU.password);
    }
    async logout(): Promise<void> {
            await this.auth.signOut();
    }

    async verificarCorreoElectronico(usuario: User): Promise<void> {
        if (!usuario.emailVerified) {
            await sendEmailVerification(usuario);
            throw new Error('El correo electrónico no está verificado. Se ha enviado un correo de verificación.');
        }
    }

    verifyIsUserIsEnrolled(user: User){
        const enrolledFactors = multiFactor(user).enrolledFactors;
        return enrolledFactors.length > 0;
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

    // initializeRecaptcha(componentId: string): void {
    //     this.recaptchaVerifier = new RecaptchaVerifier(componentId, {
    //       size: 'invisible',
    //       callback: () => {
    //         // Aquí puedes manejar el callback si es necesario.
    //       },
    //     }, this.auth);
    //   }
    
    //   getRecaptchaVerifier(): ApplicationVerifier | null {
    //     return this.recaptchaVerifier;
    //   }
    
    //   clearRecaptcha(): void {
    //     if (this.recaptchaVerifier) {
    //       this.recaptchaVerifier.clear();
    //       this.recaptchaVerifier = null;
    //     }
    //   }

    //   async handleMFA(response: any): Promise<void> {
    //     const recaptchaVerifier = this.getRecaptchaVerifier();
    //     if (response.code === 'auth/multi-factor-auth-required' && recaptchaVerifier) {
    //       const data = await this.auth.verifyUserMFA(response, recaptchaVerifier);
    //       if (!data) {
    //         // Notifica al usuario sobre un error.
    //       } else {
    //         this.verificationId = data.verificationId;
    //         this.resolver = data.resolver;
    //       }
    //     } else {
    //       // Maneja el error
    //     }
    //   }
      
}