import { FirestoreService } from './../../services/firestore.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(private firestore: FirestoreService) {}

  getUsuarios(){
    this.firestore.getCollection();
  }
}
