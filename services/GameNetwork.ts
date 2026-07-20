import io from 'socket.io-client';
import { GameState } from '../types';

export type NetworkEvent = 
  | { type: 'client_join_request'; socket: string; payload: { name: string; color: string; icon: string } }
  | { type: 'client_disconnected'; socket: string; playerId?: number }
  | { type: 'state_synced'; state: GameState }
  | { type: 'action_requested'; action: 'roll' | 'reset' | 'back' | 'ready'; playerId: number }
  | { type: 'join_result'; success: boolean; playerId?: number; error?: string }
  | { type: 'connection_status'; status: 'connected' | 'disconnected' | 'error'; error?: string }
  | { type: 'room_created'; roomCode: string }
  // Minified payload events for gameadvanceonline
  | { type: 'relay_pj'; payload: any }
  | { type: 'relay_sync'; payload: any }
  | { type: 'relay_sc'; payload: any }
  | { type: 'relay_tu'; payload: any };

class GameNetworkManager {
  private socket: any = null;
  private roomCode: string = '';
  // Array of listeners - supports multiple components listening simultaneously
  private listeners: ((event: NetworkEvent) => void)[] = [];

  registerListener(callback: (event: NetworkEvent) => void) {
    if (!this.listeners.includes(callback)) {
      this.listeners.push(callback);
    }
  }

  unregisterListener(callback: (event: NetworkEvent) => void) {
    this.listeners = this.listeners.filter(cb => cb !== callback);
  }

  private emit(event: NetworkEvent) {
    this.listeners.forEach(cb => cb(event));
  }

