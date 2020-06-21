import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
@Pipe({
  name: 'idade'
})
export class IdadePipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return moment().diff(moment(value), 'years');
  }

}
