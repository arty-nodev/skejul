import { ActivatedRoute } from '@angular/router';
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
  turno:string = '';
  uid:string;
  uidUser:string;
  eventSource:any [];
  info:any;
  user:any;
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
    let current = new Date();
    this.holiday = localStorage.getItem('holidays')
    this.newHoliday = JSON.parse(this.holiday);  
    
    
    return date <= new Date(this.newHoliday.endTime) && date >= new Date(this.newHoliday.startTime);
  }


  turnos = ['Apertura', 'Medio turno', 'Turno par(1)','Turno par(2)', 'Turno de tarde', 'Turno de apoyo', 'Cierre de basuras', 'Cierre de panes', 'Cierre de terraza', 'Cierre de frente', 'Cierre de salón', 'Cierre de baños', 'Cierre de cocina', 'Friegue']

 
  @ViewChild(CalendarComponent) myCalendar: CalendarComponent;
  constructor(private modalCtrl: ModalController, private auth: AuthService, private db: FirestoreService) {
    this.viewTitle = 'Hora de entrada';
    this.firstTime = 0;
    this.selected = false;
    this.auth.estadoUsuario().subscribe(res => {
      if (res) {
        this.db.getDoc<Usuario>('usuarios', res.uid).subscribe(res => {
          console.log('res -->', res);
          
          if (res && res.cargo != 'Gerente') {
            
            this.uid = res.uid;
            this.loadEvents(this.uid);
          }else {
          
            console.log(this.uidUser);
            this.loadEvents(this.uidUser);
          }
        })
      } 
    })
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.modalReady = true;
      this.selected = true;
      this.info = localStorage.getItem('user'); 
      this.user = JSON.parse(this.info)
      this.uidUser = this.user.uid;

    }, 0);
  }

  save() {

    if (this.firstTime == 0) {
      this.firstTime++;
      this.viewTitle = 'Hora de salida';
      this.event.turno = this.turno;
     
    } else if (this.firstTime == 1) {
      this.event.turno = this.turno;
      this.modalCtrl.dismiss({ event: this.event })
      this.firstTime = 0;
      this.viewTitle = 'Hora de entrada';
    }

    console.table(this.event);
  }

  onTimeSelected(ev) {

    this.dateSelected = ev.selectedTime;
    this.event.startTime = ev.selectedTime;

  }

  close() {
    this.modalCtrl.dismiss();
  }

  dateChanged(date) {
    
    const newDate = new Date(date)
    
     
    newDate.setDate(this.event.startTime.getDate())
    newDate.setMonth(this.event.startTime.getMonth())
    newDate.setFullYear(this.event.startTime.getFullYear())

    console.log('newDate date',newDate);

    
    if (this.firstTime == 0) {
      this.event.startTime.setTime(newDate.getTime())
      this.dateContainer = this.event.startTime;
      console.log(this.dateContainer);
      
    } else {
      console.log('until endTime',this.dateContainer);
      
     this.event.endTime.setTime(newDate.getTime())
      this.event.startTime = this.dateContainer;
    }

  }

  next() {
    this.myCalendar.slideNext();
  }
  back() {
    this.myCalendar.slidePrev();
  }


  onViewTitleChanged(tittle) {
    this.monthTitle = tittle;
  }

  onEventSelected(event) {
    console.log('Event selected: ' + event.startTime + ' - ' + event.endTime + ', ' + event.title);

  }

  onCurrentDateChanged(event: Date) {

    console.log('Current date change: ' + event);


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
  getHolidays(uid) {
    this.eventSource = [];
    this.db.getHolidays('usuarios', uid).subscribe(colSnap => {
      colSnap.forEach(snap => {
        console.log(snap);
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
          console.log(event);
          this.eventSource.push(event)
          this.myCalendar.loadEvents();
        }
      })
    })
  }


}
