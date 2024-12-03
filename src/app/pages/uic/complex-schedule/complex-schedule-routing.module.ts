import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExitGuard } from '@shared/guards';
import { ComplexScheduleFormComponent } from './complex-schedule-form/complex-schedule-form.component';
import { ComplexScheduleComponent } from './complex-schedule.component';

const routes: Routes = [
  {
    path: '',
    component: ComplexScheduleComponent,
  },
  {
    path: ':id',
    component: ComplexScheduleFormComponent,
    canDeactivate: [ExitGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ComplexScheduleRoutingModule {}
