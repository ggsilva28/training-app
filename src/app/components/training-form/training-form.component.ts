import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

//Services
import { TrainingService, Train } from '../../services/training.service';
import { ToastService } from '../../services/toast.service';
import { EventsService } from '../../services/events.service';

@Component({
  selector: 'app-training-form',
  templateUrl: './training-form.component.html',
  styleUrls: ['./training-form.component.scss'],
})
export class TrainingFormComponent implements OnInit {

  public data: Train = null;
  public form: FormGroup;

  constructor(
    public formBuilder: FormBuilder,
    public training: TrainingService,
    public toast: ToastService,
    public modal: ModalController,
    public events: EventsService,
  ) {
    this.form = this.formBuilder.group({
      id: [''],
      name: ['', [Validators.required]],
      color: ['', [Validators.required]]
    })
  }

  ngOnInit() {
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
    await this.training.add(this.form.value)
    this.success('Treino adicionado');
  }

  async edit() {
    const save = await this.training.edit(this.form.value)
    if (save) {
      this.success('Treino alterado');
    } else {
      this.toast.show('Não foi possível alterar o treino', false)
    }
  }

  success(msg: string) {
    this.toast.show(msg)
    this.modal.dismiss();
  }

}
