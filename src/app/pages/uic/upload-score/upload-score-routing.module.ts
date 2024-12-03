import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {UploadScoreComponent} from './upload-score.component';
import {UploadScoreFormComponent} from './upload-score-form/upload-score-form.component';
import {ExitGuard} from '@shared/guards';

const routes: Routes = [
  {
    path: '',
    component: UploadScoreComponent
  },
  {
    path: ':id',
    component: UploadScoreFormComponent,
    canDeactivate: [ExitGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UploadScoreRoutingModule {
}
