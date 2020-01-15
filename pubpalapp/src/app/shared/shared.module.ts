import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ArraybypropertyPipe } from './pipes/arraybyproperty.pipe';
import { ArraymaxdisplayPipe } from './pipes/arraymaxdisplay.pipe';
import { CurrencyformatPipe } from './pipes/currencyformat.pipe';

@NgModule({
    declarations: [
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
        ArraybypropertyPipe,
        ArraymaxdisplayPipe,
        CurrencyformatPipe
    ]
})
export class SharedModule { }
