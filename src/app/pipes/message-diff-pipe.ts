import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'messageDiff',
})
export class MessageDiffPipe implements PipeTransform {
  transform(ms: number): string {
    const seconds = ms / 1000;
    if (seconds < 10) {
      return seconds.toFixed(3);
    }
    if (seconds < 100) {
      return seconds.toFixed(2);
    } else {
      return Math.round(seconds).toString();
    }
  }
}
