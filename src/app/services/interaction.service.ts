import { Injectable } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class InteractionService {

  loading: any;

  constructor(public toastController: ToastController, public loadingController: LoadingController) { }

  //Generamos un toast pasándo un mensaje
  async presentToast(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 1500
    });
    toast.present();
  }

  //Generamoms el loading con mensaje
  async presentLoading(mensaje: string){
    this.loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: mensaje,
      duration: 2000
    })
    await this.loading.present();

  }

  //Cerramos el loading
  async closeLoading(){
    
    await this.loading.dismiss();
    
  }
}
