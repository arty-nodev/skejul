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

  usuario: any;
  totalUsuarios: any;
  saludo: string;
  trabaja: boolean;
  id_usuario: number;



  constructor(private database: FirestoreService, private auth: AuthService, private router: Router, private interaction: InteractionService) {
    this.usuario = [];
    this.totalUsuarios = [];
    this.getHour();
    this.trabaja = true;
    this.id_usuario = null;
  }

  ngOnInit() {
    this.getUsuario();
    setTimeout(() => {
      //Si no reinicia la contraseña muestra este mensaje
      this.checkFirstTime(this.usuario)

    }, 1000);
  }


  //Recogemos los datos del usuario
  getUsuario() {
    this.auth.estadoUsuario().subscribe(res => {
      if (res) {
        this.database.getDoc<Usuario>('usuarios', res.uid).subscribe(res => {
          this.usuario = res;
          this.trabaja = res.trabaja;
          this.id_usuario = res.id_usuario;

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

  //Navegar a los horarios del trabajador
  verHorarios() {
    this.router.navigate(['uhome/' + this.usuario.uid])
  }
  //Navegar a las vacaciones del trabajador
  verVacaciones() {
    this.router.navigate(['holidays/' + this.usuario.uid])
  }
  //Navegar a todos los usuarios
  verUsuarios() {
    this.router.navigate(['ahome'])
  }

  //Funcion para comprobar si la contraseña ha cambiado
  checkFirstTime(res) {
    if (res.firstLogin) {
      setTimeout(() => {
        this.interaction.presentReset(res);
      }, 1000);
    }
  }

  //Función para determinar el mensaje de bienvenida
  getHour() {
    let time = new Date().getHours();

    if (time >= 6 && time <= 13) {
      this.saludo = 'Buenos días,';
    } else if (time >= 14 && time <= 20) {
      this.saludo = 'Buenas tardes,';
    } else {
      this.saludo = 'Buenas noches,';
    }

  }


}
