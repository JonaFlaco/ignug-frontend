import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ExitGuard} from '@shared/guards';
import { ResponseRequestProjectPlanFormComponent } from './response-request-project-plan-form/response-request-project-plan-form.component';
import { ResponseRequestProjectPlanComponent } from './response-request-project-plan.component';

const routes: Routes = [
  {
    path: '',
    component: ResponseRequestProjectPlanComponent
  },
  {
    path: ':id',
    component: ResponseRequestProjectPlanFormComponent,
    canDeactivate: [ExitGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResponseRequestProjectPlanRoutingModule {
}
