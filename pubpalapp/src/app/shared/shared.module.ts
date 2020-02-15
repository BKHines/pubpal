import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ArraybypropertyPipe } from './pipes/arraybyproperty.pipe';
import { ArraymaxdisplayPipe } from './pipes/arraymaxdisplay.pipe';
import { CurrencyformatPipe } from './pipes/currencyformat.pipe';
import { PpButtonComponent } from './components/pp-button/pp-button.component';
import { ArraylimitPipe } from './pipes/arraylimit.pipe';

@NgModule({
    declarations: [
        ArraybypropertyPipe,
        ArraymaxdisplayPipe,
        ArraylimitPipe,
        CurrencyformatPipe,
        PpButtonComponent
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
        ArraybypropertyPipe,
        ArraymaxdisplayPipe,
        ArraylimitPipe,
        CurrencyformatPipe,
        PpButtonComponent
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ]
})
export class SharedModule { }
