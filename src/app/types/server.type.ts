import { WsProtocol } from './ws-protocol.type';

export type Server = {
  id: string;
  protocol: WsProtocol;
  host: string;
  name: string;
  username?: string;
  password?: string;
  clientId?: string;
};
