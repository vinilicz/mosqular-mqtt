import { Component, inject, model, output, signal } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import {
  SavedMqttObserver,
  UpdateObserverModal,
} from './update-observer-modal/update-observer-modal';
import { AppMqtt } from '../../../services/app-mqtt';
import { AsyncPipe, NgClass } from '@angular/common';
import { MqttObserverCard } from './mqtt-observer-card/mqtt-observer-card';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { SelectModule } from 'primeng/select';
import { FloatLabelModule } from 'primeng/floatlabel';
import { MqttObserverModel } from '../../../models/mqtt-observer.model';
import { animate, style, transition, trigger } from '@angular/animations';
import { Message } from '../../../types/message.type';

@Component({
  selector: 'app-mqtt-observers-panel',
  imports: [
    ButtonModule,
    TranslatePipe,
    UpdateObserverModal,
    AsyncPipe,
    MqttObserverCard,
    SelectButtonModule,
    FormsModule,
    NgClass,
    SelectModule,
    FloatLabelModule,
  ],
  templateUrl: './mqtt-observers-panel.html',
  styleUrl: './mqtt-observers-panel.scss',
  animations: [
    trigger('fadeOut', [
      transition('* => void', [
        style({ opacity: 1 }),
        animate('300ms ease-out', style({ opacity: 0 })),
      ]),
    ]),
  ],
})
export class MqttObserversPanel {
  updateObserverModalVisible = signal(false);

  maximizedObserver = signal<MqttObserverModel | null>(null);

  colOptions = [
    { label: 'Auto', value: 'observer-col-auto' },
    { label: '1', value: 'w-12' },
    { label: '2', value: 'w-6' },
    { label: '3', value: 'w-4' },
    { label: '4', value: 'w-3' },
  ];

  heightOptions = [
    { label: '25%', value: 'h-12' },
    { label: '50%', value: 'h-6' },
    { label: '75%', value: 'h-4' },
    { label: '100%', value: 'h-3' },
  ];

  selectedColClass = model(this.colOptions[0].value);

  selectMessage = output<Message>();

  private readonly appMqtt = inject(AppMqtt);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly translationService = inject(TranslateService);
  private readonly messageService = inject(MessageService);

  readonly observers$ = this.appMqtt.observers$;
  readonly isConnected = this.appMqtt.isConnected;

  addObserver() {
    this.updateObserverModalVisible.set(true);
  }

  saveObserver(saved: SavedMqttObserver) {
    const conflict = this.findOverlapObserver(saved.observer.topic);
    if (conflict) {
      this.messageService.add({
        severity: 'error',
        summary: this.translationService.instant('CLIENT.TOPIC_CONFLICT_TITLE'),
        detail: this.translationService.instant(
          'CLIENT.TOPIC_CONFLICT_MESSAGE',
          { name: conflict.name },
        ),
      });
      return;
    }

    this.appMqtt.addObserver(saved.observer);
    this.updateObserverModalVisible.set(false);
  }

  findOverlapObserver(topic: string) {
    return this.appMqtt
      .getObservers()
      .find((o) => this.appMqtt.topicsOverlap(o.topic, topic));
  }

  showClearMessagesConfirmation() {
    this.confirmationService.confirm({
      message: this.translationService.instant(
        'OBSERVER.CLEAR_MESSAGES_DIALOG_MESSAGE',
      ),
      acceptButtonProps: { severity: 'danger' },
      rejectButtonProps: { severity: 'secondary' },
      icon: 'pi pi-exclamation-circle',
      acceptLabel: this.translationService.instant('COMMON.CLEAR'),
      rejectLabel: this.translationService.instant('COMMON.CANCEL'),
      header: this.translationService.instant('COMMON.CONFIRMATION_HEADER'),
      accept: () => this.clearAllMessages(),
    });
  }

  showClearObserversConfirmation() {
    this.confirmationService.confirm({
      message: this.translationService.instant(
        'OBSERVER.CLEAR_OBSERVERS_DIALOG_MESSAGE',
      ),
      acceptButtonProps: { severity: 'danger' },
      rejectButtonProps: { severity: 'secondary' },
      icon: 'pi pi-exclamation-circle',
      acceptLabel: this.translationService.instant('COMMON.CLEAR'),
      rejectLabel: this.translationService.instant('COMMON.CANCEL'),
      header: this.translationService.instant('COMMON.CONFIRMATION_HEADER'),
      accept: () => this.clearObservers(),
    });
  }

  clearAllMessages() {
    const observers = this.appMqtt.getObservers();
    observers.forEach((o) => o.clearMessages());
  }

  clearObservers() {
    this.appMqtt.clearObservers();
  }

  setMaximized(observer?: MqttObserverModel) {
    this.maximizedObserver.set(observer || null);
  }
}
