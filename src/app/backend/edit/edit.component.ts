import {  Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/interfaces/usuario.interface';
import { FirestoreService } from 'src/app/services/firestore.service';
import { InteractionService } from 'src/app/services/interaction.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class EditComponent implements OnInit {

  data: Usuario = {
    nombre: null,
    apellidos: null,
    correo: null,
    password: null,
    telefono: null,
    id_usuario: null,
    uid: null,
    cargo: null,
    id_local: null,
    trabaja: null,
    firstLogin: null
  }

  info: any;
  user:any;
  cargos:string [];
  constructor(private database: FirestoreService, private interaction: InteractionService, private auth: AuthService, private router: Router) {
    
    this.cargos = ['Gerente', 'Auxiliar'];

    //Recogemos el id del usuario y a continuación su información
     this.auth.estadoUsuario().subscribe(res => {
      if (res) {
        this.database.getDoc<Usuario>('usuarios', res.uid).subscribe(res => {
          if (res) {   
            this.data.id_local = res.id_local;
          }
        })
      }
    }) 
    
  }

  ngOnInit() {
    this.getUser();
  }


  //Se imprimen los datos del usuario en los input de la vista
  async getUser() {
    this.interaction.presentLoading('Cargando datos...')
    this.info = localStorage.getItem('user'); 
    this.user = JSON.parse(this.info)
       
    this.data.apellidos = this.user.apellidos;
    this.data.cargo = this.user.cargo;
    this.data.correo = this.user.correo;
    this.data.password = this.user.password;
    this.data.id_usuario = this.user.id_usuario;
    this.data.nombre = this.user.nombre;
    this.data.telefono = this.user.telefono;
    this.data.uid = this.user.uid;
    this.data.trabaja = this.user.trabaja;

  }

  //Función para cuando se edita el usuario
  editarUsuario() {
    this.interaction.presentLoading('Editando usuario...')
    this.database.editDoc<Usuario>('usuarios', this.data.uid, this.data).then(res => {
      if (res) {
    
        this.interaction.presentToast('Usuario editado con éxito');
        this.interaction.closeLoading();

      } else {
        this.interaction.presentToast('Algo salió mal');
        this.interaction.closeLoading();
      }
    })
  }

  //Función para cuando el usuario necesita de nuevo resetear la contraseña
  resetPassword(){
    this.data.firstLogin = true;
    this.database.editDoc<Usuario>('usuarios', this.data.uid, this.data).then(res => {
      if (res) {
   
        this.interaction.presentToast('Cambio de contraseña enviado');
        this.interaction.closeLoading();

      } else {
        this.interaction.presentToast('Algo salió mal');
        this.interaction.closeLoading();
      }
    })
  }


}
