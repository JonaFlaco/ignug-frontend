import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExitGuard } from '@shared/guards';
import { RequirementFormatComponent } from './requirement-format.component';
import { RequirementFormatFormComponent } from './requirement-format-form/requirement-format-form.component';

const routes: Routes = [
  {
    path: '',
    component: RequirementFormatComponent
  },
  {
    path: ':id',
    component: RequirementFormatFormComponent,
    canDeactivate: [ExitGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequirementFormatRoutingModule { }
