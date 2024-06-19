import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VentaProductosPage } from './venta-productos.page';

const routes: Routes = [
  {
    path: '',
    component: VentaProductosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VentaProductosPageRoutingModule {}
