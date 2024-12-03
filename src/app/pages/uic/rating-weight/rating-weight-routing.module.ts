import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RatingWeightComponent} from './rating-weight.component';
import {RatingWeightFormComponent} from './rating-weight-form/rating-weight-form.component';
import {ExitGuard} from '@shared/guards';

const routes: Routes = [
  {
    path: '',
    component: RatingWeightComponent
  },
  {
    path: ':id',
    component: RatingWeightFormComponent,
    canDeactivate: [ExitGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RatingWeightRoutingModule {
}
