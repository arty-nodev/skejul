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

  options: AnimationOptions = {
    path: 'assets/hello.json'
  }

  constructor(public auth: AuthService, private interaction: InteractionService, private router: Router, private menu: MenuController, private firestore: FirestoreService) {
    this.getEstado();
  }


  ngOnInit() {
    this.menu.swipeGesture(false);

  }

  getEstado() {
    this.auth.estadoUsuario().subscribe(res => {
      if (res) {
        this.auth.loginUser = true;
        console.log(res.uid);
        this.getCargo(res.uid);
      }
      else {
        console.log('not logged');
        this.router.navigate(['login'])
        this.auth.loginUser = false;

      }
    })
  }
  logout() {
    this.rol = null;
    localStorage.removeItem('info');
    localStorage.removeItem('user');
    localStorage.removeItem('holidays');
    this.auth.logout();
    this.interaction.presentToast("Sesión cerrada");
    this.auth.loginUser = false;
    this.menu.close();
    this.router.navigate(['login']);

    this.interaction.presentLoading("Cerrando sesión").then(() => {
      window.top.location.reload();
    });

  }

  getCargo(uid: string) {
    const path = 'usuarios';
    const id = uid;
    console.log(this.auth.loginUser);
    this.firestore.getDoc<Usuario>(path, id).subscribe(res => {
      if (res && this.auth.loginUser) {
        this.name = res.nombre;
        this.rol = res.cargo;
        this.uid = res.uid;
        console.log(res.cargo);
      }
    })
  }

  goHome() {
    this.router.navigate(['welcome']);
    this.menu.close();
  }

  goHorarios() {
    this.router.navigate(['uhome/' + this.uid]);
    this.menu.close();
  }

  goHolidays() {
    this.router.navigate(['holidays/' + this.uid])
    this.menu.close();

  }


  checkHolidays() {
    this.router.navigate(['checkHolidays']);
    this.menu.close();
  }

  goTrabajadores() {
    this.router.navigate(['ahome']);
    this.menu.close();
  }
  goRegister() {
    this.router.navigate(['register']);
    this.menu.close();
  }
  goExWorkers() {
    this.router.navigate(['exworkers']);
    this.menu.close();
  }
}


