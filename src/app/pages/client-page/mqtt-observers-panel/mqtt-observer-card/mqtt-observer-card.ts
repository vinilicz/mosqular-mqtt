import {
  AfterViewInit,
  Component,
  effect,
  inject,
  input,
  OnDestroy,
  output,
  ViewChild,
} from '@angular/core';
import { NgClass } from '@angular/common';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { AppMqtt } from '../../../../services/app-mqtt';
import { ConfirmationService } from 'primeng/api';
import { Subscription } from 'rxjs';
import {
  CdkVirtualScrollViewport,
  ScrollingModule,
} from '@angular/cdk/scrolling';
import { MqttObserverModel } from '../../../../models/mqtt-observer.model';
import { Message } from '../../../../types/message.type';
import { LocalizeDatePipe } from '../../../../pipes/localize-date-pipe';

@Component({
  selector: 'app-mqtt-observer-card',
  imports: [
    LocalizeDatePipe,
    TranslatePipe,
    ButtonModule,
    ScrollingModule,
    NgClass,
  ],
  templateUrl: './mqtt-observer-card.html',
  styleUrl: './mqtt-observer-card.scss',
})
export class MqttObserverCard implements AfterViewInit, OnDestroy {
  observer = input.required<MqttObserverModel>();

  private readonly appMqtt = inject(AppMqtt);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly translationService = inject(TranslateService);

  selectedMessage = this.appMqtt.selectedMessage;
  trackedObserver = this.appMqtt.trackedObserver;

  keepAtBottom = true;

  toggleMaximized = output<MqttObserverModel>();
  maximized = input(false);

  @ViewChild('scrollContainer') scrollContainer!: CdkVirtualScrollViewport;
  messagesScrolledSub?: Subscription;

  constructor() {
    effect(() => {
      this.scrollToIndex(this.observer().messages().length - 1);
    });
  }

  ngAfterViewInit(): void {
    this.setupScrollListener();
  }

  ngOnDestroy(): void {
    this.messagesScrolledSub?.unsubscribe();
  }

  showRemoveDialog() {
    this.confirmationService.confirm({
      message: this.translationService.instant(
        'OBSERVER.REMOVE_DIALOG_MESSAGE',
      ),
      header: this.translationService.instant('COMMON.REMOVE'),
      acceptLabel: this.translationService.instant('COMMON.REMOVE'),
      rejectLabel: this.translationService.instant('COMMON.CANCEL'),
      icon: 'pi pi-exclamation-circle',
      acceptButtonProps: { severity: 'danger' },
      rejectButtonProps: { severity: 'secondary' },
      accept: () => {
        if (this.maximized()) this.toggleMaximize();
        this.appMqtt.removeObserver(this.observer().id);
      },
    });
  }

  showClearMessagesDialog() {
    this.confirmationService.confirm({
      message: this.translationService.instant(
        'OBSERVER.CLEAR_MESSAGES_DIALOG_MESSAGE',
      ),
      header: this.translationService.instant('COMMON.CLEAR'),
      acceptLabel: this.translationService.instant('COMMON.CLEAR'),
      rejectLabel: this.translationService.instant('COMMON.CANCEL'),
      icon: 'pi pi-exclamation-circle',
      acceptButtonProps: { severity: 'danger' },
      accept: () => {
        this.observer().clearMessages();
      },
    });
  }

  setupScrollListener() {
    this.messagesScrolledSub =
      this.scrollContainer.scrolledIndexChange.subscribe(() => {
        this.keepAtBottom =
          this.scrollContainer.measureScrollOffset('bottom') < 45;
      });
  }

  scrollToIndex(index: number) {
    if (!this.keepAtBottom) return;
    const element = this.scrollContainer;
    requestAnimationFrame(() => {
      element?.scrollToIndex(index);
    });
  }

  trackById(_i: number, message: Message) {
    return message.id;
  }

  toggleMaximize() {
    this.toggleMaximized.emit(this.observer());
  }

  selectMessage(message: Message) {
    this.appMqtt.setSelectedMessage(message);
  }

  toggleTracked() {
    const observer = this.observer();
    this.appMqtt.setTrackedObserver(
      observer.id === this.trackedObserver()?.id ? null : observer,
    );
  }
}
