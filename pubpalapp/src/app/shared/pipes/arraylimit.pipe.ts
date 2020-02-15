import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'arraylimit',
  pure: false
})
export class ArraylimitPipe implements PipeTransform {

  transform(items: any[], limit: number): any {
    if (!items) {
      return null;
    }

    if (!limit) {
        return items;
    }

    return items.slice(0, limit);
  }

}
