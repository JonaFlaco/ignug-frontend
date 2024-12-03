import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ViewUploadProjectComponent} from './view-upload-project.component';
import {ExitGuard} from '@shared/guards';

const routes: Routes = [
  {
    path: '',
    component: ViewUploadProjectComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewUploadProjectRoutingModule {
}
