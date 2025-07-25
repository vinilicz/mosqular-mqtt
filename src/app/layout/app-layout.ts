import { Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppLayout {
  private readonly _isDarkMode = new BehaviorSubject<boolean>(true);
  readonly isDarkMode = toSignal(this._isDarkMode);

  toggleDarkMode() {
    const darkMode = !this._isDarkMode.value;
    this.applyDarkMode(darkMode);
    this.setStorageDarkMode(darkMode);
  }

  private applyDarkMode(isDark: boolean) {
    document.documentElement.classList.toggle('app-dark', isDark);
    this._isDarkMode.next(isDark);
  }

  applyUserDarkMode() {
    const darkMode = this.getStorageDarkMode();
    if (darkMode !== undefined) {
      this.applyDarkMode(darkMode);
    }
  }

  getDarkMode() {
    return this._isDarkMode.value;
  }

  private setStorageDarkMode(isDark: boolean) {
    localStorage.setItem('m:darkMode', isDark.toString());
  }

  private getStorageDarkMode(): boolean | undefined {
    const darkMode = localStorage.getItem('m:darkMode');
    if (!darkMode) return undefined;
    return darkMode === 'true';
  }
}
