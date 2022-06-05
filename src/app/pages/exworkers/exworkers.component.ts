import { RegisterComponent } from './../../backend/register/register.component';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuController, ModalController } from '@ionic/angular';
import { InfoModalComponent } from 'src/app/components/info-modal/info-modal.component';
import { Usuario } from 'src/app/interfaces/usuario.interface';
import { FirestoreService } from 'src/app/services/firestore.service';
import { InteractionService } from 'src/app/services/interaction.service';


@Component({
  selector: 'app-exworkers',
  templateUrl: './exworkers.component.html',
  styleUrls: ['./exworkers.component.scss'],
})
export class ExworkersComponent implements OnInit {

  usuarios: Usuario[];
  id_user_nums: number[];
  usuarios_totales: Usuario[];

  constructor(private database: FirestoreService, public route: ActivatedRoute, private interaction: InteractionService, private modalCtrl: ModalController) {
    this.id_user_nums = [];
    this.usuarios = [];
    this.usuarios_totales = [];
   }

  ngOnInit() {
    
    this.getUsuarios();

  }

  getUsuarios() {

    this.database.getAllCollection<Usuario>('usuarios').subscribe((res) => {  
      this.usuarios_totales = res;
      this.id_user_nums = [];
      this.usuarios_totales.forEach(element => {
        this.id_user_nums.push(element.id_usuario);
      });
      
    });
    this.database.getExWorkers<Usuario>('usuarios').subscribe((res) => {
      this.usuarios = res;
     
    });
  }

  acceptUser(index) {

    if (this.usuarios[index].id_usuario == null) {
      
      this.interaction.presentAlertHabilitar(this.usuarios[index], this.newID());
    } else {
      this.interaction.presentAlertHabilitar(this.usuarios[index], this.usuarios[index].id_usuario);
    }
  }

  async infoUser(index) {
    localStorage.setItem('user', JSON.stringify(this.usuarios[index]));
    const modal = await this.modalCtrl.create({
      component: InfoModalComponent,
      cssClass: 'cal-modal-info',
      backdropDismiss: false
    })

    modal.present();
  }

  newID() {
    let num = Math.round(Math.random() * (1000 - 1) + 1);
    this.id_user_nums.forEach(element => {
  
      
      if (element == num) {
        this.newID();
      }
    });
    return num;
  }

}
