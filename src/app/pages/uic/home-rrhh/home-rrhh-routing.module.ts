import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeRrhhComponent} from './home-rrhh.component';
import {ExitGuard} from '@shared/guards';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {
    path: '',
    component: HomeRrhhComponent
  },
  {
    path: ':id',
    component: HomeComponent,
    canDeactivate: [ExitGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRrhhRoutingModule {
}
