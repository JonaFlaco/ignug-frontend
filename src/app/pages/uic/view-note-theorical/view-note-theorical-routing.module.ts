import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ViewNoteTheoricalComponent} from './view-note-theorical.component';

const routes: Routes = [
  {
    path: '',
    component: ViewNoteTheoricalComponent
  },
  // {
  //   path: ':id',
  //   component: TheoricalNoteFormComponent,
  //   canDeactivate: [ExitGuard]
  // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewNoteTheoricalRoutingModule {
}
