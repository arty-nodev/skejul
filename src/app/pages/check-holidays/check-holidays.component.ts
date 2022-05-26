import { AuthService } from 'src/app/services/auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { Component, AfterViewInit } from '@angular/core';
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
  vacaciones: string;
  isAvailable:string;

  constructor(private database: FirestoreService, private interaction: InteractionService, private auth: AuthService) {
    this.allHolidays = [];
    this.index = 0;
    this.vacaciones = 'Habilitar vacaciones'
  }
  ngAfterViewInit() {
    this.getUsuarios();
  }

  setHolidays(event){
    console.log(event.detail.checked);
    if(event.detail.checked){
     
      this.vacaciones = 'Deshabilitar vacaciones'
      this.database.enableHolidays(event.detail.checked);
    } else {
      this.vacaciones = 'Habilitar vacaciones'
     
      this.database.enableHolidays(event.detail.checked);
    }
    

 
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
          

          if (event.petition == 0) {
     
            
            event.id = snap.payload.doc.id;
            event.startTime = event.startTime.toDate();
            event.endTime = event.endTime.toDate();

            if (event.startTime.getTime() > new Date().getTime()) {
              this.difference = this.getDifferenceOfDays(new Date(), event.startTime);
              this.allHolidays.push(event);
              console.log(this.allHolidays);
              
            }

          } else if (event.petition == 1 && this.index > -1) {
        
         
            
              this.usuarios.splice(this.index, 1);
            
            
          
          console.log(this.usuarios);
          
           
           
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
