import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {EstudianteComponent} from './estudiante.component';
import {EstudianteFormComponent} from './estudiante-form/estudiante-form.component';
import {ExitGuard} from '@shared/guards';

const routes: Routes = [
  {
    path: '',
    component: EstudianteComponent
  },
  {
    path: ':id',
    component: EstudianteFormComponent,
    canDeactivate: [ExitGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EstudianteRoutingModule {
}
