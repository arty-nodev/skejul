import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FirestoreService } from 'src/app/services/firestore.service';
import { AuthService } from 'src/app/services/auth.service';
import { Usuario } from 'src/app/interfaces/usuario.interface';
import { ModalController } from '@ionic/angular';
import { HolidayModalComponent } from 'src/app/components/holiday-modal/holiday-modal.component';
import { CalendarComponent } from 'ionic2-calendar';


@Component({
  selector: 'app-holidays',
  templateUrl: './holidays.component.html',
  styleUrls: ['./holidays.component.scss'],
})
export class HolidaysComponent implements OnInit {

  uidUser: string = '';
  rol: string = '';
  uid: string = '';
  eventSource = [];
  available: boolean;
  holidays = {
    startTime: new Date().getDate() + ' - ' + new Date().toLocaleString('es-ES', { month: 'long' }).toUpperCase(),
    endTime: new Date().getDate() + 6 + ' - ' + new Date().toLocaleString('es-ES', { month: 'long' }).toUpperCase(),
    allDay: false
  };

  difference: number;

  @ViewChild(CalendarComponent) myCalendar: CalendarComponent;
  constructor(private db: FirestoreService, private route: ActivatedRoute, private auth: AuthService, private router: Router, private modalCtrl: ModalController) {
    
    this.getEstado();
    this.available = false;
    this.difference = 0;
 
  }

  ngOnInit() {
    this.uidUser = this.route.snapshot.paramMap.get('uid');
    
  }

  getEstado(){
    this.auth.estadoUsuario().subscribe(res => {
      if (res) {
        this.db.getDoc<Usuario>('usuarios', res.uid).subscribe(res => {
          console.log('res -->', res);
         
          if (res && res.cargo != 'Gerente') {
            this.rol = res.cargo;
            this.uid = res.uid;
            this.getHolidays(this.uid)
          } else {
            this.rol = res.cargo;
            console.log(this.uidUser);
            this.getHolidays(this.uidUser)
          }
        })
      } else {
        this.router.navigate(['login'])
        this.auth.loginUser = false;

      }
    })
  }

  
  doRefresh(event){
   setTimeout(() => {
    this.db.checkHolidays().subscribe(value => {
  
      this.available = value['isAvailable'];
      event.target.complete();
   
     
       
    })
   
    
   }, 2000);
    
  }

  getHolidays(uid) {
   
    this.db.getHolidays('usuarios', uid).subscribe(colSnap => {
      colSnap.forEach(snap => {
        let event: any = snap.payload.doc.data();

        if (event.petition) {
          event.id = snap.payload.doc.id;
          event.startTime = event.startTime.toDate();
          event.endTime = event.endTime.toDate();
          console.log(event);
          if (event.startTime.getTime() > new Date().getTime()) {
            this.difference = this.getDifferenceOfDays(new Date(), event.startTime);
            this.holidays.startTime = event.startTime.getDate() + ' - ' + event.startTime.toLocaleString('es-ES', { month: 'long' }).toUpperCase();
            this.holidays.endTime = event.endTime.getDate() + ' - ' + event.endTime.toLocaleString('es-ES', { month: 'long' }).toUpperCase();
          } else {
            this.difference = 0;
          }
        }

      })
    })

    console.log(this.difference);
    

  }

  getDifferenceOfDays(start, end) {

    const date1 = new Date(start);
    const date2 = new Date(end);

    const diffTime = Math.abs(date2.getTime() - date1.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    console.log(diffDays);


    return diffDays;
  }

  async solicitar() {

    const modal = await this.modalCtrl.create({
      component: HolidayModalComponent,
      cssClass: 'cal-modal',
      componentProps: {
        uid: this.uidUser
      },
      backdropDismiss: false
    })

    modal.present();

    modal.onDidDismiss().then((result) => {

      if (result.data && result.data.event) {


        let newEvent = result.data.event;
        let start = newEvent.startTime;
        let end = newEvent.endTime;
        let turno = newEvent.turno;
        console.log(turno);


        console.log(newEvent);

      }
    });
  }


}
