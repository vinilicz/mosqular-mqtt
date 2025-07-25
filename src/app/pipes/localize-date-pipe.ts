import { inject, Pipe, PipeTransform } from '@angular/core';
import { AppLanguage, DateType } from '../services/app-language';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'localizeDate',
})
export class LocalizeDatePipe implements PipeTransform {
  private readonly appLanguage = inject(AppLanguage);
  private readonly datePipe = new DatePipe('en-US');

  transform(
    value?: string | number | Date,
    type: DateType = 'datetime',
  ): string | null {
    if (value == null) return null;
    const format = this.appLanguage.getDateFormat(type);
    return this.datePipe.transform(value, format);
  }
}
