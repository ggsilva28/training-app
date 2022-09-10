import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

import { StorageService } from 'src/app/services/storage.service';

import { v4 as uuid } from 'uuid';

export type Exercise = {
  id: string;
  train_id: string;
  name: string;
  series: number;
  weight?: string;
  repetitions: number;
  finished?: boolean;
}

@Injectable({
  providedIn: 'root'
})

export class ExerciseService {

  private storageKey: string = 'app-gym:exercises'

  constructor(
    private alert: AlertController,
    private storage: StorageService,
  ) { }

  async get(train_id: string) {
    const list = await this.storage.get(this.storageKey) || []
    return list.filter(item => item.train_id === train_id)
  }

  async add(exercise: Exercise) {
    const newItem: Exercise = {
      ...exercise,
      id: uuid()
    }

    const list = await this.storage.get(this.storageKey) || []
    list.push(newItem)

    return await this.storage.set(this.storageKey, newItem)
  }

  async edit(exercise: Exercise): Promise<boolean> {
    const list = await this.storage.get(this.storageKey)
    const index = list.findIndex(x => x.id == exercise.id)

    if (index < 0) {
      return false
    }

    list[index] = exercise;

    await this.storage.set(this.storageKey, list)
    return true
  }

  async removerPrompt(id: string) {
    const alert = await this.alert.create({
      cssClass: 'my-custom-class',
      header: 'Remover Exercício?',
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
