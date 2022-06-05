import { AuthService } from 'src/app/services/auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { Component, AfterViewInit } from '@angular/core';
import { Usuario } from 'src/app/interfaces/usuario.interface';
import { InteractionService } from 'src/app/services/interaction.service';

@Component({
  selector: 'app-check-holidays',
  templateUrl: './check-holidays.component.html',
  styleUrls: ['./check-holidays.component.scss'],
})
export class CheckHolidaysComponent implements AfterViewInit {

  usuarios: Usuario[];
  difference: number;
  allHolidays: any[];
  index: number;
  vacaciones: string;
  isAvailable: boolean;
  idHoliday: string;

  constructor(private database: FirestoreService, private interaction: InteractionService, private auth: AuthService) {
    this.allHolidays = [];
    this.index = 0;
    this.vacaciones = 'Habilitar vacaciones'
    this.idHoliday = '';
  }
  ngAfterViewInit() {
    this.getUsuarios();
    //Se comprueba si el botón está habilitado o no
    this.database.checkHolidays().subscribe(value => {
      this.isAvailable = value['isAvailable'];
    })
  }


  //Se habilita o deshabilita el botón de las vacaciones
  setHolidays(event) {
    if (event.detail.checked) {
      this.vacaciones = 'Deshabilitar vacaciones'
      this.database.enableHolidays(event.detail.checked);
    } else {
      this.vacaciones = 'Habilitar vacaciones'

      this.database.enableHolidays(event.detail.checked);
    }

  }

  //Se recogen todos los usuarios
  getUsuarios() {
    this.database.getCollection<Usuario>('usuarios').subscribe((res) => {
      this.usuarios = res;
      this.getHolidays(res)
    });
  }

  //Se recogen las vacaciones de los usuarios
  getHolidays(data) {
    this.allHolidays = [];
    data.forEach(element => {
      this.database.getHolidays('usuarios', element.uid).subscribe(colSnap => {
        this.index = data.indexOf(element);

        if (colSnap.length == 0) this.usuarios.splice(this.index, 1);

        colSnap.forEach(snap => {
          let event: any = snap.payload.doc.data();

          //Petition: 0 = pendiente
          //Petition: 1 = aceptada
          if (event.petition == 0) {
            event.id = snap.payload.doc.id;
            event.startTime = event.startTime.toDate();
            event.endTime = event.endTime.toDate();
            if (event.startTime.getTime() > new Date().getTime()) {
              this.difference = this.getDifferenceOfDays(new Date(), event.startTime);
              this.allHolidays.push(event);
            }
          } else if ((event.petition != 0) && this.index > -1) {
            this.usuarios.splice(this.index, 1);

          }

        })

      })


    });

  }

  //Se deniegan las vacaciones al usuario
  deny(data) {
    this.interaction.presentSolicitHolidays('usuarios', this.usuarios[data].uid, this.usuarios[data], this.allHolidays[data].id).then((res) => {

      if (res) this.usuarios.splice(data, 1);
    });

  }

  //Se aceptan las vacaciones
  accept(data) {
    this.interaction.presentSolicitHolidays('usuarios', this.usuarios[data].uid, this.usuarios[data], 1);
  }

  //Se utiliza para mostrar la difeencia entre el inicio de las vacaciones y el final
  getDifferenceOfDays(start, end) {

    const date1 = new Date(start);
    const date2 = new Date(end);

    const diffTime = Math.abs(date2.getTime() - date1.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  }


}
