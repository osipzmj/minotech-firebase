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
    const usuarioDocRef = doc(this.firestore, `Usuarios/${uid}`);
    return updateDoc(usuarioDocRef, {
      nombre: datos.nombre,
      email: datos.email,
      telefono: datos.telefono,
      edad: datos.edad,
      rol: datos.rol
    });
}

  getDocument<T>(path: string, id: string): Observable<T> {
    const docRef = doc(this.firestore, path, id);
    return docData(docRef, { idField: 'uid'}) as Observable<T>;
    
  }

  async getDocumentByName<T>(collectionPath: string, fieldName: string, name: string): Promise<T | undefined> {
    const q = query(collection(this.firestore, collectionPath), where(fieldName, '==', name));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        return undefined;
    } else {
        const docRef = doc(this.firestore, collectionPath, querySnapshot.docs[0].id);
        try {
            const docSnapshot = await getDoc(docRef);
            if (docSnapshot.exists()) {
                return docSnapshot.data() as T;
            } else {
                console.log('El documento no existe en Firestore.');
                return undefined;
            }
        } catch (error) {
            console.error('Error al obtener el documento:', error);
            return undefined;
        }
    }
  }

  async getCursoByUid(uid: string): Promise<Curso | undefined> {
    try {
      const cursoDocRef = doc(this.firestore, `cursos/${uid}`);
      const cursoSnapshot = await getDoc(cursoDocRef);

      if (cursoSnapshot.exists()) {
        const cursoData = cursoSnapshot.data() as Curso;
        return { ...cursoData, id: cursoSnapshot.id };
      } else {
        console.log("No se encontró el curso con el UID proporcionado.");
        return undefined;
      }
    } catch (error) {
      console.error("Error al obtener el curso:", error);
      return undefined;
    }
  }
  
}