import { LoginComponent } from './pages/login/login.component';
import { MenuComponent } from './components/menu/menu.component';
import { HomeComponent } from './pages/home/home.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CallNumber } from '@ionic-native/call-number/ngx'

import { AngularFireModule } from "@angular/fire/compat";
import { environment } from 'src/environments/environment';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AjustesComponent } from './backend/ajustes/ajustes.component';

@NgModule({
  declarations: [AppComponent, AjustesComponent, MenuComponent, HomeComponent, LoginComponent],
  entryComponents: [],
  imports: [BrowserModule,CommonModule, IonicModule.forRoot(), AppRoutingModule, AngularFireModule.initializeApp(environment.firebaseConfig), AngularFireAuthModule, AngularFirestoreModule,FormsModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, CallNumber],
  bootstrap: [AppComponent],
})
export class AppModule {}
