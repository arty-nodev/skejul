import { InteractionService } from 'src/app/services/interaction.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { format, parse, parseISO } from 'date-fns';
import { CalendarComponent } from 'ionic2-calendar';
import { AuthService } from 'src/app/services/auth.service';
import { Usuario } from 'src/app/interfaces/usuario.interface';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements AfterViewInit {


  viewTitle: string;
  firstTime: number;
  monthTitle: string;
  modalReady = false;
  dateSelected = new Date();
  dateContainer = new Date();
  selected: boolean;
  turno: string = '';
  uid: string;
  uidUser: string;
  eventSource: any[];
  info: any;
  user: any;
  startHoliday: Date;
  endHoliday: Date;
  holiday: string;
  newHoliday: any;


  calendar = {
    mode: 'month',
    currentDate: new Date(),
  };


  event = {
    startTime: new Date(),
    endTime: new Date(),
    turno: this.turno
  };

  markDisabled = (date: Date) => {

    if (localStorage.getItem('holidays') != null) {

      this.holiday = localStorage.getItem('holidays')
      this.newHoliday = JSON.parse(this.holiday);

      return date <= new Date(this.newHoliday.endTime) && date >= new Date(this.newHoliday.startTime);
    }
  }


  turnos = ['Apertura', 'Medio turno', 'Turno par(1)', 'Turno par(2)', 'Turno de tarde', 'Turno de apoyo', 'Cierre de basuras', 'Cierre de panes', 'Cierre de terraza', 'Cierre de frente', 'Cierre de salón', 'Cierre de baños', 'Cierre de cocina', 'Friegue']


  @ViewChild(CalendarComponent) myCalendar: CalendarComponent;
  constructor(private modalCtrl: ModalController, private auth: AuthService, private db: FirestoreService, private router: Router) {
    this.viewTitle = 'Hora de entrada';
    this.firstTime = 0;
    this.selected = false;
    //Recogemos la información del usuario
    this.auth.estadoUsuario().subscribe(res => {
      if (res) {
        this.db.getDoc<Usuario>('usuarios', res.uid).subscribe(res => {
          if (res && res.cargo != 'Gerente') {

            this.uid = res.uid;
            this.loadEvents(this.uid);
          } else {

           
            this.loadEvents(this.uidUser);
          }
        })
      }
    })

  }

  ngAfterViewInit() {
    //Cargamos información necesaria una vez el componente esté cargado
    setTimeout(() => {
      this.modalReady = true;
      this.selected = true;
      this.info = localStorage.getItem('user');
      this.user = JSON.parse(this.info)
      this.uidUser = this.user.uid;

    }, 0);
  }

  //Función para el registro de un nuevo turno para el usuario
  save() {

    if (this.firstTime == 0) {
      this.firstTime++;
      this.viewTitle = 'Hora de salida';
      this.event.turno = this.turno;

    } else if (this.firstTime == 1) {
      this.event.turno = this.turno;
      this.firstTime = 0;
      this.viewTitle = 'Hora de entrada';
      this.modalCtrl.dismiss({ event: this.event })
      let currentUrl = this.router.url;
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
      this.router.onSameUrlNavigation = 'reload';
      this.router.navigate([currentUrl]);
    }

  }

  //Se selecciona el día de inicio del turno
  onTimeSelected(ev) {

    this.dateSelected = ev.selectedTime;
    this.event.startTime = ev.selectedTime;

  }

  //Función para cerrar el componente
  close() {
    this.modalCtrl.dismiss();
  }


  //Función para asignar a que hora entra y sale el usuario de su turno
  dateChanged(date) {

    const newDate = new Date(date)
    newDate.setDate(this.event.startTime.getDate())
    newDate.setMonth(this.event.startTime.getMonth())
    newDate.setFullYear(this.event.startTime.getFullYear())

    if (this.firstTime == 0) {
      this.event.startTime.setTime(newDate.getTime())
      this.dateContainer = this.event.startTime;
     
    } else {
     
      this.event.endTime.setTime(newDate.getTime())
      this.event.startTime = this.dateContainer;
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
    this.monthTitle = tittle.toUpperCase();
  }



  //Se cargan todos los horarios del usuario
  loadEvents(uid) {
    this.eventSource = [];
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
    this.getHolidays(uid);

  }

  //Se cargan las vaciones del usuario
  getHolidays(uid) {

    this.db.getHolidays('usuarios', uid).subscribe(colSnap => {
      colSnap.forEach(snap => {
        
        let event: any = snap.payload.doc.data();

        if (event.petition == 1) {
          event.id = snap.payload.doc.id;
          event.startTime = event.startTime.toDate();
          this.startHoliday = event.startTime;
          event.endTime = event.endTime.toDate();
          this.endHoliday = event.endTime;
          event.title = event.turno;
          event.allDay = true;
          event.allDayLabel = 'Turno';
         
          this.eventSource.push(event)
          this.myCalendar.loadEvents();
        }
      })
    })
  }


}
