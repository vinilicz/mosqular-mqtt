import { Component, effect, model, output, signal } from '@angular/core';
import { Modal } from '../../../../components/modal/modal';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SelectOption } from '../../../../types/select-option.type';
import { QoS } from '../../../../types/qos.type';
import { FluidModule } from 'primeng/fluid';
import { InputTextModule } from 'primeng/inputtext';
import { TranslatePipe } from '@ngx-translate/core';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { FormFooter } from '../../../../components/form-footer/form-footer';
import { genId } from '../../../../utils/gen-id';
import { MqttObserverModel } from '../../../../models/mqtt-observer.model';
import { Message } from '../../../../types/message.type';
import { CheckboxModule } from 'primeng/checkbox';

export type SavedMqttObserver = {
  observer: MqttObserverModel;
  isNew: boolean;
};

@Component({
  selector: 'app-update-observer-modal',
  imports: [
    Modal,
    FluidModule,
    InputTextModule,
    TranslatePipe,
    ReactiveFormsModule,
    SelectModule,
    ButtonModule,
    FormFooter,
    CheckboxModule,
  ],
  templateUrl: './update-observer-modal.html',
  styleUrl: './update-observer-modal.scss',
})
export class UpdateObserverModal {
  visible = model(false);

  qosOptions: SelectOption<QoS>[] = [
    { label: '0', value: 0 },
    { label: '1', value: 1 },
    { label: '2', value: 2 },
  ];

  form = new FormGroup({
    id: new FormControl(''),
    name: new FormControl('', [Validators.maxLength(255)]),
    topic: new FormControl('', [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(255),
    ]),
    qos: new FormControl<QoS>(0, [
      Validators.required,
      Validators.min(0),
      Validators.max(3),
    ]),
    ignoreRetained: new FormControl<boolean>(false, [Validators.required]),
  });

  save = output<SavedMqttObserver>();

  constructor() {
    effect(() => {
      if (!this.visible()) {
        this.form.reset({ qos: 0, ignoreRetained: false });
      }
    });
  }

  onSave() {
    if (!this.form.valid) return;
    const value = this.form.value;
    const observer = new MqttObserverModel({
      id: value.id || genId(),
      name: value.name || value.topic!,
      topic: value.topic!,
      qos: value.qos!,
      messages: signal<Message[]>([]),
      totalDiffMs: 0,
      averageDiff: signal('0'),
      ignoreRetained: value.ignoreRetained!,
      createdAt: new Date(),
    });
    this.save.emit({ observer, isNew: !!value.id });
  }

  cancel() {
    this.visible.set(false);
  }
}
