import { ModalController } from '@ionic/angular';
import { AfterViewInit, Component, OnInit } from '@angular/core';

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

  event = {
    title: '',
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

}
