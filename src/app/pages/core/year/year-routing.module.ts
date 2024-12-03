import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { YearComponent } from './year.component';
import { YearFormComponent } from './year-form/year-form.component';
import { ExitGuard } from '@shared/guards';

const routes: Routes = [
  {
    path: '',
    component: YearComponent,
  },
  {
    path: ':id',
    component: YearFormComponent,
    canDeactivate: [ExitGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class YearRoutingModule {}
