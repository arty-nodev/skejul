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
 
  constructor(private database: FirestoreService, private interaction: InteractionService) {
    this.allHolidays = [];
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

    data.forEach(element => {
      
      this.database.getHolidays('usuarios', element.uid).subscribe(colSnap => {
        colSnap.forEach(snap => {
          console.log(element.uid);
          let event: any = snap.payload.doc.data();
      
          if (!event.petition) {
            event.id = snap.payload.doc.id;
            event.startTime = event.startTime.toDate();
            event.endTime = event.endTime.toDate();
            
            if (event.startTime.getTime() > new Date().getTime()) {
              this.difference = this.getDifferenceOfDays(new Date(), event.startTime);
              this.allHolidays.push(event);
            }

            
            
    
          
          }
         
          
        
        })
       
      })
  
      
    });   
    
  }

  
  getDifferenceOfDays(start, end) {

    const date1 = new Date(start);
    const date2 = new Date(end);

    const diffTime = Math.abs(date2.getTime() - date1.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  }


}
