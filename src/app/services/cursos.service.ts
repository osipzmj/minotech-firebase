import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, doc, deleteDoc, docData, getDoc, getDocs, query, where, updateDoc } from '@angular/fire/firestore';
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

  obtenerUsuarios(): Observable<Usuario[]>{
    const cursoRef = collection(this.firestore, 'Usuarios');
    return collectionData(cursoRef, { idField: 'uid' }) as Observable <Usuario[]>;
  }

  eliminarUsuario(usuario: Usuario){
    const cursoDocRef = doc(this.firestore, `Usuarios/${usuario.uid}`);
    return deleteDoc(cursoDocRef);
  }
  actualizarUsuario(uid: string, datos: Partial<Usuario>): Promise<void> {
    // Obtén la referencia del documento del usuario usando su UID
    const usuarioDocRef = doc(this.firestore, `Usuarios/${uid}`);
    
    // Utiliza updateDoc para actualizar el documento con los datos proporcionados
    return updateDoc(usuarioDocRef, {
      nombre: datos.nombre,
      email: datos.email,
      telefono: datos.telefono,
      edad: datos.edad,
      rol: datos.rol
    });
}

  // actualizarUsuario(curso: Curso){
  //   const cursoDocRef = doc(this.firestore, `cursos/${curso.id}`);
  //   return doc(cursoDocRef);
  // }

  getDocument<T>(path: string, id: string): Observable<T> {
    const docRef = doc(this.firestore, path, id);
    return docData(docRef, { idField: 'uid'}) as Observable<T>;
    
  }

  async getDocumentByName<T>(collectionPath: string, fieldName: string, name: string): Promise<T | undefined> {
    const q = query(collection(this.firestore, collectionPath), where(fieldName, '==', name));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        return undefined; // No se encontró ningún documento con el nombre dado
    } else {
        // Solo se espera un documento con el nombre único, así que tomamos el primero
        const docRef = doc(this.firestore, collectionPath, querySnapshot.docs[0].id);
        try {
            const docSnapshot = await getDoc(docRef);
            if (docSnapshot.exists()) {
                // El documento existe, puedes acceder a sus datos con docSnapshot.data()
                return docSnapshot.data() as T;
            } else {
                // El documento no existe
                console.log('El documento no existe en Firestore.');
                return undefined;
            }
        } catch (error) {
            // Manejo de errores
            console.error('Error al obtener el documento:', error);
            return undefined;
        }
    }
  }
  
}


