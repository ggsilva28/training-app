import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

//Services
import { TrainingService, Train } from './../../services/training.service';

@Component({
  selector: 'app-exercises',
  templateUrl: './exercises.page.html',
  styleUrls: ['./exercises.page.scss'],
})
export class ExercisesPage implements OnInit {

  public id: string;
  public training: Train;

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public trainingService: TrainingService
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
  }

  async ionViewDidEnter() {
    this.training = await this.trainingService.getById(this.id)
  }

  async remove() {
    const confirm = await this.trainingService.removePrompt(this.id)
    if(confirm.data !== undefined){
      this.router.navigate(['trainings'])
    }
  }
}
