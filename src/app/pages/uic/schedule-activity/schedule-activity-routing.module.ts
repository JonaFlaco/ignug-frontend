import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScheduleActivityFormComponent } from './schedule-activity-form/schedule-activity-form.component';
import { ScheduleActivityComponent } from './schedule-activity.component';
import { ExitGuard } from '@shared/guards';

const routes: Routes = [
  {
    path: '',
    component: ScheduleActivityComponent,
  },
  {
    path: ':id',
    component: ScheduleActivityFormComponent,
    canDeactivate: [ExitGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScheduleActivityRoutingModule {}
