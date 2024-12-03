import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DocumentComponent} from './document.component';
import {DocumentFormComponent} from './document-form/document-form.component';
import {ExitGuard} from '@shared/guards';

const routes: Routes = [
  {
    path: '',
    component: DocumentComponent
  },
  {
    path: ':id',
    component: DocumentFormComponent,
    canDeactivate: [ExitGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocumentRoutingModule {
}