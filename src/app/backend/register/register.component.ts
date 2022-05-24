import { MenuController } from '@ionic/angular';
import { Usuario } from 'src/app/interfaces/usuario.interface';
import { FirestoreService } from '../../services/firestore.service';
import { Component, OnInit } from '@angular/core';
import { InteractionService } from 'src/app/services/interaction.service';
import { AuthService } from 'src/app/services/auth.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {

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
    trabaja: null
  }

  correo: string = '';
  psw: string = '';


  constructor(private database: FirestoreService, private interaction: InteractionService, private auth: AuthService, private storage: StorageService, private menu: MenuController) {
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
    this.menu.close();
  }



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
      this.data.trabaja = true;
      await this.database.createDoc(this.data, path, uid).then(() => {
        this.login();
      });

      //Buscar metodo refactor
      this.data.nombre = null;
      this.data.apellidos = null;
      this.data.telefono = null;
      this.data.cargo = null;
      this.data.correo = null;
      this.data.id_usuario = null;
      this.data.password = null;
    }

  }

  async login() {

    this.auth.logout();
    const data = await this.storage.get('info');

    if (data != null) {
      this.correo = data[0].correo;
      this.psw = data[0].password;
      console.log(this.correo, '', this.psw);

      const res = await this.auth.login(this.correo, this.psw).catch(error => {
        console.log("Error");

      })

      if (res) {
        console.log("respuesta ->", res);
        window.top.location.reload();
        this.interaction.presentToast('Usuario creado con éxito');
        this.interaction.closeLoading();
      }
    }

  }

}
