import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ExitGuard} from '@shared/guards';
import { ResponseProjectPlanComponent } from './response-project-plan.component';
import { ResponseProjectPlanFormComponent } from './response-project-plan-form/response-project-plan-form.component';

const routes: Routes = [
  {
    path: '',
    component: ResponseProjectPlanComponent
  },
  {
    path: ':id',
    component: ResponseProjectPlanFormComponent,
    canDeactivate: [ExitGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResponseProjectPlanRoutingModule {
}
