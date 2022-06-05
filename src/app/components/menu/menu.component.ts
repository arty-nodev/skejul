import { Usuario } from 'src/app/interfaces/usuario.interface';
import { FirestoreService } from 'src/app/services/firestore.service';
import { Router } from '@angular/router';
import { AuthService } from './../../services/auth.service';
import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { InteractionService } from 'src/app/services/interaction.service';
import { AnimationOptions } from 'ngx-lottie';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent {

  cargo: String[] = ['Auxiliar', 'Encargado', 'Gerente'];
  rol: string = null;
  uid: string = '';
  name: string;
  menuOpen:any;
  trabaja: boolean;

  options: AnimationOptions = {
    path: 'assets/hello.json'
  }

  constructor(public auth: AuthService, private interaction: InteractionService, private router: Router, private menu: MenuController, private firestore: FirestoreService) {
    this.trabaja = true;
    this.getEstado();
  }


  ngOnInit() {
    this.menu.swipeGesture(false);

  }

  //Recogemos la información del usuario
  getEstado() {
    this.auth.estadoUsuario().subscribe(res => {
      if (res) {
        this.auth.loginUser = true;
      
        this.getCargo(res.uid);
      }
      else {
        this.router.navigate(['login'])
        this.auth.loginUser = false;

      }
    })
  }

  //Funcion para cerrar sesión
  logout() {
    this.menu.close();
    this.rol = null;
    localStorage.removeItem('info');
    localStorage.removeItem('user');
    localStorage.removeItem('holidays');
    this.auth.logout();
    this.auth.loginUser = false;
    this.router.navigate(['login']);


  }

  //Funcion para obtener el cargo del usuario
  getCargo(uid: string) {
    const path = 'usuarios';
    const id = uid;
    this.firestore.getDoc<Usuario>(path, id).subscribe(res => {
      if (res && this.auth.loginUser) {
        this.name = res.nombre;
        this.rol = res.cargo;
        this.uid = res.uid;
        this.trabaja = res.trabaja;
      }
    })
  }

  //Navegación al inicio
  goHome() {
    this.router.navigate(['welcome']);
    this.menu.close();
  }

  //Navegación a los horarios del usuario
  goHorarios() {
    this.router.navigate(['uhome/' + this.uid]);
    this.menu.close();
  }

  //Navegación a las vacaciones del usuario
  goHolidays() {
    this.router.navigate(['holidays/' + this.uid])
    this.menu.close();

  }

//Navegación a la vista para las solicitudes de vacaciones
  checkHolidays() {
    this.router.navigate(['checkHolidays']);
    this.menu.close();
  }

  //Navegación a la lista de todos los trabajadores
  goTrabajadores() {
    this.router.navigate(['ahome']);
    this.menu.close();
  }

  //Navegación para ir al registro de usuarios
  goRegister() {
    this.router.navigate(['register']);
    this.menu.close();
  }

  //Navegación para ir a la vista de ex-trabajadores
  goExWorkers() {
    this.router.navigate(['exworkers']);
    this.menu.close();
  }
}


