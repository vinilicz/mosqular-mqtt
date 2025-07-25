import { Component, computed, inject, model } from '@angular/core';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { TranslatePipe } from '@ngx-translate/core';
import { Modal } from '../../../components/modal/modal';
import { LocalizeDatePipe } from '../../../pipes/localize-date-pipe';
import { ReverseArrayPipe } from '../../../pipes/reverse-array-pipe';
import { MqttState } from '../../../enums/mqtt-state.enum';
import { AppMqtt } from '../../../services/app-mqtt';

@Component({
  selector: 'app-state-history-modal',
  imports: [
    Modal,
    ScrollingModule,
    TranslatePipe,
    LocalizeDatePipe,
    ReverseArrayPipe,
  ],
  templateUrl: './state-history-modal.html',
  styleUrl: './state-history-modal.scss',
})
export class StateHistoryModal {
  readonly MqttState = MqttState;

  readonly visible = model<boolean>(false);

  private readonly appMqtt = inject(AppMqtt);

  items = computed(() => {
    if (this.visible()) {
      return this.appMqtt.getHistory();
    } else {
      return [];
    }
  });
}
