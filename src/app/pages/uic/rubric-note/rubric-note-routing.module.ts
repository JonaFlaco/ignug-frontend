import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ExitGuard} from '@shared/guards';
import { RubricNoteComponent } from './rubric-note.component';
import { RubricNoteFormComponent } from './rubric-note-form/rubric-note-form.component';

const routes: Routes = [
  {
    path: '',
    component: RubricNoteComponent
  },
  {
    path: ':id',
    component: RubricNoteFormComponent,
    canDeactivate: [ExitGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RubricNoteRoutingModule {
}
