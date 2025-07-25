import { Injectable } from '@angular/core';
import { Server } from '../types/server.type';

@Injectable({
  providedIn: 'root',
})
export class AppStorage {
  private readonly SERVER_KEY = 'm:servers';

  getServers(): Server[] {
    const data = localStorage.getItem(this.SERVER_KEY);
    return this.safeParser(data) || [];
  }

  setServers(servers: Server[]) {
    localStorage.setItem(this.SERVER_KEY, JSON.stringify(servers));
  }

  addServer(server: Server) {
    const servers = this.getServers();
    servers.push(server);
    this.setServers(servers);
  }

  updateServer(server: Server) {
    const servers = this.getServers();
    const index = servers.findIndex((s) => s.id === server.id);
    if (index < 0) return false;
    servers[index] = server;
    this.setServers(servers);
    return true;
  }

  removeServer(serverId: string): boolean {
    const servers = this.getServers();
    const index = servers.findIndex((server) => server.id === serverId);
    if (index < 0) return false;

    servers.splice(index, 1);
    this.setServers(servers);
    return true;
  }

  clearServers() {
    localStorage.removeItem(this.SERVER_KEY);
  }

  private safeParser<T = any>(data?: any): T | null {
    if (!data) return null;
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  defaultServers(): Server[] {
    return [
      {
        id: '-1',
        name: 'Moquitto',
        host: 'test.mosquitto.org:8081',
        protocol: 'wss',
      },
      {
        id: '-2',
        name: 'HiveMQ',
        host: 'broker.hivemq.com:8884',
        protocol: 'wss',
      },
    ];
  }
}
