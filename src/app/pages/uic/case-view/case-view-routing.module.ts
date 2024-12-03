import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CaseViewComponent } from './case-view.component';
import { ExitGuard } from '@shared/guards';
import { CaseViewFormComponent } from './case-view-form/case-view-form.component';

const routes: Routes = [
  {
    path: '',
    component: CaseViewComponent,
  },
  {
    path: ':id',
    component: CaseViewFormComponent,
    canDeactivate: [ExitGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CaseViewRoutingModule {}
