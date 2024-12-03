import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ViewRubricComponent} from './view-rubric.component';

const routes: Routes = [
  {
    path: '',
    component: ViewRubricComponent
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewRubricRoutingModule {
}

