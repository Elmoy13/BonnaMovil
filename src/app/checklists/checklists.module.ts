import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChecklistsPageRoutingModule } from './checklists-routing.module';

import { ChecklistsPage } from './checklists.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChecklistsPageRoutingModule
  ],
  declarations: [ChecklistsPage]
})
export class ChecklistsPageModule {}
