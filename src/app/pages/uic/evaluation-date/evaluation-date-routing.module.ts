import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {EvaluationDateComponent} from './evaluation-date.component';
import {EvaluationDateFormComponent} from './evaluation-date-form/evaluation-date-form.component';
import {ExitGuard} from '@shared/guards';

const routes: Routes = [
  {
    path: '',
    component: EvaluationDateComponent
  },
  {
    path: ':id',
    component: EvaluationDateFormComponent,
    canDeactivate: [ExitGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EvaluationDateRoutingModule {
}
