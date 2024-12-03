import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ProjectBenchComponent} from './project-bench.component';
import {ProjectBenchFormComponent} from './project-bench-form/project-bench-form.component';
import {ExitGuard} from '@shared/guards';

const routes: Routes = [
  {
    path: '',
    component: ProjectBenchComponent
  },
  {
    path: ':id',
    component: ProjectBenchFormComponent,
    canDeactivate: [ExitGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectBenchRoutingModule {
}
