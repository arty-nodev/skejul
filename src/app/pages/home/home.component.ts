import { LoginComponent } from 'src/app/pages/login/login.component';
import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/interfaces/usuario.interface';
import { FirestoreService } from 'src/app/services/firestore.service';
import { CallNumber } from '@ionic-native/call-number/ngx'
import { ActivatedRoute } from '@angular/router';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {


  usuarios: Usuario[];
  correo: string = '';
  psw: string = '';

  constructor(private database: FirestoreService, private callNumber: CallNumber, public route: ActivatedRoute, private storage: StorageService) { }

  ngOnInit() {
    this.usuarios = [];
    this.getUsuarios();

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

}
