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

  calendar = {
    mode: 'month',
    currentDate: new Date(),

  };

  selectedDate = new Date();

  database: any;
  data: any;
  private uid: string = '';

  @ViewChild(CalendarComponent) myCalendar: CalendarComponent;
  constructor(private db: FirestoreService, private auth: AuthService, private modalCtrl: ModalController) {

    this.auth.estadoUsuario().subscribe(res => {
      if (res) {
        this.db.getDoc<Usuario>('usuarios', res.uid).subscribe(res => {
          if (res) {
            this.uid = res.uid;
            this.loadEvents(this.uid);
          }
        })
      }
    })



  }

  ngOnInit() { console.log(this.calendar); }

  loadEvents(uid) {
    this.db.getEvents('usuarios', uid).subscribe(colSnap => {
      this.eventSource = [];
      colSnap.forEach(snap => {
        let event: any = snap.payload.doc.data();
        event.id = snap.payload.doc.id;
        event.startTime = event.startTime.toDate();
        event.endTime = event.endTime.toDate();

        this.eventSource.push(event)
        this.myCalendar.loadEvents();
      })
    })
    console.log(this.eventSource);
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
        let day = newEvent.daySelected;


    
        
        console.log(newEvent);
     //   this.setTimeEvent(start, end, day, newEvent);




        this.eventSource.push(newEvent);
        console.log(this.eventSource);

        this.myCalendar.loadEvents();
      }
    });
  }

  setTimeEvent(start, end, day, newEvent) {

    let newStart = new Date(day).setHours(start);
    let newEnd = new Date(day).setHours(end);
    newEvent.startTime = newStart;
    newEvent.endTime = newEnd;
  }

  async addEvent() {
    let start = new Date();
    let end = new Date();
    end.setMinutes(end.getMinutes() + 60);

    const event = {
      title: 'Trabajar ' + start.getMinutes(),
      startTime: start,
      endTime: end,
      allDay: false
    };


    this.db.createNewEvent('usuarios', this.uid, event);



  }

}
