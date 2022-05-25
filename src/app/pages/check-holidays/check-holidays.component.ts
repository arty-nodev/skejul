import { FirestoreService } from 'src/app/services/firestore.service';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Usuario } from 'src/app/interfaces/usuario.interface';
import { InteractionService } from 'src/app/services/interaction.service';

@Component({
  selector: 'app-check-holidays',
  templateUrl: './check-holidays.component.html',
  styleUrls: ['./check-holidays.component.scss'],
})
export class CheckHolidaysComponent implements AfterViewInit {

  usuarios: Usuario[];
  difference: number;
  allHolidays: any[];
  index: number;

  constructor(private database: FirestoreService, private interaction: InteractionService) {
    this.allHolidays = [];
    this.index = 0;
  }
  ngAfterViewInit() {
    this.getUsuarios();
  }

  getUsuarios() {
    this.database.getCollection<Usuario>('usuarios').subscribe((res) => {
      this.usuarios = res;
      this.getHolidays(res)
    });
  }

  getHolidays(data) {
    this.allHolidays = [];
    
    data.forEach(element => {

      
      
      this.database.getHolidays('usuarios', element.uid).subscribe(colSnap => {
        this.index = data.indexOf(element);
    
        console.log(this.index);
        console.log(element);
        colSnap.forEach(snap => {

          let event: any = snap.payload.doc.data();
          

          if (!event.petition) {
     
            
            event.id = snap.payload.doc.id;
            event.startTime = event.startTime.toDate();
            event.endTime = event.endTime.toDate();

            if (event.startTime.getTime() > new Date().getTime()) {
              this.difference = this.getDifferenceOfDays(new Date(), event.startTime);
              this.allHolidays.push(event);
        

            }

          } else if (event.petition) {
          this.usuarios.splice(this.index, 1)
           
           
          }

        })

      })


    });

  }

  deny(data) {

  }
  accept(data) {
    console.log(this.usuarios[data]);
    this.interaction.presentAcceptHolidays('usuarios', this.usuarios[data].uid, this.usuarios[data]);
   


        
    



  }

  getDifferenceOfDays(start, end) {

    const date1 = new Date(start);
    const date2 = new Date(end);

    const diffTime = Math.abs(date2.getTime() - date1.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  }


}
