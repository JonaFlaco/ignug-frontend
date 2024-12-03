import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {UploadRequirementRequestComponent} from './upload-requirement-request.component';
import {UploadRequirementRequestFormComponent} from './upload-requirement-request-form/upload-requirement-request-form.component';
import {ExitGuard} from '@shared/guards';

const routes: Routes = [
  {
    path: '',
    component: UploadRequirementRequestComponent
  },
  {
    path: ':id',
    component: UploadRequirementRequestFormComponent,
    canDeactivate: [ExitGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UploadRequirementRequestRoutingModule {
}
