import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {StudentInformationComponent} from './student-information.component';
import {StudentInformationFormComponent} from './student-information-form/student-information-form.component';
import {ExitGuard} from '@shared/guards';
import { StudentInformationComplexivoFormComponent } from './student-information-complexivo-form/student-information-complexivo-form.component';
import { HomeStudentComponent } from './home-students/home-student.component';

const routes: Routes = [
  {
    path: '',
    component: StudentInformationComponent
  },
  {
    path: ':id',
    component: StudentInformationFormComponent,
    canDeactivate: [ExitGuard]
  },
  {
    path: ':id',
    component: StudentInformationComplexivoFormComponent,
    canDeactivate: [ExitGuard]
  },
  {
    path: ':id',
    component: HomeStudentComponent,
    canDeactivate: [ExitGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentInformationRoutingModule {
}
