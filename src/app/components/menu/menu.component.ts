import { Usuario } from 'src/app/interfaces/usuario.interface';
import { FirestoreService } from 'src/app/services/firestore.service';
import { Router } from '@angular/router';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { PopoverController, MenuController } from '@ionic/angular';
import { InteractionService } from 'src/app/services/interaction.service';

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
    this.auth.estadoUsuario().subscribe(res => {
      if (res) {
        console.log('logged');
        this.login = true;
        this.getCargo(res.uid);
        console.log(res.uid);


      }
      else {
        console.log('not logged');
        this.login = false;
      }
    })
  }


  ngOnInit() {
    this.menu.swipeGesture(false);
    this.menu.close();
  }


  logout() {
    this.auth.logout();
    this.interaction.presentToast("Sesión cerrada");
    this.router.navigate(['login'])
    this.menu.close();

  }

  getCargo(uid: string) {
    const path = 'usuarios';
    const id = uid;
    this.firestore.getDoc<Usuario>(path, id).subscribe(res => {
      if (res) {
        this.rol = res.cargo;
        console.log(res.cargo);
        
      }
    })

  }
 
}
