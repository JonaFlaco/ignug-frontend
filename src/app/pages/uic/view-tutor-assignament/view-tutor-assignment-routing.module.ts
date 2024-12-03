import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ExitGuard} from '@shared/guards';
import { ViewTutorAssignmentComponent } from './view-tutor-assignment.component';

const routes: Routes = [
  {
    path: '',
    component: ViewTutorAssignmentComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewTutorAssignmentRoutingModule {
}
