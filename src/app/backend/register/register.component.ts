import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { Usuario } from 'src/app/interfaces/usuario.interface';
import { FirestoreService } from '../../services/firestore.service';
import { Component, OnInit } from '@angular/core';
import { InteractionService } from 'src/app/services/interaction.service';
import { AuthService } from 'src/app/services/auth.service';
import { AES } from 'crypto-js';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {

  usuarios: Usuario[];
  id_user: number[];

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
  decrypt:string;

  correo: string = '';
  psw: string = '';
  cargos:string [];


  constructor(private database: FirestoreService, private interaction: InteractionService, private auth: AuthService, private menu: MenuController, private router: Router) {
    this.usuarios = []; 
    this.id_user = [];
    this.cargos = ['Gerente', 'Auxiliar'];
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
    this.getUsuarios();
  }

  getUsuarios() {
    this.database.getCollection<Usuario>('usuarios').subscribe((res) => {
      this.usuarios = res;
      this.usuarios.forEach(element => {
        this.id_user.push(element.id_usuario);
      });
      
    });

   ;
    

  }

  async crearNuevoUsuario() {
    this.interaction.presentLoading('Creando usuario...')
    this.data.password = this.data.nombre+123;
    console.log(this.data.password);
    
    const register = await this.auth.registrarUsuario(this.data).catch(error => {
      this.interaction.closeLoading();
      this.interaction.presentToast('Error al crear usuario');

    });

    console.log(register);

    if (register) {
      const path = 'usuarios';
      const uid = register.user.uid;
      console.log(uid);

      this.data.uid = uid;
      this.data.password = null;
      this.data.trabaja = true;
      this.data.id_usuario = this.newID();
      this.data.firstLogin = true;
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


    const data = localStorage.getItem('info');
    const object = JSON.parse(data);

    if (object != null) {

      this.decrypt = CryptoJS.AES.decrypt(object['password'], 'crypt').toString(CryptoJS.enc.Utf8);

      this.auth.login(object.correo, this.decrypt).then((res) => {
        if (res) {
          console.log("respuesta ->", res);
          window.top.location.reload();
          this.router.navigate(['register']);
          this.interaction.presentToast('Usuario creado con éxito');
          this.interaction.closeLoading();
        }
      }).catch(error => {
        this.interaction.presentToast('Algo salió mal');

      });


    }

  }

   newID(){
    let num = Math.round(Math.random() * (1000-1) + 1);
    this.id_user.forEach(element => {  
      if (element == num) {
        this.newID();
      } 
    });
    return num;
  }

}
