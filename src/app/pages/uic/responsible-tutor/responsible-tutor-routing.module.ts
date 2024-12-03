import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ResponsibleTutorComponent} from './responsible-tutor.component';
import {ResponsibleTutorFormComponent} from './responsible-tutor-form/responsible-tutor-form.component';
import {ExitGuard} from '@shared/guards';

const routes: Routes = [
  {
    path: '',
    component: ResponsibleTutorComponent
  },
  {
    path: ':id',
    component: ResponsibleTutorFormComponent,
    canDeactivate: [ExitGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResponsibleTutorRoutingModule {
}
