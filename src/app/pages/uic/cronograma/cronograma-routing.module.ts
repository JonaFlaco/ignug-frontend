import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExitGuard } from '@shared/guards';
import { CronogramaComponent } from './cronograma.component';

const routes: Routes = [
  {
    path: '',
    component: CronogramaComponent,
  },
  // {
  //   path: ':id',
  //   component: ComplexScheduleFormComponent,
  //   canDeactivate: [ExitGuard],
  // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CronogramaRoutingModule {}
