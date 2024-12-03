import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExitGuard } from '@shared/guards';
import { TotalCaseComponent } from './total-case.component';


const routes: Routes = [
  {
    path: '',
    component: TotalCaseComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TotalCaseRoutingModule {}
