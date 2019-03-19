import { Pipe } from '@angular/core';

// tslint:disable-next-line:use-pipe-transform-interface
@Pipe({
  name: 'orderby'
})
export class OrderByPipe {
  transform(array: Array<string>, args: string): Array<string> {
    array.sort((a: any, b: any) => {
      if (a.optionName < b.optionName) {
        return -1;
      } else if (a.optionName > b.optionName) {
        return 1;
      } else {
        return 0;
      }
    });
    return array;
  }
}
