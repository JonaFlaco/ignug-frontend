import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ModalityComponent} from './modality.component';
import {ModalityFormComponent} from './modality-form/modality-form.component';
import {ExitGuard} from '@shared/guards';

const routes: Routes = [
  {
    path: '',
    component: ModalityComponent
  },
  {
    path: ':id',
    component: ModalityFormComponent,
    canDeactivate: [ExitGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModalityRoutingModule {
}
