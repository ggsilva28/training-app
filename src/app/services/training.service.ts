import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

//Services
import { StorageService } from './storage.service';
import { EventsService } from './events.service';
import { Exercise } from './exercise.service';

import { v4 as uuid } from 'uuid';

export type Train = {
  id?: string;
  name: string;
  color: string;
  exercises?: Exercise[];
}

@Injectable({
  providedIn: 'root'
})
export class TrainingService {

  private storageKey: string = 'app-gym:trains'

  constructor(
    public alert: AlertController,
    public storage: StorageService,
    public events: EventsService,
  ) { }


  async get(): Promise<Train[]> {
    const trainsList = await this.storage.get(this.storageKey)
    return trainsList || []
  }

  async getById(id: string): Promise<Train> {
    const list = await this.get();
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
    this.events.publish('training-list:update')
  }

  async edit(train: Train): Promise<boolean> {
    const list = await this.storage.get(this.storageKey) || []
    const index = list.findIndex(item => item.id === train.id)

    if (index < 0) {
      return false
    }

    list[index] = train;

    await this.storage.set(this.storageKey, list)
    this.events.publish('training-list:update')
    return true
  }

  async set(train: Train): Promise<void> {
    const list = await this.storage.get(this.storageKey) || []

    list.push(train)
    await this.storage.set(this.storageKey, list)
    this.events.publish('training-list:update')
  }

  async update(train: Train): Promise<void> {
    const exists = await this.getById(train.id)
    if (exists) {
      this.edit(train)
    } else {
      this.set(train)
    }
  }

  async removePrompt(id: string): Promise<any> {
    const alert = await this.alert.create({
      cssClass: 'my-custom-class',
      header: 'Excluir Treino?',
      message: 'Ação permanente!',
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
            this.events.publish('training-list:update')
          }
        }
      ]
    })

    await alert.present();

    return alert.onDidDismiss()
  }

}
