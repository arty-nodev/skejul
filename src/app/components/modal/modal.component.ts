import { ModalController } from '@ionic/angular';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { format, parse, parseISO } from 'date-fns';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements AfterViewInit {
  
  viewTitle: string;

  calendar = {
    mode: 'month',
    currentDate: new Date(),

  };

  timepicker = null;

  event = {
    title: 'Trabajar',
    startTime: null,
    endTime: null,
    allDay: false
  };

  modalReady = false;


  constructor(private modalCtrl: ModalController) { }


  ngAfterViewInit(){
    setTimeout(() => {
      this.modalReady = true;
    }, 0);
  }

  save(){
   
   
    console.log(this.event);
    
    this.modalCtrl.dismiss({event: this.event})
  
    
  }

  onViewTitleChanged(title){
    this.viewTitle = title;
  }

  onTimeSelected(ev){
    this.event.startTime = new Date(ev.selectedTime);
  }

  close(){
    this.modalCtrl.dismiss();
  }

  dateChanged(date){
    console.log(date);
    let newDate = format(parseISO(date), 'HH:mm');
    
    this.event.startTime = newDate;
  /*   
    this.event.endTime = newDate + 60;
    console.log(newDate); */
    
  }

}
