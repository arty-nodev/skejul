import { StorageService } from './../../services/storage.service';
import { MenuController } from '@ionic/angular';
import { Router } from '@angular/router';
import { InteractionService } from 'src/app/services/interaction.service';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {


  constructor(private auth: AuthService, private interaction: InteractionService, private router: Router, private storage: StorageService) { 
   
  }

  ngOnInit() { }


  async login(correo, password) {

    await this.interaction.presentLoading("Iniciando sesión");
    const data = [{'correo':correo, 'password': password}]
    const res = await this.auth.login(correo, password).catch(error => {
      console.log("Error");
      this.interaction.closeLoading();
      this.interaction.presentToast("Usuario o contraseña inválidos")

    })



    if (res) {
      this.storage.set('info', data);
      console.log("respuesta ->", res);
      this.interaction.closeLoading();
      this.interaction.presentToast("Sesión iniciada con éxito")
      this.router.navigate(['home']);

    }
  }

}
