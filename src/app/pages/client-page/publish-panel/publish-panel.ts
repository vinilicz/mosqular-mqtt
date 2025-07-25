import {
  AfterViewInit,
  Component,
  computed,
  ElementRef,
  inject,
  model,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { AppMqtt } from '../../../services/app-mqtt';
import { SelectModule } from 'primeng/select';
import { Button } from 'primeng/button';
import { TranslatePipe } from '@ngx-translate/core';
import { QoS } from '../../../types/qos.type';
import { CheckboxModule } from 'primeng/checkbox';

@Component({
  selector: 'app-publish-panel',
  imports: [
    InputTextModule,
    TextareaModule,
    FormsModule,
    SelectModule,
    Button,
    TranslatePipe,
    CheckboxModule,
  ],
  templateUrl: './publish-panel.html',
  styleUrl: './publish-panel.scss',
})
export class PublishPanel implements AfterViewInit {
  readonly qosOptions = [
    { label: 'QoS 0', value: 0 },
    { label: 'QoS 1', value: 1 },
    { label: 'QoS 2', value: 2 },
  ];

  selectedQos = model<QoS>(0);

  topic = model('');
  message = model<string | undefined>();
  retain = model(false);

  private readonly appMqtt = inject(AppMqtt);
  readonly isConnected = this.appMqtt.isConnected;

  canPublish = computed(() => this.isConnected() && this.topic().length > 0);

  @ViewChild('messageTextArea')
  messageTextArea!: ElementRef<HTMLTextAreaElement>;

  ngAfterViewInit(): void {
    this.messageTextArea?.nativeElement.addEventListener('keydown', (e) => {
      e.stopPropagation();
      if (e.key === 'Enter' && !e.shiftKey) {
        this.publish();
      }
    });
  }

  publish() {
    const topic = this.topic();
    if (!topic) return;
    const message = this.message() ?? '';
    const qos = this.selectedQos();
    const retain = this.retain();
    this.appMqtt.publish(topic, message, { qos, retain: retain });
  }
}
