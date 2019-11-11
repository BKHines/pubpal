import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'arraymaxdisplay'
})
export class ArraymaxdisplayPipe implements PipeTransform {

  transform(items: any[], maxdisplay: number): any {
    return items ? items.slice(0, maxdisplay) : null;
  }

}
