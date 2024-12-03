import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { ViewDefenseNoteComponent } from './view-defense-note.component';

const routes: Routes = [
  {
    path: ':id',
    component: ViewDefenseNoteComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewDefenseNoteRoutingModule {
}
