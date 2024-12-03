import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PlanificationStudentComponent} from './planification-student.component';
import {ExitGuard} from '@shared/guards';

const routes: Routes = [
  {
    path: '',
    component: PlanificationStudentComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlanificationStudentRoutingModule {
}
