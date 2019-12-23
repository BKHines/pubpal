import { NgModule } from '@angular/core';
import { PpHeaderComponent } from './pp-header/pp-header.component';
import { PpMenuoptionsComponent } from './pp-menuoptions/pp-menuoptions.component';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    PpHeaderComponent,
    PpMenuoptionsComponent
  ],
  entryComponents: [],
  imports: [
    CommonModule,
    RouterModule,
    IonicModule
  ],
  providers: [
  ],
  exports: [
    PpHeaderComponent,
    PpMenuoptionsComponent
  ]
})
export class ComponentsModule { }
