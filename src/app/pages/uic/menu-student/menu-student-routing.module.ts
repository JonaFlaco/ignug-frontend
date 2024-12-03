import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ExitGuard} from '@shared/guards';
import { MenuStudentComponent } from './menu-student.component';

const routes: Routes = [
  {
    path: '',
    component: MenuStudentComponent
  },

  {
    path: 'approval-request',
    loadChildren: () => import('../approval-request/approval-request.module').then(m => m.ApprovalRequestModule)
  },


  // {
  //   path: ':id',
  //   canDeactivate: [ExitGuard]
  // },
  // {
  //   path: '',
  //   canDeactivate: [ExitGuard]
  // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MenuStudentRoutingModule {
}
