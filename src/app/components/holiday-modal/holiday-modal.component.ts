import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { InteractionService } from 'src/app/services/interaction.service';
import { ModalController } from '@ionic/angular';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CalendarComponent } from 'ionic2-calendar';
import { Usuario } from 'src/app/interfaces/usuario.interface';

@Component({
  selector: 'app-holiday-modal',
  templateUrl: './holiday-modal.component.html',
  styleUrls: ['./holiday-modal.component.scss'],
})
export class HolidayModalComponent implements OnInit {

  viewTitle: string;
  firstTime: number;
  click: string;
  eventSource: any;
  uid: string;
  uidUser: any;
  rol: string;
  idEvent: string;

  calendar = {
    mode: 'month',
    currentDate: new Date(),

  };
  event = {
    startTime: new Date(),
    endTime: new Date(),
    turno: 'Vacaciones',
    petition: 0
  };


  markDisabled = (date: Date) => {
    const current = new Date();
    return (date) < current;
  }

  @ViewChild(CalendarComponent) myCalendar: CalendarComponent;
  constructor(private modalCtrl: ModalController, private interaction: InteractionService, private db: FirestoreService, private auth: AuthService, private router: Router) {
    this.firstTime = 0;
    this.click = 'Prímer día de vacaciones'
    this.eventSource = [];
    this.rol = '';
    this.uid = '';
    this.uidUser = '';
    this.idEvent = '';



    this.getEstado();
  }


  ngOnInit() {

  }

  //Recogemos la información del usuario
  getEstado() {
    this.auth.estadoUsuario().subscribe(res => {
      if (res) {
        this.db.getDoc<Usuario>('usuarios', res.uid).subscribe(res => {
          if (res && res.cargo != 'Gerente') {
            this.rol = res.cargo;
            this.uid = res.uid;
            this.getHolidays(this.uid);
          }
        })
      } else {
        this.router.navigate(['login'])
        this.auth.loginUser = false;
      }
    })
  }

  //Opciones del calendario

  next() {
    this.myCalendar.slideNext();
  }
  back() {
    this.myCalendar.slidePrev();
  }

  close() {
    this.modalCtrl.dismiss();
  }


  onViewTitleChanged(tittle) {
    this.viewTitle = tittle.toUpperCase();
  }

  //El usuario solicita días de vacaciones
  solicitHoliday() {

    if (this.firstTime == 0) {
      this.firstTime++;
      this.click = 'Último día de vacaciones'


    } else if (this.firstTime == 1) {

      this.interaction.presentHolidaysConfirm('usuarios', this.uid, this.event, this.idEvent).then(res => {
        if (res) {
          this.modalCtrl.dismiss();
          this.interaction.presentToast("Vacaciones solicitadas");
          this.firstTime = 0;
          this.click = 'Primer día de vacaciones'
        }

      });

    }

  }

  //Asignamos el día seleccionado al evento
  onTimeSelected(ev) {

    if (this.firstTime == 0) {

      this.event.startTime = ev.selectedTime;
    } else if (this.firstTime == 1) {
      this.event.endTime = ev.selectedTime;
    }

  }

  //Recogemos las vacaciones del usuario
  getHolidays(uid) {
    this.eventSource = [];
    this.db.getHolidays('usuarios', uid).subscribe(colSnap => {
      colSnap.forEach(snap => {
        let event: any = snap.payload.doc.data();
        if (event.petition == 0) {
          event.id = snap.payload.doc.id;
          this.idEvent = event.id;

        }
      })
    })
  }

}
