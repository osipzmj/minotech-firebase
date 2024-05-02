export interface Usuario {
    uid: any;
    nombre: any;
    edad:any;
    email: any;
    phoneNumber: any;
    password: any;
    rol: 'estandar' | 'admin' | 'profesor' | null;
}
