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

  
  //Recogemos todos los usuarios 
  getAllCollection<type>(path: string) {
    const collection = this.firestore.collection<type>(path);
    return collection.valueChanges();
  }

  //Recogemos los trabajadores activos
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

  //Editamos un usuario
  editDoc<type>(path: string, uid: string, data: any) {
    return this.firestore
      .collection(path)
      .doc(uid)
      .update({
        apellidos: data.apellidos,
        cargo: data.cargo,
        correo: data.correo,
        id_local: data.id_local,
        id_usuario: data.id_usuario,
        nombre: data.nombre,
        password: null,
        telefono: data.telefono,
        firstLogin: data.firstLogin
      })
      .then(() => {
        return this.firestore.collection(path).doc<type>(uid).valueChanges();
      })
  }

  //Deshabilitamos un usuario
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

  //Se añade un nuevo turno al usuario
  createNewEvent(path: string, uid: string, data: any) {
    return this.firestore.collection(path + '/' + uid + '/horarios').doc(data.title).set(data)

  }

  //Se recogen los horarios del usuario
  getEvents(path: string, uid: string) {
    return this.firestore.collection(path + '/' + uid + '/horarios').snapshotChanges();
  }

  //Borramos un turno del usuario
  deleteEvent(path: string, uid: string, id: string) {
    return this.firestore.collection(path).doc(uid).collection('horarios').doc(id).delete().then(() => {
      return true;
    }).catch((error) => {
      console.log(error);
      return false;
    })
  }

//Habilitamos o deshabilitamos la opción de las vacaciones
  enableHolidays(data) {
    return this.firestore
      .collection('holidays')
      .doc('enableHolidays')
      .update({
        isAvailable: data
      })
  }

  //Comprobamos el estado de las vacaciones
  checkHolidays() {
    return this.firestore.collection('holidays').doc('enableHolidays').valueChanges();
  }

  //Recogemos las vacaciones del usuario
  getHolidays(path: string, uid: string) {
    return this.firestore.collection(path + '/' + uid + '/vacaciones').snapshotChanges();
  }


  //Dejamos la solicitud pendiente para el administrador
  askForHolidays<type>(path: string, uid: string, data: any) {
    const collection = this.firestore.collection(path + '/' + uid + '/vacaciones');
    return collection.doc<type>(data.title).set(data).then(() => {
      return true;
    }).catch((err) => {
      console.log(err);
      return false;
    });

  }

  //Función para denegar o aprobar las vacaciones
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

  //Borramos las vacaciones
  deleteHoliday<type>(path: string, uid: string, id: string) {
    this.getHolidays(path, uid).subscribe(res => {
      if (res.length != 0) {
        return this.firestore.collection(path).doc<type>(uid).collection('vacaciones').doc(id).delete().then(() => {
          return true;
        }).catch((error) => {
          console.log(error);
          return false;

        });
      } else return;

    })
  }

}
