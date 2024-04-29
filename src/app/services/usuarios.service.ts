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
    PhoneMultiFactorGenerator,
    RecaptchaVerifier,
    UserCredential,
    multiFactor,
    PhoneAuthProvider,
    MultiFactorAssertion,
    PhoneAuthCredential
} from '@angular/fire/auth';
import { Usuario } from '../interfaces/usuario';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class UsuariosService {
    // adminUid: ;
    recaptchaVerifier: RecaptchaVerifier | undefined;

    constructor(private auth: Auth ) { }

    // isUserAdmin(uid: string): boolean {
    //     return uid === this.adminUid;
    // }

    login(datosU: Usuario): Promise<UserCredential> {
        return signInWithEmailAndPassword(this.auth, datosU.email, datosU.password);
    }

    // setupRecaptcha() {
    //   if (!this.recaptchaVerifier) {
    //     this.recaptchaVerifier = new RecaptchaVerifier(
    //       'recaptcha-container', // ID del contenedor de reCAPTCHA en el HTML
    //       {
    //         size: 'invisible', // Opción para el tamaño del reCAPTCHA
    //         callback: (response: any) => {
    //           // Aquí puedes agregar una función de devolución de llamada (callback) para manejar la verificación
    //           // El parámetro 'response' contiene la información de la verificación de reCAPTCHA
    //           console.log('reCAPTCHA verificado:', response);
    
    //           // Ejemplo de cómo usar la respuesta de reCAPTCHA
    //           // if (response.token) {
    //           //   // Envía el token de reCAPTCHA al servidor para su validación
    //           // } else {
    //           //   // Maneja el caso en que la verificación de reCAPTCHA falla
    //           // }
    //         },
    //       },
    //       this.auth // Asegúrate de que la instancia de Auth se pase correctamente
    //     );
    //   }
    // }
  

    // async verifyPhoneNumber(phoneNumber: string, mfaDisplayName?: string): Promise<void> {
    //     // Configura el reCAPTCHA
    //     this.setupRecaptcha();
    //     const user = this.auth.currentUser;

    //     if (!user) {
    //         throw new Error('No se pudo obtener el usuario actual.');
    //     }

    //     // Obtiene la sesión multifactor
    //     const multiFactorSession = await multiFactor(user).getSession();

    //     // Configura las opciones de información telefónica
    //     const phoneInfoOptions = {
    //         phoneNumber,
    //         session: multiFactorSession
    //     };

    //     // Inicializa `PhoneAuthProvider`
    //     const phoneAuthProvider = new PhoneAuthProvider(this.auth);

    //     // Envía un mensaje de verificación por SMS
    //     const verificationId = await phoneAuthProvider.verifyPhoneNumber(phoneInfoOptions, this.recaptchaVerifier);

    //     // Solicita al usuario que verifique el código
    //     const verificationCode = prompt('Por favor, ingresa el código que recibiste por SMS:');

    //     if (!verificationCode) {
    //         throw new Error('El código de verificación no se ingresó.');
    //     }

    //     // Inicializa `PhoneAuthCredential`
    //     const cred = PhoneAuthProvider.credential(verificationId, verificationCode);

    //     // Inicializa `MultiFactorAssertion`
    //     const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(cred);

    //     // Completa la inscripción del factor secundario
    //     await multiFactor(user).enroll(multiFactorAssertion, mfaDisplayName);
    // }

    async loginWithGoogle(): Promise<UserCredential> {
        const provider = new GoogleAuthProvider();
        return signInWithPopup(this.auth, provider);
    }

    async loginWithFacebook(): Promise<UserCredential> {
        const provider = new FacebookAuthProvider();
        return signInWithPopup(this.auth, provider);
    }

    logout(): Promise<void> {
        return this.auth.signOut();
    }

    async registro(datosU: Usuario): Promise<UserCredential> {
        // Verifica si la contraseña es segura antes de crear el usuario
        if (!this.esContrasenaSegura(datosU.password)) {
            throw new Error('La contraseña no cumple con los requisitos de seguridad.');
        }

        // Crea el usuario con email y contraseña
        const userCredential = await createUserWithEmailAndPassword(
            this.auth,
            datosU.email,
            datosU.password
        );

        // Envía el email de verificación
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
