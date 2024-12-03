import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExitGuard } from '@shared/guards';
import { RequirementFormComponent } from './requirement-form/requirement-form.component';
import { RequirementComponent } from './requirement.component';

const routes: Routes = [
  {
    path: '',
    component: RequirementComponent
  },
  {
    path: ':id',
    component: RequirementFormComponent,
    canDeactivate: [ExitGuard]
  },
  {
    path: 'plannings/:planningId',
    component: RequirementComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequirementRoutingModule { }
