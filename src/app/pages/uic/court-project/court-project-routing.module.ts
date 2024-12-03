import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CourtProjectComponent} from './court-project.component';
import {CourtProjectFormComponent} from './court-project-form/court-project-form.component';
import {ExitGuard} from '@shared/guards';

const routes: Routes = [
  {
    path: '',
    component: CourtProjectComponent
  },
  {
    path: ':id',
    component: CourtProjectFormComponent,
    canDeactivate: [ExitGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CourtProjectRoutingModule {
}
