import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { Usuario } from 'src/app/interfaces/usuario.interface';
import { FirestoreService } from 'src/app/services/firestore.service';
import { InteractionService } from 'src/app/services/interaction.service';


@Component({
  selector: 'app-exworkers',
  templateUrl: './exworkers.component.html',
  styleUrls: ['./exworkers.component.scss'],
})
export class ExworkersComponent implements OnInit {

  usuarios: Usuario[];
  
  constructor(private database: FirestoreService, public route: ActivatedRoute, private menu: MenuController, private router: Router, private interaction: InteractionService) { }

  ngOnInit() {
    this.usuarios = [];
    this.getUsuarios();
    this.menu.close();
  }

  getUsuarios() {
    this.database.getExWorkers<Usuario>('usuarios').subscribe((res) => {
      this.usuarios = res;
    });
  }

  acceptUser(index){
    this.interaction.presentAlertHabilitar(this.usuarios[index]);
  }

}
