import { inject, Injectable } from '@angular/core';
import {
  IMqttMessage,
  IPublishOptions,
  MqttConnectionState,
  MqttService,
} from 'ngx-mqtt';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Server } from '../types/server.type';
import { MqttState } from '../enums/mqtt-state.enum';
import { Message } from '../types/message.type';
import { toSignal } from '@angular/core/rxjs-interop';
import { genClientId, genId } from '../utils/gen-id';
import { MqttObserverModel } from '../models/mqtt-observer.model';

export type MqttHistory = {
  state: MqttState;
  date: Date;
};

@Injectable({
  providedIn: 'root',
})
export class AppMqtt {
  private readonly _isStarted = new BehaviorSubject<boolean>(false);
  readonly isStarted$ = this._isStarted.asObservable();
  readonly isStarted = toSignal(this.isStarted$);

  private readonly _connectionState = new BehaviorSubject<MqttState>(
    MqttState.CLOSED,
  );
  readonly connectionState$ = this._connectionState.asObservable();

  private readonly _observers = new BehaviorSubject<MqttObserverModel[]>([]);
  readonly observers$ = this._observers.asObservable();

  private readonly _isConnected = new BehaviorSubject<boolean>(false);
  readonly isConnected$ = this._isConnected.asObservable();
  readonly isConnected = toSignal(this.isConnected$);

  private readonly _selectedMessage = new BehaviorSubject<Message | null>(null);
  readonly selectedMessage = toSignal(this._selectedMessage.asObservable());

  private readonly _maximizedObserver =
    new BehaviorSubject<MqttObserverModel | null>(null);
  readonly maximizedObserver = toSignal(this._maximizedObserver);

  private readonly _trackedObserver =
    new BehaviorSubject<MqttObserverModel | null>(null);
  readonly trackedObserver = toSignal(this._trackedObserver);

  private _history: MqttHistory[] = [];

  private readonly subscribersMap = new Map<string, Subscription>();

  private readonly mqttService = inject(MqttService);

  constructor() {
    this.mqttService.state.subscribe((state) => {
      if (
        state === MqttConnectionState.CLOSED &&
        this._connectionState.value === MqttState.ERROR
      ) {
        return;
      }
      this._isConnected.next(state === MqttConnectionState.CONNECTED);
      this._connectionState.next(state as any);
      this.addHistory(state as any);
    });
    this.mqttService.onError.subscribe(() => {
      this._connectionState.next(MqttState.ERROR);
      this._isConnected.next(false);
      this.addHistory(MqttState.ERROR);
    });
  }

  private addHistory(state: MqttState) {
    this._history.push({ state, date: new Date() });
    if (this._history.length > 1000) {
      this._history = this._history.slice(-1000);
    }
  }

  clearHistory() {
    this._history = [];
  }

  getHistory() {
    return this._history;
  }

  start(server: Server, keepAlive: number = 120) {
    this.clearHistory();
    const protocol = `${server.protocol}://`;
    const host = server.host;
    const clientId = server.clientId || genClientId();

    this.mqttService.connect({
      clientId: clientId,
      url: protocol + host,
      username: server.username,
      password: server.password,
      keepalive: keepAlive,
    });

    this._isStarted.next(true);
    this.setLatConnectedServer(server.id);
  }

  stop() {
    this.clearObservers();
    this.mqttService.disconnect();
    this._connectionState.next(MqttState.CLOSED);
    this._isStarted.next(false);
    this._selectedMessage.next(null);
    this._maximizedObserver.next(null);
  }

  publish(topic: string, message: string, options?: IPublishOptions) {
    return this.mqttService.unsafePublish(topic, message, options);
  }

  addObserver(observer: MqttObserverModel) {
    const observers = this._observers.value;
    observers.push(observer);
    this._observers.next(observers);

    const observeFunc = observer.ignoreRetained
      ? this.mqttService.observe.bind(this.mqttService)
      : this.mqttService.observeRetained.bind(this.mqttService);

    this.subscribersMap.set(
      observer.id,
      observeFunc(observer.topic, { qos: observer.qos }).subscribe(
        (message) => {
          this.onMessage(observer, message);
        },
      ),
    );
  }

  removeObserver(id: string) {
    const observers = this._observers.value;
    const index = observers.findIndex((o) => o.id === id);
    if (index < 0) return;
    observers.splice(index, 1);
    this._observers.next(observers);
    this.safeUnsubscribe(this.subscribersMap.get(id));
    if (this.trackedObserver()?.id === id) {
      this._trackedObserver.next(null);
    }
  }

  clearObservers() {
    this._observers.next([]);
    this._selectedMessage.next(null);
    this._maximizedObserver.next(null);
    this._trackedObserver.next(null);
    this.subscribersMap.forEach((s) => this.safeUnsubscribe(s));
    this.subscribersMap.clear();
  }

  private onMessage(observer: MqttObserverModel, mqttMessage: IMqttMessage) {
    // mqtt lib is always sending retained messages...
    if (mqttMessage.retain && observer.ignoreRetained) {
      return;
    }

    const now = new Date();

    const messages = observer.messages();
    const lastMessage = messages.at(-1);

    const diffMs = lastMessage
      ? now.getTime() - lastMessage.createdAt.getTime()
      : 0;

    const message: Message = {
      id: genId(),
      topic: mqttMessage.topic,
      payload: mqttMessage.payload.toString(),
      retained: mqttMessage.retain,
      createdAt: now,
      diff: this.parseDiff(diffMs),
    };

    observer.totalDiffMs += diffMs;
    observer.averageDiff.set(
      this.parseDiff(observer.totalDiffMs / messages.length + 1),
    );
    observer.messages.update((messages) => messages.concat(message));

    if (observer.id === this._trackedObserver.value?.id) {
      this._selectedMessage.next(message);
    }
  }

  setSelectedMessage(message: Message | null) {
    this._trackedObserver.next(null);
    this._selectedMessage.next(message);
  }

  setTrackedObserver(observer: MqttObserverModel | null) {
    this._trackedObserver.next(observer);
  }

  getObservers() {
    return this._observers.value;
  }

  topicsOverlap(a: string, b: string): boolean {
    const aParts = a.split('/');
    const bParts = b.split('/');

    const maxLen = Math.max(aParts.length, bParts.length);

    for (let i = 0; i < maxLen; i++) {
      const aPart = aParts[i];
      const bPart = bParts[i];

      if (aPart === '#' || bPart === '#') {
        return true;
      }

      if (aPart === undefined || bPart === undefined) {
        return false;
      }

      if (aPart !== bPart && aPart !== '+' && bPart !== '+') {
        return false;
      }
    }

    return true;
  }

  private parseDiff(diffMs: number): string {
    if (!diffMs) return '0';

    const seconds = diffMs / 1000;

    if (seconds < 10) {
      return seconds.toFixed(3);
    } else if (seconds < 100) {
      return seconds.toFixed(2);
    } else if (seconds < 1000) {
      return seconds.toFixed(1);
    } else {
      return Math.round(seconds).toString();
    }
  }

  private safeUnsubscribe(Subscription?: Subscription) {
    try {
      Subscription?.unsubscribe();
      // eslint-disable-next-line
    } catch {}
  }

  private setLatConnectedServer(id: string) {
    localStorage.setItem('m:lastConnectedServer', id);
  }

  getLastConnectedServer() {
    return localStorage.getItem('m:lastConnectedServer');
  }
}
