import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DownloadFormatComponent} from './download-format.component';
import {DownloadFormatFormComponent} from './download-format-form/download-format-form.component';
import {ExitGuard} from '@shared/guards';

const routes: Routes = [
  {
    path: '',
    component: DownloadFormatComponent
  },
  {
    path: ':id',
    component: DownloadFormatFormComponent,
    canDeactivate: [ExitGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DownloadFormatRoutingModule {
}
