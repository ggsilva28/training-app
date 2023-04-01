import { Component, OnInit, Input, SimpleChange } from '@angular/core';

//Services
import { Train } from '../../services/training.service';
import { ExerciseService } from '../../services/exercise.service';

@Component({
  selector: 'training-item',
  templateUrl: './training-item.component.html',
  styleUrls: ['./training-item.component.scss'],
})
export class TrainingItemComponent {

  @Input() item: Train;

  public countEx = 0;

  constructor(
    public exercises: ExerciseService
  ) { }

  async ngOnChanges(changes: SimpleChange) {

    if (changes['item'].currentValue) {
      const get = await this.exercises.get(this.item.id)
      this.countEx = get.length;
    }
  }

}
