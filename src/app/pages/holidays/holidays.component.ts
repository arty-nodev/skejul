import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FirestoreService } from 'src/app/services/firestore.service';
import { AuthService } from 'src/app/services/auth.service';
import { Usuario } from 'src/app/interfaces/usuario.interface';

@Component({
  selector: 'app-holidays',
  templateUrl: './holidays.component.html',
  styleUrls: ['./holidays.component.scss'],
})
export class HolidaysComponent implements OnInit {

  uidUser:string = '';
  rol:string = '';
  uid:string = '';
  holidays = {
    startTime: new Date().getDate() +' - '+ new Date().toLocaleString('es-ES', {month: 'long'}).toUpperCase(),
    endTime: new Date().getDate()+6 +' - '+ new Date().toLocaleString('es-ES', {month: 'long'}).toUpperCase(),
    allDay: false
  };

  difference: number;

  constructor(private db: FirestoreService, private route: ActivatedRoute, private auth: AuthService) {
    this.auth.estadoUsuario().subscribe(res => {
      if (res) {
        this.db.getDoc<Usuario>('usuarios', res.uid).subscribe(res => {
          console.log('res -->', res);
          if (res && res.cargo != 'Gerente') {
            this.rol = res.cargo;
            this.uid = res.uid;
          } else {
            this.rol = res.cargo;
            console.log(this.uidUser);
          }
        })
      }
    })
   }

  ngOnInit() {
    this.uidUser = this.route.snapshot.paramMap.get('uid');
    this.difference = this.getDifferenceOfDays(this.holidays.startTime, this.holidays.endTime);
  }

  getHolidays(uid){
    this.db.getEvents('usuarios', uid).subscribe(colSnap => {
      
      colSnap.forEach(snap => {
        let event: any = snap.payload.doc.data();
        event.id = snap.payload.doc.id;
        event.startTime = event.startTime.toDate();
        event.endTime = event.endTime.toDate();
      })
    })
  }

  getDifferenceOfDays(start, end) {
    const date1 = new Date(start);
    const date2 = new Date(end);

    // One day in milliseconds
    const oneDay = 1000 * 60 * 60 * 24;

    // Calculating the time difference between two dates
    const diffInTime = date2.getTime() - date1.getTime();

    // Calculating the no. of days between two dates
    const diffInDays = Math.round(diffInTime / oneDay);

    return diffInDays;
}

}
