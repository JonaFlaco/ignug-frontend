import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ExitGuard} from '@shared/guards';
import { IndividualDefenseComponent } from './individual-defense.component';

const routes: Routes = [
  {
    path: '',
    component: IndividualDefenseComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IndividualDefenseRoutingModule {
}
