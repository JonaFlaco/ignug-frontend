import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PlanningComponent} from './planning.component';
import {PlanningFormComponent} from './planning-form/planning-form.component';
import {ExitGuard} from '@shared/guards';

const routes: Routes = [
  {
    path: '',
    component: PlanningComponent
  },
  {
    path: ':id',
    component: PlanningFormComponent,
    canDeactivate: [ExitGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlanningRoutingModule {
}
