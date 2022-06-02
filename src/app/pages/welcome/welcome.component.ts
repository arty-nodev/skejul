import { IonicRouteStrategy } from '@ionic/angular';
import { InteractionService } from './../../services/interaction.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/interfaces/usuario.interface';


@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
})
export class WelcomeComponent implements OnInit {

  usuario:any;
  totalUsuarios: any;
  saludo:string;
  

  
  constructor(private database: FirestoreService, private auth: AuthService, private router: Router, private interaction: InteractionService) {
    this.usuario = []; 
    this.totalUsuarios = [];
    this.getHour();
   }

  ngOnInit() {
    this.getUsuario();
    setTimeout(() => {
      this.checkFirstTime(this.usuario)

    }, 1000);
  }

  
  getUsuario() {
    this.auth.estadoUsuario().subscribe(res => {
      if (res) {
        this.database.getDoc<Usuario>('usuarios', res.uid).subscribe(res => {
         this.usuario = res;
         
        })

        this.database.getCollection<Usuario>('usuarios').subscribe(res => {
          this.totalUsuarios = res;
          
         })
      } else {
        this.router.navigate(['login'])
        this.auth.loginUser = false;
      }
    })
   
  }

  verHorarios(){
    this.router.navigate(['uhome/' + this.usuario.uid])
  }
  verVacaciones(){
    this.router.navigate(['holidays/'+this.usuario.uid])
  }

  verUsuarios(){
    this.router.navigate(['ahome'])
  }

  checkFirstTime(res) {
    console.log(res);

    if (res.firstLogin) {
      setTimeout(() => {
        this.interaction.presentReset(res);
      }, 1000);
    }
  }

  getHour(){
    let time = new Date().getHours();
    console.log(time);

    if (time >= 6 && time <= 13) {
      this.saludo = 'Buenos días,';
    } else if(time >=14 && time <= 20) {
      this.saludo = 'Buenas tardes,';
    } else {
      this.saludo = 'Buenas noches,';
    }
    
  }


}
