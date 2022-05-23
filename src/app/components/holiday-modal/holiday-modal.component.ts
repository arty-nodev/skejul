import { InteractionService } from 'src/app/services/interaction.service';
import { ModalController } from '@ionic/angular';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CalendarComponent } from 'ionic2-calendar';

@Component({
  selector: 'app-holiday-modal',
  templateUrl: './holiday-modal.component.html',
  styleUrls: ['./holiday-modal.component.scss'],
})
export class HolidayModalComponent implements OnInit {

  viewTitle:string;
  firstTime:number;
  click:string;
  calendar = {
    mode: 'month',
    currentDate: new Date(),

  };
  event = {
    startTime: new Date(),
    endTime: new Date(),
  };

  @ViewChild(CalendarComponent) myCalendar: CalendarComponent;
  constructor(private modalCtrl: ModalController, private interaction: InteractionService) {
    this.firstTime = 0;
    this.click = 'Prímer día de vacaciones'
   }
  

  ngOnInit() {

  }

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
    this.viewTitle = tittle;
  }

  solicitHoliday() {

    if (this.firstTime == 0) {
      this.firstTime++;
      this.click = 'Último día de vacaciones'

     
    } else if (this.firstTime == 1) {
     // this.modalCtrl.dismiss({ event: this.event })
      this.firstTime++;
      this.click = 'Confirmar'
    }

    else {this.interaction.presentHolidaysConfirm(this.event);}

    console.table(this.event);
  }

  onTimeSelected(ev) {

   if (this.firstTime == 0) {
     
     this.event.startTime = ev.selectedTime;
   } else if (this.firstTime == 1) {
     this.event.endTime = ev.selectedTime;
   }
    
    console.table(this.event)

  }

}
