import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VentaProductosPageRoutingModule } from './venta-productos-routing.module';

import { VentaProductosPage } from './venta-productos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VentaProductosPageRoutingModule
  ],
  declarations: [VentaProductosPage]
})
export class VentaProductosPageModule {}
