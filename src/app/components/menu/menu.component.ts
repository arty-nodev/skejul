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

  constructor(private auth: AuthService, private interaction: InteractionService, private router: Router, private menu: MenuController) { }


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

}
