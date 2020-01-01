import { Pipe, PipeTransform } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

@Pipe({
    name: 'currencyformat'
})
export class CurrencyformatPipe implements PipeTransform {
    constructor(private currencyPipe: CurrencyPipe) { }
    transform(value: any, applyFormat: boolean, currencyCode?: string, display?: string | boolean, digitsInfo?: string, locale?: string): string {
        if (value != null && applyFormat) {
            return this.currencyPipe.transform(value, currencyCode, display, digitsInfo, locale);
        }
        return this.currencyPipe.transform(0, currencyCode, display, locale).split('0.00')[0];
    }
}
