import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CatalogueTypeComponent} from './catalogue-type.component';
import {CatalogueTypeFormComponent} from './catalogue-type-form/catalogue-type-form.component';
import {ExitGuard} from '@shared/guards';

const routes: Routes = [
  {
    path: '',
    component: CatalogueTypeComponent
  },
  {
    path: ':id',
    component: CatalogueTypeFormComponent,
    canDeactivate: [ExitGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CatalogueTypeRoutingModule {
}