import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/interfaces/usuario.interface';
import { FirestoreService } from 'src/app/services/firestore.service';
import { CallNumber } from '@ionic-native/call-number/ngx'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

 
  usuarios: Usuario[];
  constructor(private database: FirestoreService, private callNumber: CallNumber) { }

  ngOnInit() {
    this.usuarios = [];
    this.getUsuarios();
  }

  getUsuarios(){
    this.database.getCollection<Usuario>('usuarios').subscribe((res) => {
      this.usuarios = res; 
    });
  }

  async callUser(data){

   await this.callNumber.callNumber(data, true)
    .then(res => console.log('Launched dialer!', res))
    .catch(err => console.log('Error launching dialer', err));
    
  }

}