  startServer(serverUrl: string, password?: string) {
    this.closeAll();
    
    let cleanedUrl = serverUrl.trim();
    if (!cleanedUrl.startsWith('http://') && !cleanedUrl.startsWith('https://')) {
      const isLocal = cleanedUrl.startsWith('localhost') || 
                      cleanedUrl.startsWith('192.168.') || 
                      cleanedUrl.startsWith('10.') || 
                      cleanedUrl.startsWith('172.');
      cleanedUrl = (isLocal ? 'http://' : 'https://') + cleanedUrl;
    }
    if (cleanedUrl.endsWith('/')) {
      cleanedUrl = cleanedUrl.slice(0, -1);
    }

    try {
      this.socket = io(cleanedUrl, {
        transports: ['polling', 'websocket'],
        forceNew: true,
        timeout: 10000,
        extraHeaders: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }
      });

      this.socket.on('connect', () => {
        console.log('Host: Connected to central server');
        this.socket.emit('createRoom', { password });
      });

      this.socket.on('roomCreated', ({ roomCode }: { roomCode: string }) => {
        this.roomCode = roomCode;
        console.log('Host: Room created successfully with code:', roomCode);
        this.emit({ type: 'room_created', roomCode });
      });

      this.socket.on('clientJoinRequest', ({ socketId, name, color, icon }: any) => {
        this.emit({ type: 'client_join_request', socket: socketId, payload: { name, color, icon } });
      });

      this.socket.on('actionRequested', ({ action, playerId }: any) => {
        console.log(`[Socket] Host received actionRequested: "${action}" for Player ${playerId}`);
        this.emit({ type: 'action_requested', action, playerId });
      });

      this.socket.on('clientDisconnected', ({ socketId, playerId }: any) => {
        this.emit({ type: 'client_disconnected', socket: socketId, playerId });
      });

      // Listen for Minified Relays
      this.socket.on('pj', (payload: any) => this.emit({ type: 'relay_pj', payload }));
      this.socket.on('sync', (payload: any) => this.emit({ type: 'relay_sync', payload }));
      this.socket.on('sc', (payload: any) => this.emit({ type: 'relay_sc', payload }));
      this.socket.on('tu', (payload: any) => this.emit({ type: 'relay_tu', payload }));

      this.socket.on('connect_error', (err: any) => {
        console.error('Host: Socket connection error:', err);
        this.emit({ type: 'connection_status', status: 'error', error: `Gagal menyambung ke server: ${err.message}` });
      });

      this.socket.on('disconnect', () => {
        console.log('Host: Disconnected from central server');
        this.emit({ type: 'connection_status', status: 'disconnected' });
      });
    } catch (e: any) {
      this.emit({ type: 'connection_status', status: 'error', error: `Gagal: ${e?.message || e || 'Kesalahan tidak diketahui'}` });
    }
  }

  // HOST: Accept client and assign ID
  confirmClientJoin(socketId: string, playerId: number, success: boolean, error?: string) {
    if (this.socket && this.roomCode) {
      this.socket.emit('confirmJoin', { roomCode: this.roomCode, socketId, playerId, success, error });
    }
  }

  // HOST: Send game state update to all clients
  broadcastState(state: GameState) {
    if (this.socket && this.roomCode) {
      this.socket.emit('updateState', { roomCode: this.roomCode, state });
    }
  }

  // CLIENT: Connect to Room using Code
  connectToServer(serverUrl: string, roomCode: string, pass: string, myPlayerInfo: { name: string; color: string; icon: string }) {
    this.closeAll();
    this.roomCode = roomCode.toUpperCase().trim();

    let cleanedUrl = serverUrl.trim();
    if (!cleanedUrl.startsWith('http://') && !cleanedUrl.startsWith('https://')) {
      const isLocal = cleanedUrl.startsWith('localhost') || 
                      cleanedUrl.startsWith('192.168.') || 
                      cleanedUrl.startsWith('10.') || 
                      cleanedUrl.startsWith('172.');
      cleanedUrl = (isLocal ? 'http://' : 'https://') + cleanedUrl;
    }
    if (cleanedUrl.endsWith('/')) {
      cleanedUrl = cleanedUrl.slice(0, -1);
    }

    try {
      this.socket = io(cleanedUrl, {
        transports: ['polling', 'websocket'],
        forceNew: true,
        timeout: 10000,
        extraHeaders: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }
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
        this.emit({ type: 'join_result', success, playerId, error });
      });

      this.socket.on('stateSynced', ({ state }: any) => {
        this.emit({ type: 'state_synced', state });
      });

      this.socket.on('connectionStatus', ({ status, message }: any) => {
        if (status === 'disconnected') {
          this.emit({ type: 'connection_status', status: 'disconnected', error: message });
        }
      });

      // Listen for Minified Relays
      this.socket.on('pj', (payload: any) => this.emit({ type: 'relay_pj', payload }));
      this.socket.on('sync', (payload: any) => this.emit({ type: 'relay_sync', payload }));
      this.socket.on('sc', (payload: any) => this.emit({ type: 'relay_sc', payload }));
      this.socket.on('tu', (payload: any) => this.emit({ type: 'relay_tu', payload }));

      this.socket.on('connect_error', (err: any) => {
        console.error('Client: Socket connection error:', err);
        this.emit({ type: 'connection_status', status: 'error', error: `Gagal menyambung ke server: ${err.message}` });
      });

      this.socket.on('disconnect', () => {
        console.log('Client: Disconnected from central server');
        this.emit({ type: 'connection_status', status: 'disconnected' });
      });
    } catch (err: any) {
      this.emit({ type: 'connection_status', status: 'error', error: `Gagal menyambung: ${err.message}` });
    }
  }

  // CLIENT: Request action from Server
  requestAction(action: 'roll' | 'reset' | 'back' | 'ready', playerId: number) {
    if (this.socket && this.roomCode) {
      console.log(`[Socket] Client emitting requestAction: "${action}" for Player ${playerId}`);
      this.socket.emit('requestAction', { roomCode: this.roomCode, action, playerId });
    }
  }

  // Send minified relay event to server (will be broadcast to other player in room)
  sendRelay(event: 'pj' | 'sync' | 'sc' | 'tu', payload: any) {
    if (this.socket) {
      this.socket.emit(event, payload);
    }
  }

  // Close socket and clear all listeners
  closeAll() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.roomCode = '';
    this.listeners = [];
  }
}

export const GameNetwork = new GameNetworkManager();
