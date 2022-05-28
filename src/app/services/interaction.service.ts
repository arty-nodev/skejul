import { FirestoreService } from 'src/app/services/firestore.service';
import { Injectable } from '@angular/core';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { Usuario } from '../interfaces/usuario.interface';

@Injectable({
  providedIn: 'root'
})
export class InteractionService {

  loading: any;
  alert: any;

  constructor(public toastController: ToastController, public loadingController: LoadingController, public alertController: AlertController, private database: FirestoreService) { }

  //Generamos un toast pasándo un mensaje
  async presentToast(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 1500
    });
    toast.present();
  }

  //Generamoms el loading con mensaje
  async presentLoading(mensaje: string) {
    this.loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: mensaje,
      duration: 2000
    })
    await this.loading.present();

  }

  //Cerramos el loading
  async closeLoading() {
    await this.loading.dismiss();
  }

  async presentAlertConfirm(index) {
    this.alert = await this.alertController.create({
      header: 'Dar de baja un usuario',
      message: 'El usuario será deshabilitado.<br/><strong>¿Desea continuar?</strong>',
      buttons: [
        {
          text: 'Cancelar',
          role: 'Cancel',
          id: 'cancel-button',
          handler: () => {
            console.log('Cancelado');
          }
        }, {
          text: 'Si, continuar',
          id: 'confirm-button',
          handler: () => {
            console.log(index);
            this.database.disableUser<Usuario>('usuarios', index.uid, false).then(res => {
              if (res) {
                console.log(res);
                this.presentToast('Usuario deshabilitado con éxito');
              } else {
                this.presentToast('Algo salió mal');
              }
            })
          }
        }
      ]
    });

    await this.alert.present();

  }

  async presentAlertHabilitar(index) {
    this.alert = await this.alertController.create({
      header: 'Dar de alta un usuario',
      message: 'El usuario será habilitado de nuevo.<br/><strong>¿Desea continuar?</strong>',
      buttons: [
        {
          text: 'Cancelar',
          role: 'Cancel',
          id: 'cancel-button',
          handler: () => {
            console.log('Cancelado');
          }
        }, {
          text: 'Si, continuar',
          id: 'confirm-button',
          handler: () => {
            console.log(index);
            this.database.disableUser<Usuario>('usuarios', index.uid, true).then(res => {
              if (res) {
                console.log(res);
                this.presentToast('Usuario habilitado con éxito');
              } else {
                this.presentToast('Algo salió mal');
              }
            })
          }
        }
      ]
    });

    await this.alert.present();

  }

  async presentHolidaysConfirm(path, uid, data) {
    this.alert = await this.alertController.create({
      header: 'Solicitar vacaciones',
      message: `Tus vacaciones serán del ${data.startTime.getDate()} al ${data.endTime.getDate()} de ${data.endTime.toLocaleString('es-ES', { month: 'long' })}.<br/><strong>¿Desea continuar?</strong>`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'Cancel',
          id: 'cancel-button',
          handler: () => {
            console.log('Cancelado');
          }
        }, {
          text: 'Si, continuar',
          id: 'confirm-button',
          handler: () => {
            console.log(path, uid, data);
            this.database.askForHolidays(path, uid, data);

          }
        }
      ]
    });


    await this.alert.present();
 


  }

  async presentSolicitHolidays(path:string, uid:string, data:any, value:any) {
    let opt;
    let deleted;

    if (value == 1) {
      opt = 'Aceptar'
    } else {
      opt = 'Denegar'
    }
    return new Promise(async(resolve) => {
      this.alert = await this.alertController.create({
        header: `${opt} vacaciones`,
        message: `¿${opt} las vacaciones de <strong>${data.nombre}</strong>?`,
        buttons: [
          {
            text: 'Cancelar',
            role: 'Cancel',
            id: 'cancel-button',
            handler: () => {
              this.alert.dismiss();
              console.log('Cancelado');
              return false;
            }
          }, {
            text: 'Si, continuar',
            id: 'confirm-button',
            handler: () => {
             
             if (value == 1) {
               
               this.database.editHolidays<Usuario>(path, uid, value);
             } else {
               this.database.deleteHoliday<Usuario>(path, uid, value).then(res => {
                 if(res) return resolve(true);
               });
             }
            }
          }
        ]
      });
      await this.alert.present();
    })

   
  

  }
}
