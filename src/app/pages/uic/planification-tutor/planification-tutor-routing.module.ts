import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PlanificationTutorComponent} from './planification-tutor.component';
import {ExitGuard} from '@shared/guards';

const routes: Routes = [
  {
    path: '',
    component: PlanificationTutorComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlanificationTutorRoutingModule {
}
