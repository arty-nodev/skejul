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


  calendar = {
    mode: 'month',
    currentDate: new Date()

  };


  @ViewChild(CalendarComponent) myCalendar: CalendarComponent;
  constructor(private db: FirestoreService, private auth: AuthService, private modalCtrl: ModalController, private route: ActivatedRoute, private router: Router, private interaction: InteractionService) { 
    this.auth.estadoUsuario().subscribe(res => {
      if (res) {
        this.db.getDoc<Usuario>('usuarios', res.uid).subscribe(res => {
          console.log('res -->', res);
          
          if (res && res.cargo != 'Gerente') {
            this.rol = res.cargo;
            this.uid = res.uid;
            this.loadEvents(this.uid);
          }else {
            this.rol = res.cargo;
            console.log(this.uidUser);
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

  loadEvents(uid) {
 
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

  next() {
    this.myCalendar.slideNext();
  }
  back() {
    this.myCalendar.slidePrev();
  }

  onViewTitleChanged(tittle) {
    this.viewTitle = tittle;
  }

  onTimeSelected(ev) {
    /*   console.log('Selected time:' + ev.selectedTime + ', hasEvents: ' +
        (ev.events !== undefined && ev.events.length !== 0) + ', disabled: ' + ev.disabled);
      this.selectedDate = ev.selectedTime; */

  }

  onEventSelected(event) {
    if (this.rol == 'Gerente') {
      console.log(event);
      
      this.interaction.presentDeleteHorario(event, this.uidUser);
    }
    console.log('Event selected: ' + event.startTime + ' - ' + event.endTime + ', ' + event.title);

  }

  onCurrentDateChanged(event: Date) {
    //console.log('Current date change: ' + event);

  }

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
        console.log(turno);
        

        console.log(newEvent);

        this.addEvent(start, end, turno);
        this.eventSource.push(newEvent);
        this.myCalendar.loadEvents();
      }
    });
  }

  async addEvent(startTime, endTime, turno) {

    const event = {
      turno: turno,
      startTime: startTime,
      endTime: endTime,
      allDay: false
    };

    this.db.createNewEvent('usuarios', this.uidUser, event);

  }

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
