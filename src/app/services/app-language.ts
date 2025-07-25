import { inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';

export type HourFormat = '24' | '12';
export type DateFormat = 'dd/MM/yyyy' | 'MM/dd/yyyy';

export type DateType =
  | 'date'
  | 'time'
  | 'longtime'
  | 'fulltime'
  | 'datetime'
  | 'compactdate'
  | 'datelongtime'
  | 'compactdatetime'
  | 'compactdatelongtime'
  | 'fulldatetime';

@Injectable({
  providedIn: 'root',
})
export class AppLanguage {
  // time
  private hourFormat: HourFormat = '24';
  private timeFormat = 'HH:mm:ss';
  private longTimeFormat = 'HH:mm:ss.S';
  private fullTimeFormat = 'HH:mm:ss.SSS';

  // date
  private dateFormat: DateFormat = 'dd/MM/yyyy';
  private compactDateFormat = 'dd/MM';

  private readonly currentLang = new BehaviorSubject('en');
  readonly currentLang$ = this.currentLang.asObservable();

  private readonly currentHourFormat = new BehaviorSubject<HourFormat>(
    this.hourFormat,
  );
  readonly currentHourFormat$ = this.currentHourFormat.asObservable();

  private readonly currentDateFormat = new BehaviorSubject<string>(
    this.dateFormat,
  );
  readonly currentDateFormat$ = this.currentDateFormat.asObservable();

  private readonly translateService = inject(TranslateService);

  constructor() {
    this.translateService.onLangChange.subscribe((event) => {
      this.currentLang.next(event.lang);
    });
    this.setupLanguage();
  }

  private setHourFormat(format: '24' | '12') {
    this.hourFormat = format;
    if (format === '24') {
      this.timeFormat = 'HH:mm:ss';
      this.longTimeFormat = 'HH:mm:ss.S';
      this.fullTimeFormat = 'HH:mm:ss.SSS';
    } else {
      this.timeFormat = 'hh:mm:ss a';
      this.longTimeFormat = 'hh:mm:ss.S a';
      this.fullTimeFormat = 'hh:mm:ss.SSS a';
    }
    this.currentHourFormat.next(format);
  }

  private setDateFormat(format: DateFormat) {
    this.dateFormat = format;
    this.compactDateFormat = this.dateFormat.replace(
      /[/\-. ]?y{2,4}[/\-. ]?/,
      '',
    );
    this.currentDateFormat.next(format);
  }

  getDateFormat(type: DateType) {
    switch (type) {
      case 'date':
        return this.dateFormat;
      case 'time':
        return this.timeFormat;
      case 'longtime':
        return this.longTimeFormat;
      case 'fulltime':
        return this.fullTimeFormat;
      case 'datetime':
        return this.dateFormat + ', ' + this.timeFormat;
      case 'compactdate':
        return this.compactDateFormat;
      case 'compactdatetime':
        return this.compactDateFormat + ', ' + this.timeFormat;
      case 'compactdatelongtime':
        return this.compactDateFormat + ', ' + this.longTimeFormat;
      case 'datelongtime':
        return this.dateFormat + ', ' + this.longTimeFormat;
      case 'fulldatetime':
        return this.dateFormat + ', ' + this.fullTimeFormat;
    }
  }

  private setupLanguage() {
    this.translateService.addLangs(['en', 'pt', 'de']);
    this.translateService.setDefaultLang('en');
  }

  private getStorageLang() {
    return localStorage.getItem('m:lang');
  }

  private setStorageLang(lang: string) {
    localStorage.setItem('m:lang', lang);
  }

  private setStorageHourFormat(format: HourFormat) {
    localStorage.setItem('m:hourFormat', format);
  }

  private getStorageHourFormat() {
    return localStorage.getItem('m:hourFormat');
  }

  private setStorageDateFormat(format: DateFormat) {
    localStorage.setItem('m:dateFormat', format);
  }

  private getStorageDateFormat() {
    return localStorage.getItem('m:dateFormat');
  }

  private getBrowserLang() {
    return this.translateService.getBrowserLang() || navigator.language;
  }

  applyUserLang() {
    const lang = this.getStorageLang() || this.getBrowserLang();
    if (!lang) return;

    const compatibleLang = this.findCompatibleLang(lang);

    if (!compatibleLang) return;
    this.translateService.use(compatibleLang);
  }

  private findCompatibleLang(lang: string): string | undefined {
    const availableLangs = this.translateService.getLangs();
    if (availableLangs.includes(lang)) return lang;
    return availableLangs.find((aLang) => lang.startsWith(aLang));
  }

  applyUserDateHourFormat() {
    const hourFormat = this.getStorageHourFormat();
    if (hourFormat && hourFormat !== '24') {
      this.setHourFormat(hourFormat as HourFormat);
    }

    const dateFormat = this.getStorageDateFormat();
    if (dateFormat && dateFormat !== 'dd/MM/yyyy') {
      this.setDateFormat(dateFormat as DateFormat);
    }
  }

  updateLang(lang: string) {
    this.translateService.use(lang);
    this.setStorageLang(lang);
  }

  updateHourFormat(format: HourFormat) {
    this.setHourFormat(format);
    this.setStorageHourFormat(format);
  }

  updateDateFormat(format: DateFormat) {
    this.setDateFormat(format);
    this.setStorageDateFormat(format);
  }
}
