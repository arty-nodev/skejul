import { MenuController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/interfaces/usuario.interface';
import { FirestoreService } from 'src/app/services/firestore.service';
import { CallNumber } from '@ionic-native/call-number/ngx'
import { ActivatedRoute, Router } from '@angular/router';
import { InteractionService } from 'src/app/services/interaction.service';

@Component({
  selector: 'app-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.scss'],
})
export class AdminHomeComponent implements OnInit {


  usuarios: Usuario[];

  constructor(private database: FirestoreService, private callNumber: CallNumber, public route: ActivatedRoute, private menu: MenuController, private router: Router, private interaction: InteractionService) {
    this.usuarios = []; 
  }

  ngOnInit() {
    this.getUsuarios();
    this.menu.close();
  }

  //Se recogen todos los usuarios
  getUsuarios() {
    this.database.getCollection<Usuario>('usuarios').subscribe((res) => {  
      this.usuarios = res;
      
    });
   
  }

  //Función para llamar al usuario
  async callUser(data) {
    await this.callNumber.callNumber(data, true)
      .then(res => console.log('Launched dialer!', res))
      .catch(err => console.log('Error launching dialer', err));

  }

  //Función para ir a la edición del usuario
  editUser(index) {
    localStorage.setItem('user', JSON.stringify(this.usuarios[index]));
    this.router.navigate(['edit']);

  }

  //Función para dar de baja un usuario
  removeUser(index) {
   
    this.interaction.presentAlertConfirm(this.usuarios[index]);
  }

  //Función para acceder a los horarios del trabajador seleccionado
  userCalendar(index) {
    localStorage.setItem('user', JSON.stringify(this.usuarios[index]));
  
    this.router.navigate(['uhome/' + this.usuarios[index].uid])

  }

  //Función para abrir la aplicación de WhatsApp e ir al chat con el usuario
  chatUser(data){
    window.location.href=`https://wa.me/34${data}`;
  }




}
