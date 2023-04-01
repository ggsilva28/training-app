import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

//Services
import { Exercise, ExerciseService } from 'src/app/services/exercise.service';

//Pages
import { ExerciseFormComponent } from './../../components/exercise-form/exercise-form.component';

@Component({
  selector: 'exercise-item',
  templateUrl: './exercise-item.component.html',
  styleUrls: ['./exercise-item.component.scss'],
})
export class ExerciseItemComponent {

  @Input() exercise: Exercise

  constructor(
    public modal: ModalController,
    public exerciseService: ExerciseService
  ) { }

  async edit() {
    const modal = await this.modal.create({
      component: ExerciseFormComponent,
      breakpoints: [.7],
      initialBreakpoint: .7,
      componentProps: {
        train_id: this.exercise.train_id,
        data: this.exercise
      }
    })

    modal.present()
  }

  remove() {
    this.exerciseService.removerPrompt(this.exercise.id)
  }

}
