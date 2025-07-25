import {
  Component,
  effect,
  ElementRef,
  input,
  model,
  OnDestroy,
  OnInit,
  output,
  signal,
  ViewChild,
} from '@angular/core';
import { Modal } from '../../../components/modal/modal';
import { InputTextModule } from 'primeng/inputtext';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { FluidModule } from 'primeng/fluid';
import { Subscription } from 'rxjs';
import { WsProtocol } from '../../../types/ws-protocol.type';
import { SelectModule } from 'primeng/select';
import { SelectOption } from '../../../types/select-option.type';
import { ButtonModule } from 'primeng/button';
import { Server } from '../../../types/server.type';
import { DividerModule } from 'primeng/divider';
import { genId } from '../../../utils/gen-id';

export type SavedServer = {
  server: Server;
  isNew: boolean;
};

@Component({
  selector: 'app-update-server-modal',
  imports: [
    Modal,
    ReactiveFormsModule,
    TranslatePipe,
    InputTextModule,
    FluidModule,
    SelectModule,
    ButtonModule,
    DividerModule,
  ],
  templateUrl: './update-server-modal.html',
  styleUrl: './update-server-modal.scss',
})
export class UpdateServerModal implements OnInit, OnDestroy {
  visible = model(false);

  protocolOptions: SelectOption<WsProtocol>[] = [
    { label: 'wss', value: 'wss' },
  ];

  baseServer = input<Server | undefined>(undefined);

  form = new FormGroup({
    id: new FormControl<string | undefined>(undefined),
    protocol: new FormControl<WsProtocol>('wss', [Validators.required]),
    name: new FormControl<string | undefined>(undefined),
    host: new FormControl<string | undefined>(undefined, [Validators.required]),
    clientId: new FormControl<string | undefined>(undefined, [
      Validators.maxLength(255),
    ]),
    username: new FormControl<string | undefined>(undefined, [
      Validators.maxLength(255),
    ]),
    password: new FormControl<string | undefined>(undefined, [
      Validators.maxLength(255),
    ]),
  });

  url = signal('');

  save = output<SavedServer>();

  formSub?: Subscription;

  @ViewChild('nameInput') nameInput?: ElementRef<HTMLInputElement>;

  constructor() {
    if (!this.isSsl()) {
      this.protocolOptions.push({ label: 'ws', value: 'ws' });
    }

    effect(() => {
      const visible = this.visible();
      if (!visible) {
        this.resetForm();
      } else {
        const baseServer = this.baseServer();
        if (baseServer) {
          this.form.patchValue(baseServer);
        }
        this.focus();
      }
    });
  }

  private isSsl() {
    return window.location.protocol === 'https:';
  }

  ngOnInit(): void {
    this.formSub = this.form.valueChanges.subscribe((value) => {
      this.onChangeForm(value as any);
    });
  }

  ngOnDestroy(): void {
    this.formSub?.unsubscribe();
  }

  focus() {
    setTimeout(() => {
      this.nameInput?.nativeElement.focus();
    }, 200);
  }

  onChangeForm(value: Partial<Server>) {
    const host = value.host;
    if (!host) {
      this.url.set('');
      return;
    }
    const protocol = `${value.protocol}://`;
    this.url.set(protocol + host);
  }

  onSave() {
    if (this.form.invalid) return;
    const value = this.form.value;

    const server: Server = {
      id: value.id || genId(),
      name: value.name!,
      protocol: value.protocol! as WsProtocol,
      host: value.host!,
      clientId: value.clientId || undefined,
      username: value.username || undefined,
      password: value.password || undefined,
    };

    this.save.emit({ server, isNew: !value.id });
  }

  cancel() {
    this.visible.set(false);
  }

  resetForm() {
    this.form.reset({ protocol: 'wss' });
  }
}
