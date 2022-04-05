import { Usuario } from 'src/app/interfaces/usuario.interface';
import { FirestoreService } from './../../services/firestore.service';
import { Component, OnInit } from '@angular/core';
import { InteractionService } from 'src/app/services/interaction.service';

@Component({
  selector: 'app-ajustes',
  templateUrl: './ajustes.component.html',
  styleUrls: ['./ajustes.component.scss'],
})
export class AjustesComponent implements OnInit {

  data: Usuario = {
      nombre: '',
      apellidos: '',
      correo: '',
      telefono: 0,
      id_usuaro: 0,
      uid: '',
      cargo: 0,
      horarios: [],
  }

  constructor(private database: FirestoreService, private interaction: InteractionService) { }

  ngOnInit() {}

  crearNuevoUsuario(){
    this.interaction.presentLoading('Creando usuario...')
    const uid = this.database.getId();
    this.data.uid = uid;
    this.database.createDoc(this.data, 'usuarios', uid).then(() => {
      this.interaction.presentToast('Usuario creado con éxito');
      this.interaction.closeLoading();
    });
  }

}
