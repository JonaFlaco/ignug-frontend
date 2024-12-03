import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {InscriptionComponent} from './inscription.component';
import {InscriptionFormComponent} from './inscription-form/inscription-form.component';
import {ExitGuard} from '@shared/guards';

const routes: Routes = [
  {
    path: '',
    component: InscriptionComponent
  },
  {
    path: ':id',
    component: InscriptionFormComponent,
    canDeactivate: [ExitGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InscriptionRoutingModule {
}