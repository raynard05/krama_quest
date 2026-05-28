export type PlayerType = 'human' | 'computer';

export interface Player {
  id: number;
  name: string;
  color: string;
  icon: string; // Emoji character or Lucide icon name
  position: number; // 0 = not started, 1 to 100 on board
  type: PlayerType;
  isWinner?: boolean;
  bounceCount?: number; // to count if they bounced back from 100
}

export type GameStatus = 'lobby' | 'playing' | 'victory';

export interface GameLog {
  id: string;
  playerId: number;
  playerName: string;
  playerColor: string;
  message: string;
  timestamp: Date;
  type: 'roll' | 'snake' | 'ladder' | 'win' | 'bounce';
}

export interface GameState {
  players: Player[];
  currentPlayerIndex: number;
  status: GameStatus;
  dieValue: number;
  isRolling: boolean;
  logs: GameLog[];
  winner: Player | null;
}

export type NetworkRole = 'local' | 'host' | 'client';
export type NetworkStatus = 'idle' | 'hosting' | 'connecting' | 'connected' | 'error';

export interface NetworkConfig {
  role: NetworkRole;
  status: NetworkStatus;
  hostIp: string;
  port: number;
  roomName: string;
  password?: string;
  localPlayerId?: number; // ID assigned to this client device
}

