import { InteractionService } from './../../services/interaction.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { ModalController } from '@ionic/angular';


@Component({
  selector: 'app-info-modal',
  templateUrl: './info-modal.component.html',
  styleUrls: ['./info-modal.component.scss'],
})
export class InfoModalComponent implements OnInit {

  info: any;
  user: any;
  id_user: any;

  constructor(private modalCtrl: ModalController, private callNumber: CallNumber, private router: Router, private interaction: InteractionService) {
    this.info = localStorage.getItem('user');
    this.user = JSON.parse(this.info)
   

  }

  ngOnInit() { 
    this.id_user = this.user.id_usuario;
  }

  close() {
    this.modalCtrl.dismiss();
  }

  //Funcion para llamar al usuario
  async callUser(data) {

    this.modalCtrl.dismiss();
    await this.callNumber.callNumber(data, true)
      .then(res => console.log('Launched dialer!', res))
      .catch(err => console.log('Error launching dialer', err));

  }


  //Funcion para ver los horarios del usuario
  userCalendar() {
    this.modalCtrl.dismiss();
    this.router.navigate(['uhome/' + this.user.uid])

  }

  //Funcion para liberar el ID del usuario
  clearID(user){  
   this.interaction.presentLiberar(user);
  }

}
