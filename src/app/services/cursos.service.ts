import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, doc, deleteDoc, docData, getDoc, getDocs } from '@angular/fire/firestore';
import Curso from '../interfaces/curso.interface';
import { Observable } from 'rxjs';
import { Usuario } from '../interfaces/usuario';

@Injectable({
  providedIn: 'root'
})
export class CursosService {

  constructor(private firestore: Firestore) { }
  
  addCurso(curso: Curso){
    const cursoRef = collection(this.firestore, 'cursos');
    return addDoc(cursoRef, curso);
  }

  obtenerCursos(): Observable<Curso[]>{
    const cursoRef = collection(this.firestore, 'cursos');
    return collectionData(cursoRef, { idField: 'id' }) as Observable <Curso[]>;
  }

  eliminarCurso(curso: Curso){
    const cursoDocRef = doc(this.firestore, `cursos/${curso.id}`);
    return deleteDoc(cursoDocRef);
  }

  createDoc(data: any, path: string, id: string){
    const coleccion = collection(this.firestore, path);
    return addDoc(coleccion, data)
  }

//   getDocument<T>(path: string): Observable<T[]> {
//     const collectionRef = collection(this.firestore, path);
    
//     return new Observable<T[]>((observer) => {
//         getDocs(collectionRef)
//             .then((querySnapshot) => {
//                 const data: T[] = [];
//                 querySnapshot.forEach((doc) => {
//                     // Convierte los documentos a datos genéricos y los agrega al array de datos
//                     data.push(doc.data() as T);
//                 });
//                 observer.next(data); // Envía los datos al observador
//                 observer.complete(); // Completa el observable
//             })
//             .catch((error) => {
//                 observer.error(error); // Envía el error al observador
//                 observer.complete(); // Completa el observable
//             });
//     });
// }

  getDocument<T>(path: string, id: any): Observable<T> {
    const docRef = doc(this.firestore, path, id);
    return docData(docRef, { idField: 'uid'}) as Observable<T>;
    
  }

  // getDoc<tipo>(path: string, id: string){
  //   return this.firestore.collection(path).doc<tipo>(id).valueChanges()
  // }

  // getDatos(uid: any){
  //   const usr = collection(this.firestore,'Usuarios')
  //   console.log('Holaassas',)
  //   return doc(usr,uid)
  // }
  
//   getDocument<tipo>(path: string, id: any): Observable<tipo> {
//     const documentRef = doc(this.firestore, path, id);
//     return docData(documentRef, { idField: 'id' }) as Observable<tipo>;
// }
// getDocument<tipo>(path: string, id?: any): Observable<tipo[]> {
//   const collectionRef = collection(this.firestore, path);
//   return collectionData(collectionRef, { idField: id || 'id' }) as Observable<tipo[]>;
// }

// getDatos(email: any): Observable<Usuario> {
//   const documentRef = doc(this.firestore, 'Usuarios', email);
//   return docData(documentRef, { idField: 'email' }) as Observable<Usuario>;
// }
}


