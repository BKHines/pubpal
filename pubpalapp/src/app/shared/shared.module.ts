import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ArraybypropertyPipe } from './pipes/arraybyproperty.pipe';
import { ArraymaxdisplayPipe } from './pipes/arraymaxdisplay.pipe';
import { CurrencyformatPipe } from './pipes/currencyformat.pipe';
import { PpButtonComponent } from './components/pp-button/pp-button.component';

@NgModule({
    declarations: [
        ArraybypropertyPipe,
        ArraymaxdisplayPipe,
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
        CurrencyformatPipe,
        PpButtonComponent
    ]
})
export class SharedModule { }
