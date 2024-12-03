import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TheoricalNoteComponent} from './theoretical-note.component';
import {TheoricalNoteFormComponent} from './theoretical-note-form/theoretical-note-form.component';
import {ExitGuard} from '@shared/guards';

const routes: Routes = [
  {
    path: '',
    component: TheoricalNoteComponent
  },
  {
    path: ':id',
    component: TheoricalNoteFormComponent,
    canDeactivate: [ExitGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TheoricalNoteRoutingModule {
}
