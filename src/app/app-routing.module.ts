import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'trainings',
    pathMatch: 'full'
  },
  {
    path: 'exercises/:id',
    loadChildren: () => import('./pages/exercises/exercises.module').then(m => m.ExercisesPageModule)
  },
  {
    path: 'trainings',
    loadChildren: () => import('./pages/trainings/trainings.module').then( m => m.TrainingsPageModule)
  },
  {
    path: 'exercise/:train_id/:id',
    loadChildren: () => import('./pages/exercise/exercise.module').then( m => m.ExercisePageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
