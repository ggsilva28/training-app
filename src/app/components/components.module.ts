import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { ExerciseItemComponent } from './exercise-item/exercise-item.component';
import { ExerciseFormComponent } from './exercise-form/exercise-form.component';
import { TrainingItemComponent } from './training-item/training-item.component';
import { TrainingFormComponent } from './training-form/training-form.component';
import { UserFormComponent } from './user-form/user-form.component';

@NgModule({
    declarations: [
        ExerciseItemComponent,
        ExerciseFormComponent,
        TrainingItemComponent,
        TrainingFormComponent,
        UserFormComponent,
    ],
    exports: [
        ExerciseItemComponent,
        ExerciseFormComponent,
        TrainingItemComponent,
        TrainingFormComponent,
        UserFormComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        IonicModule,
        RouterModule,
    ],
    schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
})
export class ComponentsModule { }
