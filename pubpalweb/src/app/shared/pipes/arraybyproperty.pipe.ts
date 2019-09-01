import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'arraybyproperty',
  pure: false
})
export class ArraybypropertyPipe implements PipeTransform {

  transform(items: any[], propertyname: string, propertyvalue: any): any {
    if (!items || !propertyname || !propertyvalue) {
      return null;
    }
    let _items = items.filter(a => {
      // console.log(a[propertyname].toString(), propertyvalue.toString(), a[propertyname].toString() === propertyvalue.toString());
      return a[propertyname].toString() === propertyvalue.toString();
    });
    // console.log(_items, propertyvalue);
    return _items;
  }

}
