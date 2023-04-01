import { User } from './../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

//Services
import { Train, TrainingService } from '../../services/training.service';
import { EventsService } from '../../services/events.service';
import { UserService } from '../../services/user.service';
import { FirebaseService } from 'src/app/services/firebase.service';

//Pages
import { TrainingFormComponent } from './../../components/training-form/training-form.component';
import { UserFormComponent } from './../../components/user-form/user-form.component';

@Component({
  selector: 'app-trainings',
  templateUrl: './trainings.page.html',
  styleUrls: ['./trainings.page.scss'],
})
export class TrainingsPage {

  public trainings: Partial<Train[]> = []
  public user: User
  public profileImage = `assets/img/avatars/avatar (${Math.round(Math.random() * (16 - 1) + 1)}).png`

  constructor(
    public modal: ModalController,
    public training: TrainingService,
    public events: EventsService,
    public userService: UserService,
    public firebase: FirebaseService,
  ) {
    this.events.subscribe('training-list:update', this.getTrainings.bind(this))
    this.events.subscribe('user:set', this.getUser.bind(this))
    this.events.subscribe('firebase:get', this.getUser.bind(this))
  }

  ionViewWillEnter() {
    this.getTrainings()
    this.getUser()
  }

  async getUser() {
    this.user = await this.userService.get()
    if (!this.user) {
      this.setUser()
    }
  }

  async getTrainings() {
    this.trainings = await this.training.get();
  }

  async addTraining() {
    const modal = await this.modal.create({
      component: TrainingFormComponent,
      breakpoints: [.7],
      initialBreakpoint: .7,
    })

    modal.present()
  }

  async setUser() {
    const modal = await this.modal.create({
      component: UserFormComponent,
      breakpoints: [.7],
      initialBreakpoint: .7,
      componentProps: {
        data: this.user
      }
    })

    modal.present()
  }
}
