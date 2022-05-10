import { UserHomeComponent } from './pages/user-home/user-home.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { ExworkersComponent } from './pages/exworkers/exworkers.component';
import { LoginComponent } from './pages/login/login.component';
import { MenuComponent } from './components/menu/menu.component';
import { AdminHomeComponent } from './pages/admin-home/admin-home.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { CallNumber } from '@ionic-native/call-number/ngx'
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { AngularFireModule } from "@angular/fire/compat";
import { environment } from 'src/environments/environment';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { RegisterComponent } from './backend/register/register.component';
import { IonicStorageModule } from '@ionic/storage-angular';
import { EditComponent } from './backend/edit/edit.component';
import { AppComponent } from './app.component';

FullCalendarModule.registerPlugins([ 
  dayGridPlugin,
  interactionPlugin
]);

@NgModule({
  declarations: [AppComponent, RegisterComponent, MenuComponent, AdminHomeComponent, LoginComponent, EditComponent, ExworkersComponent, CalendarComponent, UserHomeComponent],
  entryComponents: [],
  imports: [BrowserModule,CommonModule, IonicModule.forRoot(), AppRoutingModule, AngularFireModule.initializeApp(environment.firebaseConfig), AngularFireAuthModule, AngularFirestoreModule,FormsModule, IonicStorageModule.forRoot(), FullCalendarModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, CallNumber, LoginComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
