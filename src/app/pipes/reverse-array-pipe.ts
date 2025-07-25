import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'reverseArray',
})
export class ReverseArrayPipe implements PipeTransform {
  transform<T extends unknown[]>(value: T): T {
    return value.slice().reverse() as T;
  }
}
