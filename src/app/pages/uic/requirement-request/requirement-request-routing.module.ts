import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RequirementRequestComponent} from './requirement-request.component';
import {RequirementRequestFormComponent} from './requirement-request-form/requirement-request-form.component';
import {ExitGuard} from '@shared/guards';

const routes: Routes = [
  {
    path: '',
    component: RequirementRequestComponent
  },
  {
    path: ':id',
    component: RequirementRequestFormComponent,
    canDeactivate: [ExitGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequirementRequestRoutingModule {
}
