import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {FormatComponent} from './format.component';
import {FormatFormComponent} from './format-form/format-form.component';
import {ExitGuard} from '@shared/guards';

const routes: Routes = [
  {
    path: '',
    component: FormatComponent
  },
  {
    path: ':id',
    component: FormatFormComponent,
    canDeactivate: [ExitGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormatRoutingModule {
}
