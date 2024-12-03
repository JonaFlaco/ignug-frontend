import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TribunalComponent} from './tribunal.component';
import {TribunalFormComponent} from './tribunal-form/tribunal-form.component';
import {ExitGuard} from '@shared/guards';

const routes: Routes = [
  {
    path: '',
    component: TribunalComponent
  },
  {
    path: ':id',
    component: TribunalFormComponent,
    canDeactivate: [ExitGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TribunalRoutingModule {
}
