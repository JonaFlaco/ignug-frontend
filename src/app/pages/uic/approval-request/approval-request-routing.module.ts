import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {ExitGuard} from '@shared/guards';
import { ApprovalRequestFormComponent } from './approval-request-form/approval-request-form.component';
import { ApprovalRequestComponent } from './approval-request.component';

const routes: Routes = [
  {
    path: '',
    component: ApprovalRequestComponent
  },
  {
    path: ':id',
    component: ApprovalRequestFormComponent,
    canDeactivate: [ExitGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApprovalRequestRoutingModule {
}
