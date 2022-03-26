import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private firestore: AngularFirestore) { }

  createDoc(data: any, path: string){
    const collection = this.firestore.collection(path);
    return collection.doc().set(data);
  }

  

  getCollection(){
    this.firestore.collection('usuarios').valueChanges().subscribe((res) => {
      console.log(res);
      
    });
  }
}
