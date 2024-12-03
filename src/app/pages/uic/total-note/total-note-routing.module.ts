import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ExitGuard} from '@shared/guards';
import { TotalNoteFormComponent } from './total-note-form/total-note-form.component';
import { TotalNoteComponent } from './total-note.component';

const routes: Routes = [
  {
    path: '',
    component: TotalNoteComponent
  },
  {
    path: ':id',
    component: TotalNoteFormComponent,
    canDeactivate: [ExitGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TotalNoteRoutingModule {
}
