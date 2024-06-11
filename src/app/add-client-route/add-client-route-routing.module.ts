import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddClientRoutePage } from './add-client-route.page';

const routes: Routes = [
  {
    path: '',
    component: AddClientRoutePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddClientRoutePageRoutingModule {}
