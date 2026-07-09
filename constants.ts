export const BOARD_ROWS = 10;
export const BOARD_COLS = 5;
export const TOTAL_CELLS = BOARD_ROWS * BOARD_COLS; // 50

// Snakes: Key is head, value is tail (head > tail)
export const SNAKES: Record<number, number> = {
  49: 32,
  43: 29,
  28: 14,
};

// Ladders: Key is start, value is end (start < end)
export const LADDERS: Record<number, number> = {
  4: 7,
  12: 22,
  25: 36,
  34: 44,
  40: 41,
};

// Map cell index (1 to 50) to grid coordinates (row, col)
// row: 0 is bottom row, 4 is top row
// col: 0 is left-most, 9 is right-most
export interface GridPosition {
  row: number;
  col: number;
}

export function getGridPosition(cell: number): GridPosition {
  const adjustedCell = cell - 1;
  const row = Math.floor(adjustedCell / BOARD_COLS);
  const col = row % 2 === 0 ? adjustedCell % BOARD_COLS : (BOARD_COLS - 1) - (adjustedCell % BOARD_COLS);
  return { row, col };
}

// Get center coordinates of cell in percentage (0 to 100)
export interface PercentPosition {
  x: number; // percentage from left
  y: number; // percentage from top
}

export function getPercentPosition(cell: number): PercentPosition {
  if (cell <= 0) return { x: 10, y: 95 }; // Start position (virtual cell 0)
  if (cell > TOTAL_CELLS) cell = TOTAL_CELLS;

  const { row, col } = getGridPosition(cell);

  // Board image has thick wooden borders, adjusting the playable grid percentage
  const GRID_LEFT = 11;
  const GRID_RIGHT = 90;
  const GRID_TOP = 7;
  const GRID_BOTTOM = 92;

  const gridWidth = GRID_RIGHT - GRID_LEFT;
  const gridHeight = GRID_BOTTOM - GRID_TOP;

  return {
    x: GRID_LEFT + (col + 0.5) * (gridWidth / BOARD_COLS),
    y: GRID_TOP + ((BOARD_ROWS - 1 - row) + 0.5) * (gridHeight / BOARD_ROWS),
  };
}

export const MODERN_COLORS = [
  { name: 'Neon Blue', value: '#00F2FE', glow: '#00F2FE80' },
  { name: 'Neon Purple', value: '#BD00FF', glow: '#BD00FF80' },
  { name: 'Neon Green', value: '#39FF14', glow: '#39FF1480' },
  { name: 'Neon Coral', value: '#FF5E62', glow: '#FF5E6280' },
  { name: 'Neon Yellow', value: '#FFDE43', glow: '#FFDE4380' },
  { name: 'Neon Cyan', value: '#05FFC5', glow: '#05FFC580' },
];

export const AVATAR_ICONS = [
  '🤖', '👾', '👻', '🦊', '🐱', '🦖', '🐼', '🦄', '🦁', '🐸', '🐙', '⭐'
];

// Pengaturan Kecepatan Animasi Gaco (Pion)
export const ANIMATION_SPEED = {
  STEP_DELAY_MS: 500,         // Waktu jeda (milidetik) saat gaco melompat antar kotak. Ubah ke 600 untuk lebih lambat, atau 200 untuk lebih cepat.
  SPRING_FRICTION: 10,         // Gesekan animasi (semakin kecil = semakin membal)
  SPRING_TENSION: 10,         // Tarikan animasi (semakin besar = semakin cepat sampai)
  SNAKE_LADDER_DELAY_MS: 650, // Jeda dramatis (milidetik) sebelum gaco naik tangga atau turun ular
};
