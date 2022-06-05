import { InfoModalComponent } from 'src/app/components/info-modal/info-modal.component';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { CheckHolidaysComponent } from './pages/check-holidays/check-holidays.component';
import { UserHomeComponent } from './pages/user-home/user-home.component';
import { ExworkersComponent } from './pages/exworkers/exworkers.component';
import { LoginComponent } from './pages/login/login.component';
import { MenuComponent } from './components/menu/menu.component';
import { AdminHomeComponent } from './pages/admin-home/admin-home.component';
import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppRoutingModule } from './app-routing.module';
import { CallNumber } from '@ionic-native/call-number/ngx'
import { NgCalendarModule } from 'ionic2-calendar';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
registerLocaleData(localeEs);
import { AngularFireModule } from "@angular/fire/compat";
import { environment } from 'src/environments/environment';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { RegisterComponent } from './backend/register/register.component';
import { EditComponent } from './backend/edit/edit.component';
import { AppComponent } from './app.component';
import { ModalComponent } from './components/modal/modal.component';
import { HolidayModalComponent } from './components/holiday-modal/holiday-modal.component';
import { HolidaysComponent } from './pages/holidays/holidays.component';
import { LottieModule } from 'ngx-lottie';
import  player  from 'lottie-web'


export function playerFactory(){
  return player;
}


@NgModule({
  declarations: [AppComponent, RegisterComponent, MenuComponent, AdminHomeComponent, LoginComponent, EditComponent, ExworkersComponent, UserHomeComponent, ModalComponent, HolidaysComponent, HolidayModalComponent, CheckHolidaysComponent, WelcomeComponent, InfoModalComponent],
  entryComponents: [],
  imports: [BrowserModule,CommonModule, IonicModule.forRoot(), AppRoutingModule, AngularFireModule.initializeApp(environment.firebaseConfig), AngularFireAuthModule, AngularFirestoreModule,FormsModule,  NgCalendarModule, LottieModule.forRoot({player:playerFactory})],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, CallNumber, LoginComponent, {provide: LOCALE_ID, useValue: 'es-ES'}, HolidaysComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
