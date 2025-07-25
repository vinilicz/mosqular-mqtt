import { Component, model } from '@angular/core';
import { ConnectionPanel } from './connection-panel/connection-panel';
import { SplitterModule } from 'primeng/splitter';
import { AccordionModule } from 'primeng/accordion';
import { TranslatePipe } from '@ngx-translate/core';
import { PublishPanel } from './publish-panel/publish-panel';
import { MqttObserversPanel } from './mqtt-observers-panel/mqtt-observers-panel';
import { Message } from '../../types/message.type';
import { SelectedMessagePanel } from './selected-message-panel/selected-message-panel';

@Component({
  selector: 'app-client-page',
  imports: [
    ConnectionPanel,
    SplitterModule,
    AccordionModule,
    TranslatePipe,
    PublishPanel,
    MqttObserversPanel,
    SelectedMessagePanel,
  ],
  templateUrl: './client-page.html',
  styleUrl: './client-page.scss',
})
export class ClientPage {
  selectedMessage = model<Message>();
}
