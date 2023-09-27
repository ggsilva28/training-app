import { Component, OnInit, WritableSignal, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ExerciseFormComponent } from 'src/app/components/exercise-form/exercise-form.component';
import { EventsService } from 'src/app/services/events.service';
import { Exercise, ExerciseService } from 'src/app/services/exercise.service';

@Component({
  selector: 'app-exercise',
  templateUrl: './exercise.page.html',
  styleUrls: ['./exercise.page.scss'],
})
export class ExercisePage implements OnInit {
  exercise: WritableSignal<Exercise> = signal(null);

  train_id = signal('');
  exercise_id = signal('');

  constructor(
    private exerciseService: ExerciseService,
    private route: ActivatedRoute,
    private events: EventsService,
    private router: Router,
    public modal: ModalController
  ) {
    this.events.subscribe('exercise-list:update', this.getExercise.bind(this))
  }

  ngOnInit() {
    this.train_id.set(this.route.snapshot.paramMap.get('train_id'));
    this.exercise_id.set(this.route.snapshot.paramMap.get('id'));
  }

  ionViewDidEnter() {
    this.getExercise();
  }

  async getExercise() {
    const item = await this.exerciseService.getById(
      this.train_id(),
      this.exercise_id()
    );

    this.exercise.set({
      ...item,
      history: item?.history.sort((a, b) => {
        const dateA = a.date;
        const dateB = b.date;

        if (dateA > dateB) {
          return -1;
        }
        if (dateA < dateB) {
          return 1;
        }
        return 0;
      }) || []
    });
  }

  async edit() {
    const modal = await this.modal.create({
      component: ExerciseFormComponent,
      breakpoints: [0.7, 1],
      initialBreakpoint: 1,
      componentProps: {
        train_id: this.train_id(),
        data: this.exercise(),
      },
    });

    modal.present();
  }

  remove() {
    this.exerciseService.removerPrompt(this.exercise_id()).then(() => {
      this.router.navigate(['exercises', this.train_id()]);
    })
  }
}
