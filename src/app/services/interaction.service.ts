import { FirestoreService } from 'src/app/services/firestore.service';
import { Injectable } from '@angular/core';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { Usuario } from '../interfaces/usuario.interface';
import { AuthService } from 'src/app/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class InteractionService {

  loading: any;
  alert: any;

  constructor(public toastController: ToastController, public loadingController: LoadingController, public alertController: AlertController, private database: FirestoreService, private auth: AuthService) { }

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



  async presentReset(data) {
    this.alert = await this.alertController.create({
      header: 'Cambio de contraseña',
      message: 'Su contraseña es la misma que le administró el sistema. Por su seguridad, recomendamos que la cambie ahora.',
      buttons: [{
        text: 'Cancelar',
        role: 'Cancel',
        id: 'cancel-button',
        handler: () => {
          console.log('Cancelado');
        }
      },
      {
        text: 'Enviar correo',
        id: 'confirm-button',
        handler: () => {
          console.log(data);
          this.auth.updatePassword(data);
        }
      }
      ]
    });

    await this.alert.present();

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


  async presentDeleteHorario(event, id) {
    this.alert = await this.alertController.create({
      header: 'Eliminar turno',
      message: 'El turno será eliminado.<br/><strong>¿Desea continuar?</strong>',
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

            this.database.deleteEvent('usuarios', id, event.id).then(res => {
              if (res) {
                console.log(res);
                this.presentToast('Turno eliminado con éxito');
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

  async presentHolidaysConfirm(path, uid, event, id) {
    console.log(id);
    return new Promise(async (resolve) => {
      this.alert = await this.alertController.create({
        header: 'Solicitar vacaciones',
        message: `Tus vacaciones serán del ${event.startTime.getDate()} al ${event.endTime.getDate()} de ${event.endTime.toLocaleString('es-ES', { month: 'long' })}.<br/><strong>¿Desea continuar?</strong>`,
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

              this.database.deleteHoliday<Usuario>(path, uid, id);
              this.database.askForHolidays<Usuario>(path, uid, event).then(res => {
                if (res) return resolve(true);
              })




            }
          }
        ]
      });


      await this.alert.present();

    })

  }

  async presentSolicitHolidays(path: string, uid: string, data: any, value: any) {
    let opt;

    if (value == 1) {
      opt = 'Aceptar'
    } else {
      opt = 'Denegar'
    }
    return new Promise(async (resolve) => {
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
                this.database.deleteHoliday<Usuario>(path, uid, value);
              }
            }
          }
        ]
      });
      await this.alert.present();
    })




  }
}
