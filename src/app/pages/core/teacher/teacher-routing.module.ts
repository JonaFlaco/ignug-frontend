import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TeacherComponent} from './teacher.component';
import {TeacherFormComponent} from './teacher-form/teacher-form.component';
import {ExitGuard} from '@shared/guards';

const routes: Routes = [
  {
    path: '',
    component: TeacherComponent
  },
  {
    path: ':id',
    component: TeacherFormComponent,
    canDeactivate: [ExitGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeacherRoutingModule {
}
