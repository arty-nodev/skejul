import { Usuario } from 'src/app/interfaces/usuario.interface';
import { FirestoreService } from 'src/app/services/firestore.service';
import { Router } from '@angular/router';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { PopoverController, MenuController } from '@ionic/angular';
import { InteractionService } from 'src/app/services/interaction.service';
import { LoginComponent } from 'src/app/pages/login/login.component';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent {

  login: boolean = false;
  cargo: String[] = ['Auxiliar', 'Encargado', 'Gerente'];
  rol: string = null;


  constructor(private auth: AuthService, private interaction: InteractionService, private router: Router, private menu: MenuController, private firestore: FirestoreService) {
    this.getEstado();
  }


  ngOnInit() {
    this.menu.swipeGesture(false);
    this.menu.close();

  }

  getEstado() {
    this.auth.estadoUsuario().subscribe(res => {
      if (res) {
        this.login = true;
        console.log(res.uid);
        this.getCargo(res.uid);
      }
      else {
        console.log('not logged');
        this.router.navigate(['login'])
        this.login = false;

      }
    })
  }
  logout() {
    this.rol = null;
    this.auth.logout();
    this.interaction.presentToast("Sesión cerrada");
  }

  getCargo(uid: string) {
    const path = 'usuarios';
    const id = uid;
    console.log(this.login);
    this.firestore.getDoc<Usuario>(path, id).subscribe(res => {
      if (res && this.login) {
        this.rol = res.cargo;
        console.log(res.cargo);
      }
    })
  }
}


