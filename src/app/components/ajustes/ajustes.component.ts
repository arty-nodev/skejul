import { FirestoreService } from './../../services/firestore.service';
import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/interfaces/usuario.interface';

@Component({
  selector: 'app-ajustes',
  templateUrl: './ajustes.component.html',
  styleUrls: ['./ajustes.component.scss'],
})
export class AjustesComponent implements OnInit {

  constructor( private database: FirestoreService) { }

  ngOnInit() {}

  crearNuevoUsuario(){

    const usuario = {
      nombre: 'Juan',
      apellidos: 'Ramírez Córdova',
      correo: 'juanrc@gmail.com',
      telefono: 622974001,
      id_usuaro: 11,
      cargo: 0,
      horarios: [],
    }
    this.database.createDoc(usuario,'usuarios').then (() => {
      console.log('guardado');
      
    })
  }

}
