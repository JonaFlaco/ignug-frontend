import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [

  {
    path: 'signatures',
    loadChildren: () => import('./signature/signature.module').then(m => m.SignatureModule)
  },

  {
    path: 'teachers',
    loadChildren: () => import('./teacher/teacher.module').then(m => m.TeacherModule)
  },

  {
    path: 'students',
    loadChildren: () => import('./student/student.module').then(m => m.StudentModule)
  },

  {
    path: 'years',
    loadChildren: () => import('./year/year.module').then((m) => m.YearModule),
  },
  {
    path: 'careers',
    loadChildren: () => import('./career/career.module').then((m) => m.CareerModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreRoutingModule {
}
