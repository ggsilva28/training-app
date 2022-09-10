import { Injectable } from '@angular/core';

import { ToastController, ToastOptions } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(
    public toastCtrl: ToastController
  ) { }

  async show(title, type: boolean | string = true) {
    const color = (typeof type == 'string') ? type : (type) ? 'success' : 'danger'

    const toast = await this.toastCtrl.create({
      header: title,
      color: color,
      mode: 'ios',
      duration: 3000,
    })

    toast.present();
  }
}
