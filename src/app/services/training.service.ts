import { Injectable } from '@angular/core';
import { StorageService } from 'src/app/services/storage.service';
import { AlertController } from '@ionic/angular';

import { v4 as uuid } from 'uuid';

export type Train = {
  id?: string;
  name: string;
  color: string;
}

@Injectable({
  providedIn: 'root'
})
export class TrainingService {

  private storageKey: string = 'app-gym:trains'

  constructor(
    private alert: AlertController,
    private storage: StorageService,
  ) { }


  async get(): Promise<Train[]> {
    const trainsList = await this.storage.get(this.storageKey)
    return trainsList || []
  }

  async getById(id: string): Promise<Train> {
    const list = await this.get();
    console.log(list)
    return list.filter(item => item.id === id)[0];
  }

  async add(train: Train): Promise<void> {
    const newItem: Train = {
      ...train,
      id: uuid()
    }

    const list = await this.storage.get(this.storageKey) || []

    list.push(newItem)
    await this.storage.set(this.storageKey, list)
  }

  async edit(train: Train): Promise<boolean> {
    const list = await this.storage.get(this.storageKey) || []
    const index = list.findIndex(item => item.id === train.id)

    if (index < 0) {
      return false
    }

    list[index] = train;

    await this.storage.set(this.storageKey, list)
    return true
  }

  async removePrompt(id: string): Promise<any> {
    const alert = await this.alert.create({
      cssClass: 'my-custom-class',
      header: 'Remover Treino?',
      mode: 'ios',
      buttons: [
        {
          text: 'Cancelar',
          cssClass: 'secondary',
        }, {
          text: 'Remover',
          cssClass: 'danger',
          handler: async () => {
            const list = await this.storage.get(this.storageKey)
            const index = list.findIndex(item => item.id === id)
            list.splice(index, 1)
            this.storage.set(this.storageKey, list)
          }
        }
      ]
    })

    await alert.present();

    return alert.onDidDismiss()
  }

}
