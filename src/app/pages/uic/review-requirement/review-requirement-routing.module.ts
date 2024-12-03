import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ReviewRequirementComponent} from './review-requirement.component';
import {ReviewRequirementFormComponent} from './review-requirement-form/review-requirement-form.component';
import {ExitGuard} from '@shared/guards';

const routes: Routes = [
  {
    path: '',
    component: ReviewRequirementComponent
  },
  {
    path: ':id',
    component: ReviewRequirementFormComponent,
    canDeactivate: [ExitGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReviewRequirementRoutingModule {
}
