import { HomeComponent } from './components/home/home.component';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AjustesComponent } from './backend/ajustes/ajustes.component';

const routes: Routes = [
  {
    path: 'home', component: HomeComponent
  },
  {
    path: 'ajustes', component: AjustesComponent
  },{
    path: '',
    redirectTo: 'home',
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
