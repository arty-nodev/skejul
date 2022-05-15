import { FirestoreService } from './../../services/firestore.service';
import { StorageService } from './../../services/storage.service';
import { Router } from '@angular/router';
import { InteractionService } from 'src/app/services/interaction.service';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/interfaces/usuario.interface';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  constructor(private auth: AuthService, private interaction: InteractionService, private router: Router, private storage: StorageService, private firestore: FirestoreService) {

  }

  ngOnInit() { }


  async login(correo, password) {

    await this.interaction.presentLoading("Iniciando sesión");
    const data = [{ 'correo': correo, 'password': password }]
    this.auth.login(correo, password).then(res => {

      if (res) {
        this.storage.set('info', data);
        this.interaction.closeLoading();
        this.interaction.presentToast("Sesión iniciada con éxito");
        this.auth.loginUser = true;
        this.firestore.getDoc<Usuario>('usuarios', res.user.uid).subscribe(res => {
          if (this.auth.loginUser) {
            console.log('dentro');
            if (res.cargo == 'Auxiliar') {
              this.router.navigate(['uhome'])
              console.log('go user');
            } else if (res.cargo == 'Gerente') {
              this.router.navigate(['ahome']);
              console.log('go admin');
            } else {
              this.router.navigate(['login']);
            }
          }
        })
      }
    }).catch(error => {
      console.log("Error", error);
      this.interaction.closeLoading();
      this.interaction.presentToast("Usuario o contraseña inválidos")
    })

  }
}
