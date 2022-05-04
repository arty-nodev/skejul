import { Usuario } from 'src/app/interfaces/usuario.interface';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';



@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private auth: AngularFireAuth) { }

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

  updateEmail(uid:string){
    //Update email or password first time login
  }
}
