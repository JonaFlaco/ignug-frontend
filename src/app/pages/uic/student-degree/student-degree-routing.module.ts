import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {StudentDegreeComponent} from './student-degree.component';
import {StudentDegreeFormComponent} from './student-degree-form/student-degree-form.component';
import {ExitGuard} from '@shared/guards';

const routes: Routes = [
  {
    path: '',
    component: StudentDegreeComponent
  },
  {
    path: ':id',
    component: StudentDegreeFormComponent,
    canDeactivate: [ExitGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentDegreeRoutingModule {
}
