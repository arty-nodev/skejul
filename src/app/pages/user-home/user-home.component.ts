import { Component, OnInit, ViewChild } from '@angular/core';
import { CalendarComponent } from 'ionic2-calendar';
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

  selectedDate: Date;

  @ViewChild(CalendarComponent) myCalendar: CalendarComponent;

  constructor(private db: FirestoreService) { 
    
  }

  ngOnInit() {}

  next(){
    this.myCalendar.slideNext();
  }
  back(){
    this.myCalendar.slidePrev();
  }

  onViewTittleChanged(tittle){
    this.viewTitle = tittle;
  }

  addEvent(){
    let start = new Date();
    let end = new Date();
    end.setMinutes(end.getMinutes() + 60);
    const event = {
      title: 'Trabajar' + start.getMinutes(),
      startTime: start,
      endTime: end,
      allDay: false
    }

    this.db.createNewEvent('usuarios', 'kLPTua94gaaqVa5CcTtXN4FWt2V2', event);

  }

}
