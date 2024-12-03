import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ViewNoteTheoricalReprobedComponent} from './view-note-theorical-reprobed.component';

const routes: Routes = [
  {
    path: '',
    component: ViewNoteTheoricalReprobedComponent
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
export class ViewNoteTheoricalReprobedRoutingModule {
}
