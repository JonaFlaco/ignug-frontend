import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExitGuard } from '@shared/guards';
import { ComplexTimelineFormComponent } from './complex-timeline-form/complex-timeline-form.component';
import { ComplexTimelineComponent } from './complex-timeline.component';

const routes: Routes = [
  {
    path: '',
    component: ComplexTimelineComponent,
  },
  {
    path: ':id',
    component: ComplexTimelineFormComponent,
    canDeactivate: [ExitGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ComplexTimelineRoutingModule {}
