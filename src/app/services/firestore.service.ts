import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private firestore: AngularFirestore) { }

  //Creamos nuevo docuemnto
  createDoc(data: any, path: string, id: string){
    const collection = this.firestore.collection(path);
    return collection.doc(id).set(data);
  }
  //Creamos nuevo uid
  getId(){
    return this.firestore.createId();
  }
  
  //Recogemos una colección
  getCollection<type>(path: string){
    const collection = this.firestore.collection<type>(path, ref => ref.where("trabaja", "==", true));
    return collection.valueChanges();
  }

   //Recogemos una colección de ex-trabajadores
   getExWorkers<type>(path: string){
    const collection = this.firestore.collection<type>(path, ref => ref.where("trabaja", "==", false));
    return collection.valueChanges();
  }

  //Recogemos un documento
  getDoc<type>(path:string, uid:string){
    return this.firestore.collection(path).doc<type>(uid).valueChanges();
  }

  editDoc<type>(path:string, uid:string, data:any){
   return this.firestore
    .collection(path)
    .doc(uid)
    .update({
      apellidos: data.apellidos,
      cargo: data.cargo,
      correo: data.correo,
      horarios: [],
      id_local: data.id_local,
      id_usuario: data.id_usuario,
      nombre: data.nombre,
      password: null,
      telefono: data.telefono})
    .then(() => {
      return this.firestore.collection(path).doc<type>(uid).valueChanges();
    })
  }

disableUser<type>(path:string, uid:string, value:boolean){
  return this.firestore
    .collection(path)
    .doc(uid)
    .update({
      trabaja: value})
    .then(() => {
      return this.firestore.collection(path).doc<type>(uid).valueChanges();
    })
}
  
}
