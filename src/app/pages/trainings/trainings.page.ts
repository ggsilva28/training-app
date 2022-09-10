import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

//Services
import { Train, TrainingService } from '../../services/training.service';
import { EventsService } from '../../services/events.service';

//Pages
import { TrainingFormComponent } from './../../components/training-form/training-form.component';

@Component({
  selector: 'app-trainings',
  templateUrl: './trainings.page.html',
  styleUrls: ['./trainings.page.scss'],
})
export class TrainingsPage implements OnInit {


  public trainings: Partial<Train[]> = []

  constructor(
    public modal: ModalController,
    public training: TrainingService,
    public events: EventsService,
  ) {
    this.events.subscribe('training-list:update', this.getTrainings.bind(this))
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.getTrainings()
  }

  async getTrainings() {
    this.trainings = await this.training.get();
  }

  async addTraining() {
    const modal = await this.modal.create({
      component: TrainingFormComponent,
      breakpoints: [.7],
      initialBreakpoint: .7,
      swipeToClose: true,
    })

    modal.present()
  }
}
