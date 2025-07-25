import { Component, model } from '@angular/core';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-modal',
  imports: [DialogModule],
  templateUrl: './modal.html',
  styleUrl: './modal.scss',
})
export class Modal {
  visible = model(false);
  resizable = model(false);
  draggable = model(false);
  title = model<string | undefined>();
}
