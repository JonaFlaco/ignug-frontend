import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExitGuard } from '@shared/guards';
import { NoteSettingFormComponent } from './note-setting-form/note-setting-form.component';
import { NoteSettingComponent } from './note-setting.component';

const routes: Routes = [
  {
    path: '',
    component: NoteSettingComponent,
  },
  {
    path: ':id',
    component: NoteSettingFormComponent,
    canDeactivate: [ExitGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NoteSettingRoutingModule {}
