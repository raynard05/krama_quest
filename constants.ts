export const BOARD_ROWS = 5;
export const BOARD_COLS = 10;
export const TOTAL_CELLS = BOARD_ROWS * BOARD_COLS; // 50

// Snakes: Key is head, value is tail (head > tail)
export const SNAKES: Record<number, number> = {
  16: 6,
  28: 10,
  37: 18,
  45: 24,
  49: 30,
};

// Ladders: Key is start, value is end (start < end)
export const LADDERS: Record<number, number> = {
  3: 12,
  8: 26,
  15: 25,
  22: 44,
  31: 48,
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
  if (cell <= 0) return { x: 5, y: 90 }; // Start position (virtual cell 0)
  if (cell > TOTAL_CELLS) cell = TOTAL_CELLS;
  
  const { row, col } = getGridPosition(cell);
  return {
    x: (col + 0.5) * (100 / BOARD_COLS),
    y: ((BOARD_ROWS - 1 - row) + 0.5) * (100 / BOARD_ROWS),
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
