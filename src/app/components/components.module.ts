import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ListExerciciosComponent } from './list-exercicios/list-exercicios.component';

@NgModule({
    declarations: [
        ListExerciciosComponent
    ],
    exports: [
        ListExerciciosComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
    ],
    schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
})
export class ComponentsModule { }
