import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PracticalCaseComponent} from './practical-case.component';
import { PracticalCaseFormComponent } from './practical-case-form/practical-case-form.component';
import {ExitGuard} from '@shared/guards';
import { TimelineComponent } from './timeline/timeline.component';

const routes: Routes = [
  {
    path: 'timeline/:id',
    component: TimelineComponent,
  },
  {
    path: 'timeline',
    component: TimelineComponent,
  },
  {
    path: '',
    component: PracticalCaseComponent
  },
  {
    path: ':id',
    component: PracticalCaseFormComponent,
    canDeactivate: [ExitGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PracticalCaseRoutingModule {
}
