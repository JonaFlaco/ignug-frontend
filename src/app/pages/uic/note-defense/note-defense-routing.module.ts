import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { NoteDefenseComponent } from './note-defense.component';

const routes: Routes = [
  {
    path: '',
    component: NoteDefenseComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NoteDefenseRoutingModule {
}
