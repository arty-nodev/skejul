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

  calendar = {
    mode: 'month',
    currentDate: new Date(),

  };

  selectedDate = new Date();

  @ViewChild(CalendarComponent) myCalendar: CalendarComponent;
  database: any;
  data: any;
  private uid: string = '';

  constructor(private db: FirestoreService, private auth: AuthService, private modalCtrl: ModalController) {
    this.eventSource = [];
    this.auth.estadoUsuario().subscribe(res => {
      if (res) {
        this.db.getDoc<Usuario>('usuarios', res.uid).subscribe(res => {
          if (res) {
            this.uid = res.uid;
            this.loadEvents(this.uid)
          }
        })
      }
    })
  }

  ngOnInit() { }

  loadEvents(uid) {
    this.db.getEvents('usuarios', uid).subscribe(colSnap => {
      colSnap.forEach(snap => {
        let event: any = snap.payload.doc.data();
        event.id = snap.payload.doc.id;
        event.startTime = event.startTime.toDate();
        event.endTime = event.endTime.toDate();
        console.log(this.eventSource);

        this.eventSource.push(event)
        this.myCalendar.loadEvents();
      })
    })
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
    console.log('Selected time:' + ev.selectedTime + ', hasEvents: ' +
      (ev.events !== undefined && ev.events.length !== 0) + ', disabled: ' + ev.disabled);
    this.selectedDate = ev.selectedTime;

  }

  onEventSelected(event) {
    console.log('Event selected: ' + event.startTime + ' - ' + event.endTime + ', ' + event.title);

  }

  onCurrentDateChanged(event: Date) {
    console.log('Current date change: ' + event);

  }

  async openCalModal() {
    const modal = await this.modalCtrl.create({
      component: ModalComponent,
      cssClass: 'cal-modal',
      backdropDismiss: false
    })

    await modal.present();

    modal.onDidDismiss().then((result) => {
      if (result.data && result.data.event) {
        let event = result.data.event;
        let start = event.startTime;
        event.startTime = new Date(
          Date.UTC(
            start.getUTCFullYear(),
            start.getUTCMonth(),
            start.getUTCDate()
          )
        );

        event.endTime = new Date(
          Date.UTC(
            start.getUTCFullYear(),
            start.getUTCMonth(),
            start.getUTCDate()
          )
        );
        this.eventSource.push(result.data.event);
        this.myCalendar.loadEvents();
      }
    });
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
