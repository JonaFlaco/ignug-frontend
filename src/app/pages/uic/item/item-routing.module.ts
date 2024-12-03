import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ItemComponent } from './item.component';
import { ExitGuard } from '@shared/guards';
import {  ItemFormComponent } from './item-form/item-form.component';

const routes: Routes = [
  {
    path: '',
    component:  ItemComponent,
  },
  {
    path: ':id',
    component:  ItemFormComponent,
    canDeactivate: [ExitGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class  ItemRoutingModule {}
