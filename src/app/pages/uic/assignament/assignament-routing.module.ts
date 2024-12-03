import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AssignamentComponent} from './assignament.component';
import {AssignamentFormComponent} from './assignament-form/assignament-form.component';
import {ExitGuard} from '@shared/guards';

const routes: Routes = [
  {
    path: '',
    component: AssignamentComponent
  },
  {
    path: ':id',
    component: AssignamentFormComponent,
    canDeactivate: [ExitGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssignamentRoutingModule {
}
