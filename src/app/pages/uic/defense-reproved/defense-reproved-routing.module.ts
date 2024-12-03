import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DefenseReprovedComponent } from './defense-reproved.component';

const routes: Routes = [
  {
    path: ':id',
    component: DefenseReprovedComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DefenseReprovedRoutingModule {}
