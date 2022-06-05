import { FirestoreService } from './../../services/firestore.service';
import { Router } from '@angular/router';
import { InteractionService } from 'src/app/services/interaction.service';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/interfaces/usuario.interface';
import { AES } from 'crypto-js';
import { AnimationOptions } from 'ngx-lottie';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  data: any
  newObject: any;
  correo: string;
  password: string;

  encrypt: string;
  decrypt: any;

  options: AnimationOptions = {
    path: 'assets/calendar.json'
  }
  constructor(private auth: AuthService, private interaction: InteractionService, private router: Router, private firestore: FirestoreService) {
   
    this.correo = '';
    this.password = '';
    this.auth.logout();
  }

  ngOnInit() {
    this.auth.logout();
    this.data = localStorage.getItem('info')
    this.newObject = JSON.parse(this.data);
    if (this.data != null) {
      this.decrypt = CryptoJS.AES.decrypt(this.newObject['password'], 'crypt').toString(CryptoJS.enc.Utf8);
      this.login(this.newObject.correo, this.decrypt)

    }
  }


  async login(correo, password) {

    await this.interaction.presentLoading("Iniciando sesión");
    const info = { 'correo': correo, 'password': password }
    this.auth.login(correo, password).then(res => {

      if (res) {

        if (this.data == null) {

          this.encrypt = CryptoJS.AES.encrypt(info['password'], 'crypt').toString();
          info['password'] = this.encrypt;

          localStorage.setItem('info', JSON.stringify(info));
        }

        this.interaction.closeLoading();
        this.interaction.presentToast("Sesión iniciada con éxito");
        this.auth.loginUser = true;
        this.correo = '';
        this.password = '';
        this.firestore.getDoc<Usuario>('usuarios', res.user.uid).subscribe(res => {
          localStorage.setItem('user', JSON.stringify(res));
          if (this.auth.loginUser) {
            this.router.navigate(['welcome']);
          } else {
            this.router.navigate(['login']);
          }
        })
      }
    }).catch(error => {
      this.interaction.closeLoading();
      this.interaction.presentToast("Usuario o contraseña inválidos")
    })

  }
}
