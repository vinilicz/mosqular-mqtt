import { Component, inject, model, OnInit, signal } from '@angular/core';
import { SelectModule } from 'primeng/select';
import { Server } from '../../../types/server.type';
import { AppStorage } from '../../../services/app-storage';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { SelectOption } from '../../../types/select-option.type';
import {
  UpdateServerModal,
  SavedServer,
} from '../update-server-modal/update-server-modal';
import { AppMqtt } from '../../../services/app-mqtt';
import { AsyncPipe } from '@angular/common';
import { ServersListModal } from '../servers-list-modal/servers-list-modal';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
  selector: 'app-connection-panel',
  imports: [
    SelectModule,
    FormsModule,
    ButtonModule,
    TranslatePipe,
    UpdateServerModal,
    ServersListModal,
    AsyncPipe,
    FloatLabelModule,
    InputNumberModule,
    ReactiveFormsModule,
  ],
  templateUrl: './connection-panel.html',
  styleUrl: './connection-panel.scss',
})
export class ConnectionPanel implements OnInit {
  protocolOptions = [{ label: 'wss', value: 'wss' }];
  serverOptions = signal<SelectOption<Server>[]>([]);

  selectedServer = model<Server | null>(null);
  selectedKeepAlive = model<number | null>(120);

  updateServer = model<Server>();
  updateServerModalVisible = model(false);
  serversListModalVisible = model(false);

  private readonly appStorage = inject(AppStorage);
  private readonly appMqtt = inject(AppMqtt);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly translateService = inject(TranslateService);
  private readonly messageService = inject(MessageService);

  isStarted$ = this.appMqtt.isStarted$;

  constructor() {
    if (this.sslDisabled()) {
      this.protocolOptions.push({ label: 'ws', value: 'ws' });
    }
  }

  private sslDisabled(): boolean {
    return window.location.protocol !== 'https:';
  }

  ngOnInit(): void {
    this.loadServers();
    this.setLastConnectedServer();
  }

  loadServers() {
    const servers = this.appStorage.getServers();
    this.serverOptions.set(
      servers.map((s) => ({
        label: s.name
          ? `${s.name} (${this.extractHost(s)})`
          : this.extractHost(s),
        value: s,
      })),
    );
  }

  setLastConnectedServer() {
    const id = this.appMqtt.getLastConnectedServer();
    if (!id) return;
    const option = this.serverOptions().find((o) => o.value.id === id);
    if (!option) return;
    this.selectedServer.set(option.value);
  }

  startMqtt() {
    const server = this.selectedServer();
    if (!server) return;
    const keepAlive = this.validateKeepAlive();
    this.appMqtt.start(server!, keepAlive!);
  }

  validateKeepAlive() {
    const keepAlive = this.selectedKeepAlive();
    if (keepAlive == null) return 120;
    if (keepAlive < 0) return 0;
    if (keepAlive > 1000) return 1000;
    return keepAlive;
  }

  stopMqtt() {
    const observers = this.appMqtt.getObservers();
    if (observers.length === 0) {
      this.appMqtt.stop();
      return;
    }

    this.confirmationService.confirm({
      message: this.translateService.instant('CLIENT.STOP_MQTT_DIALOG_MESSAGE'),
      header: this.translateService.instant('COMMON.CONFIRMATION_HEADER'),
      icon: 'pi pi-exclamation-circle',
      acceptButtonProps: { severity: 'danger' },
      rejectButtonProps: { severity: 'secondary' },
      acceptLabel: this.translateService.instant('COMMON.YES'),
      rejectLabel: this.translateService.instant('COMMON.NO'),
      accept: () => {
        this.appMqtt.stop();
      },
    });
  }

  addServer() {
    this.updateServer.set(undefined);
    this.updateServerModalVisible.set(true);
  }

  listServers() {
    this.serversListModalVisible.set(true);
  }

  extractHost(server: Server) {
    return server.host.match(/^([^:/]+)/)?.[0] ?? server.host;
  }

  confirmRemoveServer(server: Server, event: Event) {
    event.stopPropagation();
    this.confirmationService.confirm({
      message: 'Are you sure you want to remove this server?',
      header: this.translateService.instant('COMMON.CONFIRMATION_HEADER'),
      icon: 'pi pi-exclamation-circle',
      acceptButtonProps: { severity: 'danger' },
      rejectButtonProps: { severity: 'secondary' },
      acceptLabel: this.translateService.instant('COMMON.REMOVE'),
      rejectLabel: this.translateService.instant('COMMON.CANCEL'),
      accept: () => this.removeServer(server),
    });
  }

  removeServer(server: Server) {
    this.updateServer.set(server);
    this.appStorage.removeServer(server.id);
    this.loadServers();
    const selected = this.selectedServer();
    if (selected && selected.id === server.id) {
      this.selectedServer.set(null);
    }
  }

  editServer(server: Server, event: Event) {
    event.stopPropagation();
    this.updateServer.set(server);
    this.updateServerModalVisible.set(true);
  }

  onSaveServer(savedServer: SavedServer) {
    const conflictServer = this.serverOverlap(savedServer.server);

    if (conflictServer) {
      this.messageService.add({
        severity: 'error',
        summary: this.translateService.instant('CLIENT.SERVER_CONFLICT_TITLE'),
        detail: this.translateService.instant(
          'CLIENT.SERVER_CONFLICT_MESSAGE',
          {
            name: conflictServer.name,
          },
        ),
      });

      return;
    }

    if (savedServer.isNew) {
      this.appStorage.addServer(savedServer.server);
      this.loadServers();
    } else {
      this.appStorage.updateServer(savedServer.server);
      this.loadServers();
      const selected = this.selectedServer();
      if (selected) {
        this.selectedServer.set(
          this.serverOptions().find((o) => o.value.id === savedServer.server.id)
            ?.value || null,
        );
      }
    }
    this.updateServerModalVisible.set(false);
  }

  serverOverlap(server: Server): Server | undefined {
    const name = server.name;
    const host = server.host;
    const protocol = server.protocol;

    const options = this.serverOptions();
    return options.find(
      (o) =>
        o.value.id !== server.id &&
        (o.value.name === name ||
          (o.value.host === host && o.value.protocol === protocol)),
    )?.value;
  }

  onSaveServersList(servers: Server[]) {
    this.appStorage.setServers(servers);
    this.loadServers();
  }
}
