import {
  Component,
  inject,
  model,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { AppMqtt } from '../../services/app-mqtt';
import { Subscription } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { TranslatePipe } from '@ngx-translate/core';
import { MqttState } from '../../enums/mqtt-state.enum';
import {
  AppLanguage,
  DateFormat,
  HourFormat,
} from '../../services/app-language';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { AsyncPipe } from '@angular/common';
import { AppLayout } from '../app-layout';
import { StateHistoryModal } from './state-history-modal/state-history-modal';

@Component({
  selector: 'app-header',
  imports: [
    ButtonModule,
    TranslatePipe,
    SelectModule,
    FormsModule,
    AsyncPipe,
    StateHistoryModal,
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header implements OnInit, OnDestroy {
  private readonly appMqtt = inject(AppMqtt);
  private readonly appLanguage = inject(AppLanguage);
  private readonly appLayout = inject(AppLayout);

  stateIcon = signal('');
  stateLabel = signal('');
  stateClass = signal('');

  languageOptions = [
    { label: 'English', value: 'en' },
    { label: 'Português (BR)', value: 'pt' },
    { label: 'Deutsch', value: 'de' },
  ];

  dateOptions = [
    { label: 'dd/MM', value: 'dd/MM/yyyy' },
    { label: 'MM/dd', value: 'MM/dd/yyyy' },
  ];

  hourOptions = [
    { label: '24h', value: '24' },
    { label: '12h', value: '12' },
  ];

  currentLang$ = this.appLanguage.currentLang$;
  currentDateFormat$ = this.appLanguage.currentDateFormat$;
  currentHourFormat$ = this.appLanguage.currentHourFormat$;
  isDarkMode = this.appLayout.isDarkMode;

  historyModalVisible = model(false);

  private stateSub?: Subscription;

  ngOnInit(): void {
    this.stateSub = this.appMqtt.connectionState$.subscribe((state) => {
      switch (state) {
        case MqttState.CONNECTING:
          this.stateIcon.set('pi pi-spin pi-spinner');
          this.stateLabel.set('CLIENT.CONNECTING');
          this.stateClass.set('bg-orange-400 border-orange-400');
          break;
        case MqttState.CONNECTED:
          this.stateIcon.set('pi pi-check-circle');
          this.stateLabel.set('CLIENT.CONNECTED');
          this.stateClass.set('bg-green-500 border-green-500');
          break;
        case MqttState.CLOSED:
          this.stateIcon.set('pi pi-times-circle');
          this.stateLabel.set('CLIENT.DISCONNECTED');
          this.stateClass.set('bg-gray-500 border-gray-500');
          break;
        case MqttState.ERROR:
          this.stateIcon.set('pi pi-exclamation-circle');
          this.stateLabel.set('CLIENT.ERROR');
          this.stateClass.set('bg-red-500 border-red-500');
      }
    });
  }

  ngOnDestroy(): void {
    this.stateSub?.unsubscribe();
  }

  onChangeLanguage(lang: string) {
    this.appLanguage.updateLang(lang);
  }

  onChangeDateFormat(format: DateFormat) {
    this.appLanguage.updateDateFormat(format);
  }

  onChangeTimeFormat(format: HourFormat) {
    this.appLanguage.updateHourFormat(format);
  }

  toggleDarkMode() {
    this.appLayout.toggleDarkMode();
  }

  showHistory() {
    this.historyModalVisible.set(true);
  }
}
