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
  
  constructor(private database: FirestoreService, public route: ActivatedRoute, private menu: MenuController, private router: Router, private interaction: InteractionService, private modalCtrl: ModalController) { }

  ngOnInit() {
    this.usuarios = [];
    this.getUsuarios();
   
  }

  getUsuarios() {
    this.database.getExWorkers<Usuario>('usuarios').subscribe((res) => {
      this.usuarios = res;
    });
  }

  acceptUser(index){
    this.interaction.presentAlertHabilitar(this.usuarios[index]);
  }

  async infoUser(index){
    localStorage.setItem('user', JSON.stringify(this.usuarios[index]));
    const modal = await this.modalCtrl.create({
      component: InfoModalComponent,
      cssClass: 'cal-modal',
      backdropDismiss: false
    })

    modal.present();
  }

}
