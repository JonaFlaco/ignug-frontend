import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SignatureComponent} from './signature.component';
import { SignatureFormComponent } from './signature-form/signature-form.component';
import {ExitGuard} from '@shared/guards';

const routes: Routes = [
  {
    path: '',
    component: SignatureComponent
  },
  {
    path: ':id',
    component: SignatureFormComponent,
    canDeactivate: [ExitGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SignatureRoutingModule {
}
