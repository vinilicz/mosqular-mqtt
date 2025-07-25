import { Component, effect, input, model, output, signal } from '@angular/core';
import { Modal } from '../../../components/modal/modal';
import { SelectOption } from '../../../types/select-option.type';
import { Server } from '../../../types/server.type';
import { OrderListModule } from 'primeng/orderlist';
import { TranslatePipe } from '@ngx-translate/core';
import { Button, ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-servers-list-modal',
  imports: [
    Modal,
    OrderListModule,
    TranslatePipe,
    Button,
    ButtonModule,
    FormsModule,
  ],
  templateUrl: './servers-list-modal.html',
  styleUrl: './servers-list-modal.scss',
})
export class ServersListModal {
  visible = model(false);
  options = input<SelectOption<Server>[]>([]);

  list = signal<SelectOption<Server>[]>([]);
  save = output<Server[]>();

  constructor() {
    effect(() => {
      if (this.visible()) {
        this.list.set([...this.options()]);
      }
    });
  }

  onSave() {
    this.save.emit(this.list().map((item) => item.value));
    this.visible.set(false);
  }

  cancel() {
    this.visible.set(false);
  }
}
