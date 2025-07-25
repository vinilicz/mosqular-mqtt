import { Component, inject, model } from '@angular/core';
import { AppMqtt } from '../../../services/app-mqtt';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { LocalizeDatePipe } from '../../../pipes/localize-date-pipe';
import { ButtonModule } from 'primeng/button';
import { FormatJsonPipe } from '../../../pipes/format-json-pipe';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-selected-message-panel',
  imports: [
    TranslatePipe,
    LocalizeDatePipe,
    ButtonModule,
    FormatJsonPipe,
    CheckboxModule,
    FormsModule,
  ],
  templateUrl: './selected-message-panel.html',
  styleUrl: './selected-message-panel.scss',
})
export class SelectedMessagePanel {
  private readonly appMqtt = inject(AppMqtt);
  private readonly messageService = inject(MessageService);
  private readonly translateService = inject(TranslateService);

  message = this.appMqtt.selectedMessage;

  formatJson = model<boolean>(true);

  clear() {
    this.appMqtt.setSelectedMessage(null);
  }

  async copyPayload() {
    try {
      await navigator.clipboard.writeText(this.message()!.payload);
      this.messageService.add({
        severity: 'success',
        summary: this.translateService.instant('CLIENT.COPIED'),
        life: 2000,
      });
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: this.translateService.instant('CLIENT.COPY_FAILED'),
      });
    }
  }
}
