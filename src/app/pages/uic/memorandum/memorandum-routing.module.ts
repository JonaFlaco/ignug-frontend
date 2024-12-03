import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MemorandumComponent} from './memorandum.component';
import {MemorandumFormComponent} from './memorandum-form/memorandum-form.component';
import {ExitGuard} from '@shared/guards';
import { MemorandumTutorFormComponent } from './memorandum-tutor-form/memorandum-tutor-form.component';
const routes: Routes = [
  {
    path: '',
    component: MemorandumComponent
  },
  {
    path: ':id',
    component: MemorandumFormComponent,
    canDeactivate: [ExitGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MemorandumRoutingModule {
}
