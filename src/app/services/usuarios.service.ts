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
    ApplicationVerifier,
    MultiFactorResolver,
    MultiFactorUser,
    PhoneAuthProvider,
    PhoneMultiFactorGenerator,
    MultiFactorError,
    getMultiFactorResolver,
    user,
    ConfirmationResult
} from '@angular/fire/auth';
import { multiFactor } from "firebase/auth";
import { Usuario } from '../interfaces/usuario';
import { BehaviorSubject, Observable } from 'rxjs';
import { Firestore} from '@angular/fire/firestore';
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
    private confirmationResult?: ConfirmationResult;
    // phoneInfoOptions = {
    //     phoneNumber: this.phoneNumber,
    //     session: multiFactorSession
    // };

    

    constructor(private auth: Auth , private firestore: Firestore, private router: Router ) { }

    isLoggedIn(): Observable<boolean> {
        return this.loggedInSubject.asObservable();
    }

    setLoggedIn(value: boolean) {
        this.loggedInSubject.next(value);
    }

    async login(datosU: Usuario): Promise<UserCredential> {
        try {
            const userCredential = await signInWithEmailAndPassword(this.auth, datosU.email, datosU.password);
            // Llama al método obtenerOTP para iniciar la autenticación multifactorial
            await this.obtenerOTP(datosU.phoneNumber);
            return userCredential;
        } catch (error) {
            console.error('Error en login:', error);
            throw error;
        }
    }

    
    async obtenerOTP(phoneNumber: string): Promise<void> {
        try {
            // Configura RecaptchaVerifier
            this.recaptchaVerifier = new RecaptchaVerifier(this.auth, 'recaptcha-container', {
                size: 'invisible'
            });           
            // Inicia la autenticación por SMS
            const confirmationResult = await signInWithPhoneNumber(this.auth, phoneNumber, this.recaptchaVerifier);
            // Almacena la identificación de verificación y el objeto ConfirmationResult
            localStorage.setItem('verificationId', JSON.stringify(confirmationResult.verificationId));
            this.confirmationResult = confirmationResult;
            // Redirige a la página de verificación
            this.router.navigate(['/verificacion']);
        } catch (error) {
            console.error('Error en obtenerOTP:', error);
            throw error;
        }
    }
    
    async verifyOTP(otp: string): Promise<void> {
        try {
            if (!this.confirmationResult) {
                console.error('No se encontró el objeto confirmationResult');
                return;
            }

            // Verifica el OTP
            await this.confirmationResult.confirm(otp);
            console.log('Verificación de OTP exitosa');
            // Redirige a la página deseada después de la verificación
            this.router.navigate(['/']);
        } catch (error) {
            console.error('Error en verifyOTP:', error);
            throw error;
        }
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

    

    

      
    //   async inscribirSegundoFactor(verificationCode: string): Promise<void> {
    //     try {
    //         // Crear credenciales de autenticación telefónica utilizando el código de verificación

    
    //         // Crear la aserción MFA a partir de las credenciales de autenticación telefónica
    //         const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(phoneAuthCredential);
    
    //         // Inscribir el número de teléfono como un nuevo factor de autenticación
    //         await multiFactor(user).enroll(multiFactorAssertion, mfaDi);
    
    //         console.log('Segundo factor inscrito con éxito.');
    //     } catch (error) {
    //         console.error('Error al inscribir segundo factor:', error);
    //         throw error;
    //     }
    // }
    
    // async enrollUser(
    //     user: User,
    //     verificationCodeId: string,
    //     verificationCode: string
    // ) {
    //     const phoneAuthCredential = PhoneAuthProvider.credential(verificationCodeId, verificationCode);
    //     const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(phoneAuthCredential);
    
    //     try {
    //         await multiFactor(user).enroll(multiFactorAssertion, 'Numero personal');
    //         return true;
    //     }catch (e) {
    //         return false;
    //     }
    // }
    
    //  async  verifyUserMFA(
    //     error: MultiFactorError,
    //     recaptchaVerifier: ApplicationVerifier,
    //     selectedIndex: number
    // ): Promise<false | { verificationId: string, resolver: MultiFactorResolver} | void> {
    //     const resolver = getMultiFactorResolver(this.auth, error);
    
    //     if (resolver.hints[selectedIndex].factorId === PhoneMultiFactorGenerator.FACTOR_ID) {
    //         const phoneInfoOptions = {
    //             multiFactorHint: resolver.hints[selectedIndex],
    //             session: resolver.session
    //         }
    
    //         const phoneAuthProvider = new PhoneAuthProvider(this.auth);
    //         try {
    //             const verificationId = await phoneAuthProvider.verifyPhoneNumber(phoneInfoOptions, recaptchaVerifier);
    //             return { verificationId, resolver }
    //         }catch (e) {
    //             return false
    //         }
    //     }
    // }

    // async verifyUserEnrolled(
    //     verificationMFA: { verificationId: string, resolver: MultiFactorResolver },
    //     verificationCode: string
    // ): Promise<boolean> {
    //     const { verificationId, resolver } = verificationMFA;
    
    //     try {
    //         // Crear credencial con el ID de verificación y el código de verificación
    //         const credentials = PhoneAuthProvider.credential(verificationId, verificationCode);
    
    //         // Crear la aserción multifactor utilizando la credencial
    //         const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(credentials);
    
    //         // Resolver la autenticación con el multifactor assertion
    //         await resolver.resolveSignIn(multiFactorAssertion);
    
    //         // Si se resuelve la autenticación correctamente, retorna true
    //         return true;
    //     } catch (error) {
    //         console.error('Error al resolver la autenticación multifactor:', error);
    //         return false;
    //     }
    // }
    
}