import { FirestoreService } from './../../services/firestore.service';
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
  data:any
  newObject:any;
  correo:string;
  password:string;

  constructor(private auth: AuthService, private interaction: InteractionService, private router: Router, private firestore: FirestoreService) {
    this.auth.logout();
  }

  ngOnInit() {
    this.data = localStorage.getItem('info')
    this.newObject = JSON.parse(this.data);
    if (this.data != null) {
      this.correo = this.newObject.correo;
      this.password = this.newObject.password;
      this.login(this.newObject.correo, this.newObject.password)
   
    }
   }


  async login(correo, password) {

    await this.interaction.presentLoading("Iniciando sesión");
    const info = { 'correo': correo, 'password': password }
    this.auth.login(correo, password).then(res => {

      if (res) {
        //encrypt -''-
        if (this.data == null) localStorage.setItem('info', JSON.stringify(info));
        
        
        this.interaction.closeLoading();
        this.interaction.presentToast("Sesión iniciada con éxito");
        this.auth.loginUser = true;
        this.firestore.getDoc<Usuario>('usuarios', res.user.uid).subscribe(res => {
          if (this.auth.loginUser) {
            console.log('dentro');
            if (res.cargo == 'Auxiliar') {
              this.router.navigate(['uhome/'+res.uid])
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
