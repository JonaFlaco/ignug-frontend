import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EnrollmentComponent } from './enrollment.component';
import { EnrollmentFormComponent } from './enrollment-form/enrollment-form.component';
import { ExitGuard} from '@shared/guards';

const routes: Routes = [
  {
    // path: 'enrollments',
    path: '',
    component: EnrollmentComponent
  },
  {
    path: ':id',
    component: EnrollmentFormComponent,
    canDeactivate: [ExitGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EnrollmentRoutingModule {
  
 }
