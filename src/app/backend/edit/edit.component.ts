import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { StorageService } from 'src/app/services/storage.service';
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
    trabaja: null
  }

  user: any;
  constructor(private storage: StorageService, private database: FirestoreService, private interaction: InteractionService, private auth: AuthService, private router: Router) {
   
    this.getUser();
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

  }

  async getUser() {
    this.ngOnInit();
    this.interaction.presentLoading('Cargando datos...')
    this.user = await this.storage.get('user'); 
    console.log(this.user);
       
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

  volver(){
    this.router.navigate(['ahome']);
    this.ngOnInit();
  }

}
