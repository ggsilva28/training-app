import { Component, OnInit, signal } from '@angular/core';

@Component({
  selector: 'app-exercise',
  templateUrl: './exercise.page.html',
  styleUrls: ['./exercise.page.scss'],
})
export class ExercisePage implements OnInit {

  exercise = signal();

  constructor() { }

  ngOnInit() {
  }

}
