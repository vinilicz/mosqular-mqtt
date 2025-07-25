import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatJson',
})
export class FormatJsonPipe implements PipeTransform {
  transform<T = any>(value: T): string | T {
    if (value == null) return '';
    try {
      return JSON.stringify(JSON.parse(value as string), null, 2);
    } catch (error) {
      return value;
    }
  }
}
