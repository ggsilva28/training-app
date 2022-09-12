import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

//Services
import { StorageService } from './storage.service';
import { EventsService } from './events.service';

import { v4 as uuid } from 'uuid';

export type Exercise = {
  id: string;
  train_id: string;
  name: string;
  series: number;
  weight?: string;
  repetitions: number;
  finished?: boolean;
  category?: string;
}

export const Categories = [
  'Peito', 'Tríceps', 'Abdômen', 'Costa', 'Biceps', 'Ombro/Trapézio', 'Coxa/Quadríceps', 'Coxa (Posterior/Panturrilha)', 'Glúteo'
]

@Injectable({
  providedIn: 'root'
})

export class ExerciseService {

  private storageKey: string = 'app-gym:exercises'

  constructor(
    private alert: AlertController,
    private storage: StorageService,
    private events: EventsService,
  ) { }

  async get(train_id: string): Promise<Exercise[]> {
    const list = await this.storage.get(this.storageKey) || []
    return list.filter(item => item.train_id === train_id)
  }

  async getById(train_id: string, id: string): Promise<Exercise> {
    const list = await this.get(train_id);
    return list.filter(item => item.id === id)[0];
  }

  async add(exercise: Exercise): Promise<void> {
    const newItem: Exercise = {
      ...exercise,
      id: uuid()
    }

    const list = await this.storage.get(this.storageKey) || []
    list.push(newItem)

    await this.storage.set(this.storageKey, list)
    this.events.publish('exercise-list:update')
  }

  async edit(exercise: Exercise): Promise<boolean> {
    const list = await this.storage.get(this.storageKey)
    const index = list.findIndex(x => x.id == exercise.id)

    if (index < 0) {
      return false
    }

    list[index] = exercise;

    await this.storage.set(this.storageKey, list)
    this.events.publish('exercise-list:update')
    return true
  }

  async set(exercise: Exercise): Promise<void> {
    const list = await this.storage.get(this.storageKey) || []
    list.push(exercise)

    await this.storage.set(this.storageKey, list)
    this.events.publish('exercise-list:update')
  }

  async update(exercise: Exercise): Promise<void> {
    const exists = await this.getById(exercise.train_id, exercise.id)
    if (exists) {
      this.edit(exercise)
    } else {
      this.set(exercise)
    }
  }

  async removerPrompt(id: string) {
    const alert = await this.alert.create({
      cssClass: 'my-custom-class',
      header: 'Excluir Exercício?',
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
            await this.storage.set(this.storageKey, list)
            this.events.publish('exercise-list:update')
          }
        }
      ]
    })

    await alert.present();

    return alert.onDidDismiss()
  }
}
