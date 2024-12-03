import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MeshStudentRequirementComponent} from './mesh-student-requirement.component';
import {MeshStudentRequirementFormComponent} from './mesh-student-requirement-form/mesh-student-requirement-form.component';
import {ExitGuard} from '@shared/guards';

const routes: Routes = [
  {
    path: '',
    component: MeshStudentRequirementComponent
  },
  {
    path: ':id',
    component: MeshStudentRequirementFormComponent,
    canDeactivate: [ExitGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MeshStudentRequirementRoutingModule {
}
