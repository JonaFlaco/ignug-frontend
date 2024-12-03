import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AttendanceRecordComponent} from './attendance-record.component';
import {AttendanceRecordFormComponent} from './attendance-record-form/attendance-record-form.component';
import {ExitGuard} from '@shared/guards';

const routes: Routes = [
  {
    path: '',
    component: AttendanceRecordComponent
  },
  {
    path: ':id',
    component: AttendanceRecordFormComponent,
    canDeactivate: [ExitGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AttendanceRecordRoutingModule {
}
