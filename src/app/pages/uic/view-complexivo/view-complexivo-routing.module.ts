import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ViewComplexivoComponent} from './view-complexivo.component';
import {ExitGuard} from '@shared/guards';

const routes: Routes = [
  {
    path: '',
    component: ViewComplexivoComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewComplexivoRoutingModule {
}
