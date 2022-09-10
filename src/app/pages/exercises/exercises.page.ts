import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';

//Services
import { TrainingService, Train } from './../../services/training.service';
import { EventsService } from './../../services/events.service';
import { ExerciseService, Exercise, Categories } from './../../services/exercise.service';

//Pages
import { TrainingFormComponent } from './../../components/training-form/training-form.component';
import { ExerciseFormComponent } from './../../components/exercise-form/exercise-form.component';

@Component({
  selector: 'app-exercises',
  templateUrl: './exercises.page.html',
  styleUrls: ['./exercises.page.scss'],
})
export class ExercisesPage implements OnInit {

  public train_id: string;
  public training: Train;

  public exercises: Partial<{
    category: string,
    items: Partial<Exercise[]>
  }[]> = []

  public categories = Categories

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public modal: ModalController,
    public trainingService: TrainingService,
    public exerciseService: ExerciseService,
    public events: EventsService,
  ) {
    this.events.subscribe('training-list:update', this.getTraining.bind(this))
    this.events.subscribe('exercise-list:update', this.getExercises.bind(this))
  }

  ngOnInit() {
    this.train_id = this.route.snapshot.paramMap.get('id');
  }

  async ionViewDidEnter() {
    await this.getTraining()
    this.getExercises()
  }

  async getTraining() {
    this.training = await this.trainingService.getById(this.train_id)
    return true;
  }

  async removeTraining() {
    const confirm = await this.trainingService.removePrompt(this.train_id)
    if (confirm.data !== undefined) {
      this.router.navigate(['trainings'])
    }
  }

  async editTraining() {
    const modal = await this.modal.create({
      component: TrainingFormComponent,
      breakpoints: [.7],
      initialBreakpoint: .7,
      swipeToClose: true,
      componentProps: {
        data: this.training
      }
    })

    modal.present()
  }

  async getExercises() {
    this.exercises = [];
    const list = await this.exerciseService.get(this.train_id)

    list.forEach(item => {
      const index = this.exercises.findIndex(e => e.category === item.category)

      if (index < 0) {
        this.exercises.push({
          category: item.category,
          items: [item]
        })
      } else {
        this.exercises[index].items.push(item)
      }

    })
  }

  async addExercise() {
    const modal = await this.modal.create({
      component: ExerciseFormComponent,
      breakpoints: [.7],
      initialBreakpoint: .7,
      swipeToClose: true,
      componentProps: {
        train_id: this.train_id
      }
    })

    modal.present()
  }

}
