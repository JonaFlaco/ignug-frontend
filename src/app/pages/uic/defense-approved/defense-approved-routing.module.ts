import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DefenseApprovedComponent } from './defense-approved.component';

const routes: Routes = [
  {
    path: ':id',
    component: DefenseApprovedComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DefenseApprovedRoutingModule {}
