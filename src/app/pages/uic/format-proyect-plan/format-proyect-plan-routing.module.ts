import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {ExitGuard} from '@shared/guards';
import { FormatProyectPlanFormComponent } from './format-proyect-plan-form/format-proyect-plan-form.component';
import { FormatProyectPlanComponent } from './format-proyect-plan.component';

const routes: Routes = [
  {
    path: '',
    component: FormatProyectPlanComponent
  },
  {
    path: ':id',
    component: FormatProyectPlanFormComponent,
    canDeactivate: [ExitGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormatProyectPlanRoutingModule {
}
