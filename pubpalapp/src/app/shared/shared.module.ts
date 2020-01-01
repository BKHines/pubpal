import { NgModule } from '@angular/core';
import { PpHeaderComponent } from './components/pp-header/pp-header.component';
import { PpMenuoptionsComponent } from './components/pp-menuoptions/pp-menuoptions.component';
import { IonicModule } from '@ionic/angular';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ArraybypropertyPipe } from './pipes/arraybyproperty.pipe';
import { ArraymaxdisplayPipe } from './pipes/arraymaxdisplay.pipe';
import { CurrencyformatPipe } from './pipes/currencyformat.pipe';

@NgModule({
    declarations: [
        PpHeaderComponent,
        PpMenuoptionsComponent,
        ArraybypropertyPipe,
        ArraymaxdisplayPipe,
        CurrencyformatPipe,
    ],
    entryComponents: [],
    imports: [
        CommonModule,
        RouterModule,
        IonicModule
    ],
    providers: [
        CurrencyPipe,
    ],
    exports: [
        PpHeaderComponent,
        PpMenuoptionsComponent,
        ArraybypropertyPipe,
        ArraymaxdisplayPipe,
        CurrencyformatPipe
    ]
})
export class SharedModule { }
