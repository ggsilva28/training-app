import { Component, Input, OnInit, SimpleChange } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

//Services
import { ExerciseService, Exercise, Categories } from 'src/app/services/exercise.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-exercise-form',
  templateUrl: './exercise-form.component.html',
  styleUrls: ['./exercise-form.component.scss'],
})
export class ExerciseFormComponent implements OnInit {

  @Input() data: Exercise = null
  @Input() train_id: string = ''

  public form: UntypedFormGroup

  public categories = Categories

  constructor(
    public formBuilder: UntypedFormBuilder,
    public toast: ToastService,
    public modal: ModalController,
    public exercise: ExerciseService,
  ) {
    this.form = this.formBuilder.group({
      id: [''],
      train_id: ['', [Validators.required]],
      name: ['', [Validators.required]],
      series: ['', [Validators.required]],
      weight: ['', [Validators.required]],
      repetitions: ['', [Validators.required]],
      finished: [false],
      category: ['', Validators.required],
    })
  }

  ngOnInit() {
    this.form.patchValue({
      train_id: this.train_id
    })

    if (this.data)
      this.form.patchValue(this.data)
  }

  async submit() {
    if (this.form.valid) {

      if (this.form.value.id) {
        this.edit()
      } else {
        this.add()
      }

    } else {
      this.toast.show('Preencha todos campos', false)
    }
  }

  async add() {
    await this.exercise.add(this.form.value)
    this.success('Exercício adicionado');
  }

  async edit() {
    const save = await this.exercise.edit(this.form.value)
    if (save) {
      this.success('Exercício alterado');
    } else {
      this.toast.show('Não foi possível alterar o exercício', false)
    }
  }

  success(msg: string) {
    this.toast.show(msg)
    this.modal.dismiss();
  }

}
