import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { SecretaryViewComponent } from './secretary-view.component';

const routes: Routes = [
  {
    path: '',
    component: SecretaryViewComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SecretaryViewRoutingModule {
}
