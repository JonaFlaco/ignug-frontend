import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {UploadProjectComponent} from './upload-project.component';
import {UploadProjectFormComponent} from './upload-project-form/upload-project-form.component';
import {ExitGuard} from '@shared/guards';

const routes: Routes = [
  {
    path: '',
    component: UploadProjectComponent
  },
  {
    path: ':id',
    component: UploadProjectFormComponent,
    canDeactivate: [ExitGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UploadProjectRoutingModule {
}
