import { MqttConnectionState } from 'ngx-mqtt';

export enum MqttState {
  ERROR = -1,
  CLOSED = MqttConnectionState.CLOSED,
  CONNECTING = MqttConnectionState.CONNECTING,
  CONNECTED = MqttConnectionState.CONNECTED,
}
