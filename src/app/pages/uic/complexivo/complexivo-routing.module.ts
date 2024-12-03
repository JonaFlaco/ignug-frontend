import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ComplexivoComponent} from './complexivo.component';
import {ComplexivoFormComponent} from './complexivo-form/complexivo-form.component';
import {ExitGuard} from '@shared/guards';

const routes: Routes = [
  {
    path: '',
    component: ComplexivoComponent
  },
  {
    path: ':id',
    component: ComplexivoFormComponent,
    canDeactivate: [ExitGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComplexivoRoutingModule {
}
