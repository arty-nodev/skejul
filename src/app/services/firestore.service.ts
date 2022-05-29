import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';


@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private firestore: AngularFirestore) { }

  //Creamos nuevo docuemnto
  createDoc(data: any, path: string, id: string) {
    const collection = this.firestore.collection(path);
    return collection.doc(id).set(data);
  }
  //Creamos nuevo uid
  getId() {
    return this.firestore.createId();
  }

  //Recogemos una colección
  getCollection<type>(path: string) {
    const collection = this.firestore.collection<type>(path, ref => ref.where("trabaja", "==", true));
    return collection.valueChanges();
  }

  //Recogemos una colección de ex-trabajadores
  getExWorkers<type>(path: string) {
    const collection = this.firestore.collection<type>(path, ref => ref.where("trabaja", "==", false));
    return collection.valueChanges();
  }

  //Recogemos un documento
  getDoc<type>(path: string, uid: string) {
    return this.firestore.collection(path).doc<type>(uid).valueChanges();
  }

  editDoc<type>(path: string, uid: string, data: any) {
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
        telefono: data.telefono
      })
      .then(() => {
        return this.firestore.collection(path).doc<type>(uid).valueChanges();
      })
  }

  disableUser<type>(path: string, uid: string, value: boolean) {
    return this.firestore
      .collection(path)
      .doc(uid)
      .update({
        trabaja: value
      })
      .then(() => {
        return this.firestore.collection(path).doc<type>(uid).valueChanges();
      })
  }

  createNewEvent(path: string, uid: string, data: any) {

    const collection = this.firestore.collection(path + '/' + uid + '/horarios');
    console.log(data);
    return collection.doc(data.title).set(data);

  }

  getEvents(path: string, uid: string) {
    return this.firestore.collection(path + '/' + uid + '/horarios').snapshotChanges();
  }

  enableHolidays(data) {
    return this.firestore
      .collection('holidays')
      .doc('enableHolidays')
      .update({
        isAvailable: data
      })
  }
  checkHolidays() {
    return this.firestore.collection('holidays').doc('enableHolidays').valueChanges();
  }

  getHolidays(path: string, uid: string) {
    return this.firestore.collection(path + '/' + uid + '/vacaciones').snapshotChanges();
  }

  askForHolidays<type>(path: string, uid: string, data: any) {
    
    const collection = this.firestore.collection(path + '/' + uid + '/vacaciones');
    return collection.doc<type>(data.title).set(data).then(() => {
      return true;
    }).catch((err) => {
      console.log(err);
      return false;
    });

  }


  editHolidays<type>(path: string, uid: string, info: number) {
    let id: string;


    const collectionRef = this.firestore
      .collection(path)
      .doc(uid).collection('vacaciones').snapshotChanges();


    collectionRef.subscribe(value => {
      value.forEach(element => {
        if (!element.payload.doc.data().petition) {
          id = element.payload.doc.id;

          return this.firestore
            .collection(path)
            .doc(uid).collection('vacaciones').doc(id).update({
              petition: info,
            }).then(() => {
              return this.firestore.collection(path).doc<type>(uid).collection('vacaciones').doc(id).valueChanges();
            });
        }
      });
    })
  }

  deleteHoliday<type>(path: string, uid: string, id: string) {
    return this.firestore.collection(path).doc<type>(uid).collection('vacaciones').doc(id).delete().then(() => {
      return true;
    }).catch((error) => {
      console.log(error);
      return false;

    });
  }

}
