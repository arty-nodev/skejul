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
    const collection = this.firestore.collection<type>(path);
    return collection.valueChanges();
  }


  
}
