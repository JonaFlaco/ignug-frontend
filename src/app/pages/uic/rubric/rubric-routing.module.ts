import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RubricComponent} from './rubric.component';
import {RubricFormComponent} from './rubric-form/rubric-form.component';
import {ExitGuard} from '@shared/guards';
import { RubricListComponent } from './rubric-list/rubric-list.component';
// import { HomeCareerComponent } from './home-career/home-career.component';
import { HomeRubricComponent } from './home-rubric/home-rubric.component';

const routes: Routes = [
  {
    path: '',
    component: RubricComponent
  },
  {
    path: 'list/:id',
    component: RubricListComponent
  },
  {
    path: ':id',
    component: RubricFormComponent,
    canDeactivate: [ExitGuard]
  },
  // {
  //   path: 'new',
  //   component: RubricFormComponent,
  // },
  {
    path: 'home/:id',
    component: HomeRubricComponent,
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RubricRoutingModule {
}

