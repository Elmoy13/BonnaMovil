import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddClientRoutePageRoutingModule } from './add-client-route-routing.module';

import { AddClientRoutePage } from './add-client-route.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddClientRoutePageRoutingModule
  ],
  declarations: [AddClientRoutePage]
})
export class AddClientRoutePageModule {}
