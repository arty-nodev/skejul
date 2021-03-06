import { InteractionService } from 'src/app/services/interaction.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalComponent } from './../../components/modal/modal.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CalendarComponent } from 'ionic2-calendar';
import { Usuario } from 'src/app/interfaces/usuario.interface';
import { AuthService } from 'src/app/services/auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';



@Component({
  selector: 'app-user-home',
  templateUrl: './user-home.component.html',
  styleUrls: ['./user-home.component.scss'],
})
export class UserHomeComponent implements OnInit {

  eventSource = [];
  viewTitle: string;
  newEvent: Date;
  rol: string;
  uidUser: string;
  selectedDate = new Date();

  database: any;
  data: any;
  uid: string;
  trabaja: boolean = true;
  info: string;
  user: any;



  calendar = {
    mode: 'month',
    currentDate: new Date()

  };


  @ViewChild(CalendarComponent) myCalendar: CalendarComponent;
  constructor(private db: FirestoreService, private auth: AuthService, private modalCtrl: ModalController, private route: ActivatedRoute, private router: Router, private interaction: InteractionService) {
    this.info = localStorage.getItem('user');
    this.user = JSON.parse(this.info)
    //Recigemos los datos del usuario
    this.auth.estadoUsuario().subscribe(res => {
      if (res) {
        this.db.getDoc<Usuario>('usuarios', res.uid).subscribe(res => {
          if (res && res.cargo != 'Gerente') {
            this.rol = res.cargo;
            this.uid = res.uid;
            this.loadEvents(this.uid);

          } else {
            this.rol = res.cargo;
            this.trabaja = this.user.trabaja;

            this.loadEvents(this.uidUser);
          }
        })
      } else {
        this.router.navigate(['login'])
        this.auth.loginUser = false;
      }
    })



  }

  ngOnInit() {
    this.uidUser = this.route.snapshot.paramMap.get('uid');
  }

  //Cargamos los horarios del usuario
  loadEvents(uid) {
    this.eventSource = []
    this.db.getEvents('usuarios', uid).subscribe(colSnap => {
      this.eventSource = [];
      colSnap.forEach(snap => {
        let event: any = snap.payload.doc.data();
        event.id = snap.payload.doc.id;
        event.startTime = event.startTime.toDate();
        event.endTime = event.endTime.toDate();
        event.title = event.turno;
        this.eventSource.push(event)
        this.myCalendar.loadEvents();
      })
    })


    if (this.rol == 'Auxiliar') {

      this.getHolidays(uid);
    }

  }

  //Funciones del calendario
  next() {
    this.myCalendar.slideNext();
  }
  back() {
    this.myCalendar.slidePrev();
  }

  onViewTitleChanged(tittle) {
    this.viewTitle = tittle.toUpperCase();
  }

  //Funcion para borrar el turno
  onEventSelected(event) {
    if (this.rol == 'Gerente') {
      this.interaction.presentDeleteHorario(event, this.uidUser);
    }

  }


  //Se abre el modal para a??adir nuevos turnos
  async openCalModal() {
    const modal = await this.modalCtrl.create({
      component: ModalComponent,
      cssClass: 'cal-modal',
      backdropDismiss: false
    })

    modal.present();

    modal.onDidDismiss().then((result) => {

      if (result.data && result.data.event) {
        let newEvent = result.data.event;
        let start = newEvent.startTime;
        let end = newEvent.endTime;
        let turno = newEvent.turno;

        this.addEvent(start, end, turno);
        this.eventSource.push(newEvent);
        this.myCalendar.loadEvents();

      }


    });
  }

  //A??adimos nuevo evento a la bbdd
  async addEvent(startTime, endTime, turno) {
    const event = {
      turno: turno,
      startTime: startTime,
      endTime: endTime,
      allDay: false
    };
    this.db.createNewEvent('usuarios', this.uidUser, event);

  }

  //Recogemos las vacaciones del usuario
  getHolidays(uid) {
    this.db.getHolidays('usuarios', uid).subscribe(colSnap => {
      colSnap.forEach(snap => {
        let event: any = snap.payload.doc.data();
        if (event.petition == 1) {
          event.id = snap.payload.doc.id;
          event.startTime = event.startTime.toDate();
          event.endTime = event.endTime.toDate();
          event.title = event.turno;
          event.allDay = true;
          event.allDayLabel = 'Turno';
          localStorage.setItem('holidays', JSON.stringify(event));
          this.eventSource.push(event)
          this.myCalendar.loadEvents();
        }
      })
    })
  }

}
