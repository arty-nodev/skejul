import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FirestoreService } from 'src/app/services/firestore.service';
import { AuthService } from 'src/app/services/auth.service';
import { Usuario } from 'src/app/interfaces/usuario.interface';
import { ModalController } from '@ionic/angular';
import { HolidayModalComponent } from 'src/app/components/holiday-modal/holiday-modal.component';
import { CalendarComponent } from 'ionic2-calendar';
import { AnimationOptions } from 'ngx-lottie';


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
    startTime: '',
    endTime: '',
    allDay: false
  };

  difference: number;
  asked: boolean;
  titleHoliday: string;

  options: AnimationOptions = {
    path: ''
  }

  @ViewChild(CalendarComponent) myCalendar: CalendarComponent;
  constructor(private db: FirestoreService, private route: ActivatedRoute, private auth: AuthService, private router: Router, private modalCtrl: ModalController) {

    this.getEstado();
    this.available = false;
    this.difference = 0;
    this.asked = false;


  }

  ngOnInit() {
    this.uidUser = this.route.snapshot.paramMap.get('uid');
    this.db.checkHolidays().subscribe(value => {
      this.available = value['isAvailable'];


    })



  }

  getEstado() {
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

  getHolidays(uid) {
    this.eventSource = []
    this.db.getHolidays('usuarios', uid).subscribe(colSnap => {
      console.log(colSnap.length);

      if (colSnap.length != 0) {

        colSnap.forEach(snap => {
          let event: any = snap.payload.doc.data();

          console.log(event.petition);

          if (event.petition == 1) {
            event.id = snap.payload.doc.id;
            event.startTime = event.startTime.toDate();
            event.endTime = event.endTime.toDate();
            console.log(event);
            if (event.startTime.getTime() > new Date().getTime()) {
              this.difference = this.getDifferenceOfDays(new Date(), event.startTime);
              this.holidays.startTime = event.startTime.getDate() + ' - ' + event.startTime.toLocaleString('es-ES', { month: 'long' }).toUpperCase();
              this.holidays.endTime = event.endTime.getDate() + ' - ' + event.endTime.toLocaleString('es-ES', { month: 'long' }).toUpperCase();
              this.options = {
                ...this.options,
                path: 'assets/yes.json'
              }
            }
          } else {
            this.options = {
              ...this.options,
              path: 'assets/wait.json'
            }
            this.titleHoliday = 'Tus vacaciones están pendientes de revisar'
            this.asked = true;
          }


        })
      } else {
        this.options = {
          ...this.options,
          path: 'assets/ask.json'
        }
        this.titleHoliday = 'Aún no has elegido tus vacaciones o han sido rechazadas'
        this.difference = 0;
        this.asked = false;
      }

    })

    console.log(this.difference);
    console.log(this.asked);





  }

  getDifferenceOfDays(start, end) {

    const date1 = new Date(start);
    const date2 = new Date(end);

    const diffTime = Math.abs(date2.getTime() - date1.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));



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
        let turno = newEvent.turno;
        console.log(turno);


        console.log(newEvent);

      }
    });
  }


}
