import { CheckHolidaysComponent } from './pages/check-holidays/check-holidays.component';
import { HolidaysComponent } from './pages/holidays/holidays.component';
import { ExworkersComponent } from './pages/exworkers/exworkers.component';
import { EditComponent } from './backend/edit/edit.component';
import { AdminHomeComponent } from './pages/admin-home/admin-home.component';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './backend/register/register.component';
import { LoginComponent } from './pages/login/login.component';
import { UserHomeComponent } from './pages/user-home/user-home.component';
import { WelcomeComponent } from './pages/welcome/welcome.component';

const routes: Routes = [
  {
    path: 'ahome', component: AdminHomeComponent
  },
  {
    path: 'uhome/:uid', component: UserHomeComponent
  },
  {
    path: 'welcome', component: WelcomeComponent
  },
  {
    path: 'register', component: RegisterComponent
  },{
    path: 'login', component: LoginComponent
  },
  {
    path: 'edit', component: EditComponent
  },
  {
    path: 'exworkers', component: ExworkersComponent
  },
  {
    path: 'holidays/:uid', component: HolidaysComponent
  },{
    path: 'checkHolidays', component: CheckHolidaysComponent
  },{
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
