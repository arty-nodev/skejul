import { Component, OnInit } from '@angular/core';
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi, formatDate  } from '@fullcalendar/angular';
import esLocale from '@fullcalendar/core/locales/es'

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnInit {

  constructor() { }

  ngOnInit() {}

  calendarOptions: CalendarOptions = {
    
    initialView: 'dayGridMonth',
    locale: esLocale,
    eventColor: 'blue',
    titleFormat: {
      weekday: 'long'
    },
    timeZone: 'UTC',
    events:[{
      title: 'Trabajar', date:'2022-05-14'
    }]
  };

  cale


  

}
