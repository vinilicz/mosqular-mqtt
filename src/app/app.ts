import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppStorage } from './services/app-storage';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AppLanguage } from './services/app-language';
import { AppLayout } from './layout/app-layout';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  providers: [ConfirmationService, MessageService],
  templateUrl: './app.html',
})
export class App implements OnInit {
  private readonly appLanguage = inject(AppLanguage);
  private readonly appLayout = inject(AppLayout);
  private readonly appStorage = inject(AppStorage);

  ngOnInit(): void {
    this.setup();
  }

  setup() {
    this.appLanguage.applyUserLang();
    this.appLayout.applyUserDarkMode();
    this.appLanguage.applyUserDateHourFormat();

    if (this.isFirstAccess()) {
      this.firstAccessSetup();
    }
  }

  isFirstAccess(): boolean {
    return localStorage.getItem('m:firstAccess') === null;
  }

  firstAccessSetup() {
    this.appStorage.setServers(this.appStorage.defaultServers());
    localStorage.setItem('m:firstAccess', 'false');
  }
}
