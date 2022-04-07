import { HomeComponent } from './pages/home/home.component';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AjustesComponent } from './backend/ajustes/ajustes.component';
import { LoginComponent } from './pages/login/login.component';

const routes: Routes = [
  {
    path: 'home', component: HomeComponent
  },
  {
    path: 'ajustes', component: AjustesComponent
  },{
    path: 'login', component: LoginComponent
  },{
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
