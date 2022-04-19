import { Usuario } from 'src/app/interfaces/usuario.interface';
import { FirestoreService } from './../../services/firestore.service';
import { Component, OnInit } from '@angular/core';
import { InteractionService } from 'src/app/services/interaction.service';
import { AuthService } from 'src/app/services/auth.service';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-ajustes',
  templateUrl: './ajustes.component.html',
  styleUrls: ['./ajustes.component.scss'],
})
export class AjustesComponent implements OnInit {

  data: Usuario = {
    nombre: null,
    apellidos: null,
    correo: null,
    password: null,
    telefono: null,
    id_usuaro: null,
    uid: null,
    cargo: null,
    horarios: [],
    id_local: null
  }

  constructor(private database: FirestoreService, private interaction: InteractionService, private auth: AuthService) { }

  ngOnInit() { }



  async crearNuevoUsuario() {
    this.interaction.presentLoading('Creando usuario...')
    const resgister = await this.auth.registrarUsuario(this.data).catch(error => {
      this.interaction.closeLoading();
      this.interaction.presentToast('Error al crear usuario');

    });

    console.log(resgister);
    
    if (resgister) {
      const path = 'usuarios';
      const uid = resgister.user.uid;
      console.log(uid);
      
      this.data.uid = uid;
      this.data.password = null;
      await this.database.createDoc(this.data, path, uid).then(() => {
        this.interaction.presentToast('Usuario creado con éxito');
        this.interaction.closeLoading();
      
        
      });

      //Buscar metodo refactor
      this.data.nombre = null;
      this.data.apellidos = null;
      this.data.telefono = null;
      this.data.cargo = null;
      this.data.correo = null;
      this.data.id_usuaro = null;
      this.data.password = null;
    }

  }



}
