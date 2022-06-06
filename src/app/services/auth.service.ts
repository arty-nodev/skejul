import { FirestoreService } from 'src/app/services/firestore.service';
import { Usuario } from 'src/app/interfaces/usuario.interface';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';



@Injectable({
  providedIn: 'root'
})
export class AuthService {

  loginUser: boolean = false;


  constructor(private auth: AngularFireAuth, private firestore: FirestoreService) { }

  //Función para el login
  login(correo: string, password: string) {
    return this.auth.signInWithEmailAndPassword(correo, password);
  }
  //Función para el logout
  logout() {
    this.auth.signOut();
  }

  //Función para registrar nuevo usuario
  registrarUsuario(datos: Usuario) {
    return this.auth.createUserWithEmailAndPassword(datos.correo, datos.password);
  }
  //Función para ver el estado del usuario
  estadoUsuario() {
    return this.auth.authState;
  }
  //Función para enviar el correo al usuario
  updatePassword(data: any) {
    this.auth.sendPasswordResetEmail(data.correo).then(() => {
      this.firestore.editDoc('usuarios', data.uid, data);
    });

  }
  //Función para ver si el usuario está con sesión activa 
  checkLogin() {
    return this.loginUser;
  }
}
