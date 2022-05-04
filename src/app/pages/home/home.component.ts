import { MenuController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/interfaces/usuario.interface';
import { FirestoreService } from 'src/app/services/firestore.service';
import { CallNumber } from '@ionic-native/call-number/ngx'
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from 'src/app/services/storage.service';
import { InteractionService } from 'src/app/services/interaction.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {


  usuarios: Usuario[];
 
  constructor(private database: FirestoreService, private callNumber: CallNumber, public route: ActivatedRoute, private menu: MenuController, private storage: StorageService, private router: Router, private interaction: InteractionService) { }

  ngOnInit() {
    this.usuarios = [];
    this.getUsuarios();
    this.menu.close();
  }

  getUsuarios() {
    this.database.getCollection<Usuario>('usuarios').subscribe((res) => {
      this.usuarios = res;
    });
  }

  async callUser(data) {
    await this.callNumber.callNumber(data, true)
      .then(res => console.log('Launched dialer!', res))
      .catch(err => console.log('Error launching dialer', err));

  }

  editUser(index){
    this.storage.set('user', this.usuarios[index]);
    this.router.navigate(['edit']);
   
  }

  removeUser(index){
    this.interaction.presentAlertConfirm(this.usuarios[index]);
  }

}
