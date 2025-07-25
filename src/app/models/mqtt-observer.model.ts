import { WritableSignal } from '@angular/core';
import { Message } from '../types/message.type';
import { QoS } from '../types/qos.type';

export class MqttObserverModel {
  readonly id: string;
  readonly topic: string;
  readonly qos: QoS;
  readonly createdAt: Date;
  readonly averageDiff: WritableSignal<string>;
  readonly messages: WritableSignal<Message[]>;
  readonly ignoreRetained: boolean;
  totalDiffMs: number;
  name: string;

  constructor(props: Omit<MqttObserverModel, 'clearMessages'>) {
    this.id = props.id;
    this.topic = props.topic;
    this.qos = props.qos;
    this.createdAt = props.createdAt;
    this.averageDiff = props.averageDiff;
    this.messages = props.messages;
    this.ignoreRetained = props.ignoreRetained;
    this.totalDiffMs = props.totalDiffMs;
    this.name = props.name;
  }

  clearMessages() {
    this.totalDiffMs = 0;
    this.averageDiff.set('0');
    this.messages.set([]);
  }
}
