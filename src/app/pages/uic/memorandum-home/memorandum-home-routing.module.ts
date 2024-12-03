import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { MemorandumHomeComponent } from './memorandum-home.component';


const routes: Routes = [
  {
    path: '',
    component: MemorandumHomeComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MemorandumHomeRoutingModule {
}
