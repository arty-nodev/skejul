import { ModalController } from '@ionic/angular';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { format, parse, parseISO } from 'date-fns';
import { CalendarComponent } from 'ionic2-calendar';

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
  turno:string = '';
  calendar = {
    mode: 'month',
    currentDate: new Date(),

  };


  event = {
    startTime: new Date(),
    endTime: new Date(),
    turno: this.turno
  };

  turnos = ['Apertura', 'Medio turno', 'Turno par(1)','Turno par(2)', 'Turno de tarde', 'Turno de apoyo', 'Cierre de basuras', 'Cierre de panes', 'Cierre de terraza', 'Cierre de frente', 'Cierre de salón', 'Cierre de baños', 'Cierre de cocina', 'Friegue']



  @ViewChild(CalendarComponent) myCalendar: CalendarComponent;
  constructor(private modalCtrl: ModalController) {
    this.viewTitle = 'Hora de entrada';
    this.firstTime = 0;
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.modalReady = true;


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
    
    console.table(this.event)

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

}
