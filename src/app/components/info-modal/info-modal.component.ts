import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-info-modal',
  templateUrl: './info-modal.component.html',
  styleUrls: ['./info-modal.component.scss'],
})
export class InfoModalComponent implements OnInit {

  info: any;
  user: any;

  constructor(private modalCtrl: ModalController, private callNumber: CallNumber, private router: Router) {
    this.info = localStorage.getItem('user');
    this.user = JSON.parse(this.info)
  }

  ngOnInit() { }

  close() {
    this.modalCtrl.dismiss();
  }

  async callUser(data) {

    this.modalCtrl.dismiss();
    await this.callNumber.callNumber(data, true)
      .then(res => console.log('Launched dialer!', res))
      .catch(err => console.log('Error launching dialer', err));

  }


  userCalendar() {
    this.modalCtrl.dismiss();
    this.router.navigate(['uhome/' + this.user.uid])

  }

}
