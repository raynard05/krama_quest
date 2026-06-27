import io from 'socket.io-client';
import { GameState } from '../types';

export type NetworkEvent = 
  | { type: 'client_join_request'; socket: string; payload: { name: string; color: string; icon: string } }
  | { type: 'client_disconnected'; socket: string; playerId?: number }
  | { type: 'state_synced'; state: GameState }
  | { type: 'action_requested'; action: 'roll' | 'reset' | 'back' | 'ready'; playerId: number }
  | { type: 'join_result'; success: boolean; playerId?: number; error?: string }
  | { type: 'connection_status'; status: 'connected' | 'disconnected' | 'error'; error?: string }
  | { type: 'room_created'; roomCode: string };

class GameNetworkManager {
  private socket: any = null;
  private roomCode: string = '';
  private onEventCallback: (event: NetworkEvent) => void = () => {};

  registerListener(callback: (event: NetworkEvent) => void) {
    this.onEventCallback = callback;
  }

  // HOST: Register Room on Server
  startServer(serverUrl: string, password?: string) {
    this.closeAll();

    try {
      this.socket = io(serverUrl, {
        transports: ['websocket'],
        forceNew: true,
        timeout: 10000
      });

      this.socket.on('connect', () => {
        console.log('Host: Connected to central server');
        this.socket.emit('createRoom', { password });
      });

      this.socket.on('roomCreated', ({ roomCode }: { roomCode: string }) => {
        this.roomCode = roomCode;
        console.log('Host: Room created successfully with code:', roomCode);
        this.onEventCallback({
          type: 'room_created',
          roomCode
        });
      });

      this.socket.on('clientJoinRequest', ({ socketId, name, color, icon }: any) => {
        this.onEventCallback({
          type: 'client_join_request',
          socket: socketId,
          payload: { name, color, icon }
        });
      });

      this.socket.on('actionRequested', ({ action, playerId }: any) => {
        console.log(`[Socket] Host received actionRequested event from Server: "${action}" for Player ${playerId}`);
        this.onEventCallback({
          type: 'action_requested',
          action,
          playerId
        });
      });

      this.socket.on('clientDisconnected', ({ socketId, playerId }: any) => {
        this.onEventCallback({
          type: 'client_disconnected',
          socket: socketId,
          playerId
        });
      });

      this.socket.on('connect_error', (err: any) => {
        console.error('Host: Socket connection error:', err);
        this.onEventCallback({
          type: 'connection_status',
          status: 'error',
          error: `Gagal menyambung ke server: ${err.message}`
        });
      });

      this.socket.on('disconnect', () => {
        console.log('Host: Disconnected from central server');
        this.onEventCallback({
          type: 'connection_status',
          status: 'disconnected'
        });
      });
    } catch (e: any) {
      this.onEventCallback({
        type: 'connection_status',
        status: 'error',
        error: `Gagal: ${e?.message || e || 'Kesalahan tidak diketahui'}`
      });
    }
  }

  // HOST: Accept client and assign ID
  confirmClientJoin(socketId: string, playerId: number, success: boolean, error?: string) {
    if (this.socket && this.roomCode) {
      this.socket.emit('confirmJoin', {
        roomCode: this.roomCode,
        socketId,
        playerId,
        success,
        error
      });
    }
  }

  // HOST: Send game state update to all clients
  broadcastState(state: GameState) {
    if (this.socket && this.roomCode) {
      this.socket.emit('updateState', {
        roomCode: this.roomCode,
        state
      });
    }
  }

  // CLIENT: Connect to Room using Code
  connectToServer(serverUrl: string, roomCode: string, pass: string, myPlayerInfo: { name: string; color: string; icon: string }) {
    this.closeAll();
    this.roomCode = roomCode.toUpperCase().trim();

    try {
      this.socket = io(serverUrl, {
        transports: ['websocket'],
        forceNew: true,
        timeout: 10000
      });

      this.socket.on('connect', () => {
        console.log('Client: Connected to central server, joining room:', this.roomCode);
        this.socket.emit('joinRoom', {
          roomCode: this.roomCode,
          password: pass,
          name: myPlayerInfo.name,
          color: myPlayerInfo.color,
          icon: myPlayerInfo.icon
        });
      });

      this.socket.on('joinResponse', ({ success, playerId, error }: any) => {
        this.onEventCallback({
          type: 'join_result',
          success,
          playerId,
          error
        });
      });

      this.socket.on('stateSynced', ({ state }: any) => {
        this.onEventCallback({
          type: 'state_synced',
          state
        });
      });

      this.socket.on('connectionStatus', ({ status, message }: any) => {
        if (status === 'disconnected') {
          this.onEventCallback({
            type: 'connection_status',
            status: 'disconnected',
            error: message
          });
        }
      });

      this.socket.on('connect_error', (err: any) => {
        console.error('Client: Socket connection error:', err);
        this.onEventCallback({
          type: 'connection_status',
          status: 'error',
          error: `Gagal menyambung ke server: ${err.message}`
        });
      });

      this.socket.on('disconnect', () => {
        console.log('Client: Disconnected from central server');
        this.onEventCallback({
          type: 'connection_status',
          status: 'disconnected'
        });
      });
    } catch (err: any) {
      this.onEventCallback({
        type: 'connection_status',
        status: 'error',
        error: `Gagal menyambung: ${err.message}`
      });
    }
  }

  // CLIENT: Request action from Server
  requestAction(action: 'roll' | 'reset' | 'back' | 'ready', playerId: number) {
    if (this.socket && this.roomCode) {
      console.log(`[Socket] Client emitting requestAction: "${action}" for Player ${playerId}`);
      this.socket.emit('requestAction', {
        roomCode: this.roomCode,
        action,
        playerId
      });
    }
  }

  // Close socket
  closeAll() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.roomCode = '';
  }
}

export const GameNetwork = new GameNetworkManager();
