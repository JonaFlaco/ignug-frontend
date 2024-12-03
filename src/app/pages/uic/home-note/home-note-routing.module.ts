import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { HomeNoteComponent } from './home-note.component';

const routes: Routes = [
  {
    path: '',
    component: HomeNoteComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeNoteRoutingModule {
}
