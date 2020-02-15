import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'arraybyproperty',
  pure: false
})
export class ArraybypropertyPipe implements PipeTransform {

  transform(items: any[],
    propertysearches: { pname: string, pvalue: string, filter: 'equals' | 'equalsignorecase' | 'contains' | 'containsignorecase' | 'objectcontains' }[]): any {
    if (!items || !propertysearches || propertysearches.length === 0) {
      return null;
    }
    let _items = items.filter(a => {
      let foundmatch = false;
      for (let ps of propertysearches) {
        for (let psname of ps.pname.split(' ')) {
          if (!ps.pvalue || ps.pvalue.length < 2) {
            foundmatch = true;
          } else {
            if (a[psname]) {
              if (ps.filter === 'equalsignorecase') {
                let _foundmatch = a[psname].toString().toLowerCase() === ps.pvalue.toString().toLowerCase();
                foundmatch = _foundmatch || foundmatch;
              } else if (ps.filter === 'contains') {
                let _foundmatch = a[psname].toString().split(' ').some((b: string) => ps.pvalue.toString().split(' ').indexOf(b) > -1);
                foundmatch = _foundmatch || foundmatch;
              } else if (ps.filter === 'containsignorecase') {
                let _foundmatch = a[psname].toString().split(' ')
                  .map((b: string) => b.toLowerCase())
                  .some((b: string) => ps.pvalue.toString().split(' ').map((c: string) => c.toLowerCase()).some((c: string) => b.indexOf(c) > -1));
                foundmatch = _foundmatch || foundmatch;
              } else if (ps.filter === 'objectcontains') {
                let _foundmatch = ps.pvalue.split(' ').map(b => b.toLowerCase()).some(b => JSON.stringify(a[psname]).toLowerCase().indexOf(b) > -1);
                foundmatch = _foundmatch || foundmatch;
              } else {
                let _foundmatch = a[psname].toString() === ps.pvalue.toString();
                foundmatch = _foundmatch || foundmatch;
              }
            }
          }
        }
      }
      return foundmatch;
    });
    // console.log(_items, propertyvalue);
    return _items;
  }

}
