import { FirestoreService } from 'src/app/services/firestore.service';
import { Usuario } from 'src/app/interfaces/usuario.interface';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';



@Injectable({
  providedIn: 'root'
})
export class AuthService {

  loginUser:boolean = false;


  constructor(private auth: AngularFireAuth, private firestore: FirestoreService) { }

  login(correo: string, password: string){
   return this.auth.signInWithEmailAndPassword(correo, password);
  }

  logout(){
    this.auth.signOut();
  }

  registrarUsuario(datos: Usuario){
    return this.auth.createUserWithEmailAndPassword(datos.correo, datos.password);
  }
  
  estadoUsuario(){
    return this.auth.authState;
  }

  updatePassword(data:any){
    this.auth.sendPasswordResetEmail(data.correo).then(() => {
      this.firestore.editDoc('usuarios', data.uid, data);
    });

  }

  checkLogin(){
    return this.loginUser;
  }
}
