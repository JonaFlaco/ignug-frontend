import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PreparationCourseComponent} from './preparation-course.component';
import {PreparationCourseFormComponent} from './preparation-course-form/preparation-course-form.component';
import {ExitGuard} from '@shared/guards';

const routes: Routes = [
  {
    path: '',
    component: PreparationCourseComponent
  },
  {
    path: ':id',
    component: PreparationCourseFormComponent,
    canDeactivate: [ExitGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PreparationCourseRoutingModule {
}
