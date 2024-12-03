import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MemorandumComponent} from './memorandum.component';
import {MemorandumFormComponent} from './memorandum-form/memorandum-form.component';
import {ExitGuard} from '@shared/guards';
import { MemorandumTutorFormComponent } from './memorandum-tutor-form/memorandum-tutor-form.component';
import { MemorandumTutorListComponent } from './memorandum-tutor-list/memorandum-tutor-list.component';

const routes: Routes = [
  {
    path: '',
    component: MemorandumComponent
  },
  // {
  //   path: 'list',
  //   component: MemorandumTutorListComponent,
  //   canDeactivate: [ExitGuard]
  // },
  { path: 'list', component: MemorandumTutorListComponent },
  {
    path: 'tutor/:id',
    component: MemorandumTutorFormComponent,
    canDeactivate: [ExitGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MemorandumTutorRoutingModule {
}
