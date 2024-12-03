import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ExitGuard} from '@shared/guards';
import { TutorAssignmentComponent } from './tutor-assignment.component';
import { TutorAssignmentFormComponent } from './tutor-assignment-form/tutor-assignment-form.component';

const routes: Routes = [
  {
    path: '',
    component: TutorAssignmentComponent
  },
  {
    path: ':id',
    component: TutorAssignmentFormComponent,
    canDeactivate: [ExitGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TutorAssignmentRoutingModule {
}
