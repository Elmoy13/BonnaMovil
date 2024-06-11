import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RouteAssignmentPageRoutingModule } from './route-assignment-routing.module';

import { RouteAssignmentPage } from './route-assignment.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouteAssignmentPageRoutingModule
  ],
  declarations: [RouteAssignmentPage]
})
export class RouteAssignmentPageModule {}
