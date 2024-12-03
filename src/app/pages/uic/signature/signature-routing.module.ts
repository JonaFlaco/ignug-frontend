import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignatureComponent } from './signature.component';
import { SignatureFormComponent } from './signature-form/signature-form.component';
import { ExitGuard } from '@shared/guards';
import { TimelineComponent } from './timeline/timeline.component';

const routes: Routes = [
  {
    path: 'timeline/:preparationCourseId',
    component: TimelineComponent,
  },
  {
    path: '',
    component: SignatureComponent,
  },
  {
    path: ':id',
    component: SignatureFormComponent,
    canDeactivate: [ExitGuard],
  },
  {
    path: 'preparationCourses/:preparationCourseId',
    component: SignatureComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SignatureRoutingModule {}
