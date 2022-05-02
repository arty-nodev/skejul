import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { StorageService } from 'src/app/services/storage.service';
import { Usuario } from 'src/app/interfaces/usuario.interface';
import { FirestoreService } from 'src/app/services/firestore.service';
import { InteractionService } from 'src/app/services/interaction.service';

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
    horarios: [],
    id_local: null
  }

  user: any;
  constructor(private storage: StorageService, private database: FirestoreService, private interaction: InteractionService) {
   
    this.getUser();
  }

  ngOnInit() {

  }

  async getUser() {
    this.ngOnInit();
    this.interaction.presentLoading('Cargando datos...')
    this.user = await this.storage.get('user');    
    this.data.apellidos = this.user.apellidos;
    this.data.cargo = this.user.cargo;
    this.data.correo = this.user.correo;
    this.data.password = this.user.password;
    this.data.id_usuario = this.user.id_usuario;
    this.data.nombre = this.user.nombre;
    this.data.telefono = this.user.telefono;
    this.data.uid = this.user.uid;

  }

  editarUsuario() {
    this.interaction.presentLoading('Editando usuario...')
    this.database.editDoc<Usuario>('usuarios', this.data.uid, this.data).then(res => {
      if (res) {
        console.log(res);
        this.interaction.presentToast('Usuario editado con éxito');
        this.interaction.closeLoading();

      } else {
        this.interaction.presentToast('Algo salió mal');
        this.interaction.closeLoading();
      }
    })
  }

}
