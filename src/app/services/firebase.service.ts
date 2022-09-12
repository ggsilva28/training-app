import { Injectable } from '@angular/core';
import { Database, set, ref, update, onValue, remove } from '@angular/fire/database';

//Services
import { UserService } from './user.service';
import { TrainingService, Train } from './training.service';
import { ExerciseService } from './exercise.service';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(
    public database: Database,
    public userService: UserService,
    public trainingService: TrainingService,
    public exerciseService: ExerciseService,
    public toast: ToastService,
  ) { }

  async get() {
    const user = await this.userService.get()
    const starRef = ref(this.database, user.username + '/')

    onValue(starRef, async (snapshot) => {
      const data = snapshot.val();
      if (data) {
        for (let i of data) {
          await this.trainingService.update(i)

          if (i.exercises)
            for (let e of i.exercises) {
              await this.exerciseService.update(e)
            }
        }
      }else{
        this.toast.show('Nenhum dado encontrado na nuvem', false)
      }
    });
  }

  async sync() {
    const user = await this.userService.get()
    const trainings = await this.trainingService.get()
    const promises = [];

    trainings.forEach(async (item, index) => {

      promises.push(new Promise(async (resolve) => {
        const exercises = await this.exerciseService.get(item.id)
        trainings[index].exercises = exercises
        resolve(true)
      }))

    })

    Promise.all(promises).then(() => {
      remove(ref(this.database, user.username + '/'));
      set(ref(this.database, user.username + '/'), trainings)
      this.get()
    })
  }
}
