import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

//Services
import { UserService, User } from '../../services/user.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
})
export class UserFormComponent implements OnInit {

  @Input() data: User = null;

  public form: FormGroup

  constructor(
    public formBuilder: FormBuilder,
    public toast: ToastService,
    public modal: ModalController,
    public user: UserService,
  ) {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required]],
      username: ['', [Validators.required]],
    })
  }

  ngOnInit() { 
    if(this.data){
      this.form.patchValue(this.data)
    }
  }

  async submit() {
    if (this.form.valid) {
      await this.user.set(this.form.value)
      this.modal.dismiss()
    } else {
      this.toast.show('Preencha todos campos', false)
    }
  }

}
