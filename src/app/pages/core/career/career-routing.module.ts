import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ExitGuard} from '@shared/guards';
import { HomeCareerComponent } from './home-career/home-career.component';

const routes: Routes = [
  {
    path: '',
    component: HomeCareerComponent,
    // canDeactivate: [ExitGuard]
  },

  

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CareerRoutingModule {
}

