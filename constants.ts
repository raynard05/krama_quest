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
  if (cell <= 0) return { x: 3.5, y: 88 }; // Start position (virtual cell 0)
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

import { Soal } from './types';

// Daftar kotak (sel) yang akan memunculkan soal saat bidak mendarat di atasnya.
// Silakan tambah atau hapus angka di bawah ini untuk mengatur kotak mana saja yang mendapat soal.
export const KOTAK_SOAL = [
  // baris 1
  2, 3, 5, 6, 7, 9,
  // baris 2
  11, 13, 15, 16, 18, 19,
  // baris 3
  21, 22, 24, 26, 27, 30,
  // baris 4
  31, 32, 35, 36, 38, 39,
  // baris 5
  41, 42, 45, 46, 47, 48
];

// Helper to determine if a cell contains a question
export function isKotakSoal(cell: number): boolean {
  if (cell <= 0 || cell >= 50) return false;
  return KOTAK_SOAL.includes(cell);
}

// Validation logic: checks if userInput matches at least 'minMatch' words of the target answer
export function checkAnswerCorrectness(userInput: string, correctAnswer: string, minMatch: number = 1): boolean {
  if (!userInput) return false;

  const clean = (str: string) =>
    str.toLowerCase()
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, " ")
      .split(/\s+/)
      .filter(Boolean);

  const userWords = clean(userInput);
  const alternatives = correctAnswer.split('/').map(alt => clean(alt));

  for (const altWords of alternatives) {
    if (altWords.length === 0) continue;

    let matches = 0;
    for (const w of altWords) {
      if (userWords.includes(w)) {
        matches++;
      }
    }
    
    // Safety check: ensure minMatch is not greater than the total words in the answer
    const required = Math.min(minMatch, altWords.length);
    if (matches >= required) {
      return true;
    }
  }

  return false;
}

export const SOAL_BANK: Soal[] = [
  // --- EASY QUESTIONS (10 Soal, Bobot: 3) ---
  {
    id: 'e1',
    tingkat: 'easy',
    pertanyaan: 'Basa kramane tembung "mangan" yaiku...',
    kunciJawaban: 'Dhahar Nedha',
    bobot: 3,
    minimal_jawab_benar: 1
  },
  {
    id: 'e2',
    tingkat: 'easy',
    pertanyaan: 'Basa ngokone tembung "sare" yaiku...',
    kunciJawaban: 'Turu',
    bobot: 3,
    minimal_jawab_benar: 1
  },
  {
    id: 'e3',
    tingkat: 'easy',
    pertanyaan: 'Basa ngokone tembung "tindak" yaiku...',
    kunciJawaban: 'Lunga',
    bobot: 3,
    minimal_jawab_benar: 1
  },
  {
    id: 'e4',
    tingkat: 'easy',
    pertanyaan: 'Basa ngokone tembung "mirsani" yaiku...',
    kunciJawaban: 'Ndelok Ndeleng',
    bobot: 3,
    minimal_jawab_benar: 1
  },
  {
    id: 'e5',
    tingkat: 'easy',
    pertanyaan: 'Basa kramane tembung "krungu" yaiku...',
    kunciJawaban: 'Miring/ Kepireng',
    bobot: 3,
    minimal_jawab_benar: 1
  },
  {
    id: 'e6',
    tingkat: 'easy',
    pertanyaan: 'Basa kramane tembung "njaluk" yaiku...',
    kunciJawaban: 'Nyuwun',
    bobot: 3,
    minimal_jawab_benar: 1
  },
  {
    id: 'e7',
    tingkat: 'easy',
    pertanyaan: 'Basa kramane tembung "turu" yaiku...',
    kunciJawaban: 'Sare Tilem',
    bobot: 3,
    minimal_jawab_benar: 1
  },
  {
    id: 'e8',
    tingkat: 'easy',
    pertanyaan: 'Basa ngokone tembung "lunga" (mangkat sekolah/kerja) yaiku...',
    kunciJawaban: 'Budhal',
    bobot: 3,
    minimal_jawab_benar: 1
  },
  {
    id: 'e9',
    tingkat: 'easy',
    pertanyaan: 'Basa kramane tembung "weruh / takon" yaiku...',
    kunciJawaban: 'Pirsa tanglet',
    bobot: 3,
    minimal_jawab_benar: 1
  },
  {
    id: 'e10',
    tingkat: 'easy',
    pertanyaan: 'Basa kramane tembung "njaluk ngapura" yaiku...',
    kunciJawaban: 'Sepura ngapura',
    bobot: 3,
    minimal_jawab_benar: 1
  },

  // --- MEDIUM QUESTIONS (10 Soal, Bobot: 3) ---
  {
    id: 'm1',
    tingkat: 'medium',
    pertanyaan: 'Ukara krama saka "Bapak arep lunga menyang ngendi?" yaiku...',
    kunciJawaban: 'badhe tindak dhateng pundi',
    bobot: 3,
    minimal_jawab_benar: 2
  },
  {
    id: 'm2',
    tingkat: 'medium',
    pertanyaan: 'Ukara krama saka "Ibu arep mangan Lontong Kupang" yaiku...',
    kunciJawaban: 'badhe dhahar',
    bobot: 3,
    minimal_jawab_benar: 2
  },
  {
    id: 'm3',
    tingkat: 'medium',
    pertanyaan: '"Panjenengan punapa sampun …. pawarta menika?" Isinen titik-titik kasebut saengga dadi ukara kang jangkep!',
    kunciJawaban: 'Kepireng',
    bobot: 3,
    minimal_jawab_benar: 1
  },
  {
    id: 'm4',
    tingkat: 'medium',
    pertanyaan: '"Kula badhe …pirsa dhateng bapak guru" Isinen titik-titik kasebut saengga dadi ukara kang jangkep!',
    kunciJawaban: 'Nyuwun',
    bobot: 3,
    minimal_jawab_benar: 1
  },
  {
    id: 'm5',
    tingkat: 'medium',
    pertanyaan: 'Ukara ngoko saka "Kula badhe mirsani wayang" yaiku...',
    kunciJawaban: 'aku arep ndeleng',
    bobot: 3,
    minimal_jawab_benar: 2
  },
  {
    id: 'm6',
    tingkat: 'medium',
    pertanyaan: '"Ibnu nembe mirsani tv" Tulisen nganggo basa ngoko!',
    kunciJawaban: 'lagi ndeleng',
    bobot: 3,
    minimal_jawab_benar: 1
  },
  {
    id: 'm7',
    tingkat: 'medium',
    pertanyaan: '"Simbah sampun …. Dereng?" isinen nganggo basa krama!',
    kunciJawaban: 'dhahar',
    bobot: 3,
    minimal_jawab_benar: 1
  },
  {
    id: 'm8',
    tingkat: 'medium',
    pertanyaan: '"Panjenengan badhe … pundi?" Isinen titik-titik kasebut saengga dadi ukara kang jangkep!',
    kunciJawaban: 'Tindak',
    bobot: 3,
    minimal_jawab_benar: 1
  },
  {
    id: 'm9',
    tingkat: 'medium',
    pertanyaan: '"Aku didukani ibu" Ukara kasebut diowahi ing basa ngoko yaiku...',
    kunciJawaban: 'dikandani diwarahi ',
    bobot: 3,
    minimal_jawab_benar: 1
  },
  {
    id: 'm10',
    tingkat: 'medium',
    pertanyaan: '"Aku dhahar karo Adhik, dene Ibu nedha kalih Bapak" Ukara kasebut owahana nggunakake unggah-ungguh basa kang bener!',
    kunciJawaban: 'mangan dhahar kalihan kalih ',
    bobot: 3,
    minimal_jawab_benar: 2
  },

  // --- HOTS QUESTIONS (5 Soal, Bobot: 8) ---
  {
    id: 'h1',
    tingkat: 'hots',
    pertanyaan: '"Pak Fahdi numpak becak menyang stasiun Sidoarjo" Tulisen nganggo basa krama kang trep!',
    kunciJawaban: 'nitih dhateng nitih',
    bobot: 8,
    minimal_jawab_benar: 2
  },
  {
    id: 'h2',
    tingkat: 'hots',
    pertanyaan: '"Budhe lunga ning Pantai Tlocor dina Minggu" Tulisen nganggo basa krama kang trep!',
    kunciJawaban: 'tindak dhateng tindak ',
    bobot: 8,
    minimal_jawab_benar: 2
  },
  {
    id: 'h3',
    tingkat: 'hots',
    pertanyaan: '"Adik nyuwun jajan kue Lumpur dhateng ibu" Tulisen nganggo basa ngoko kang trep!',
    kunciJawaban: 'njaluk ning njaluk',
    bobot: 8,
    minimal_jawab_benar: 2
  },
  {
    id: 'h4',
    tingkat: 'hots',
    pertanyaan: '"Pakdhe tuku urang lan bandeng ing pasar larangan" Tulisen nganggo basa krama kang trep!',
    kunciJawaban: 'mundhut dhateng mundhut peken',
    bobot: 8,
    minimal_jawab_benar: 2
  },
  {
    id: 'h5',
    tingkat: 'hots',
    pertanyaan: '"Wiwit esuk kucinge Hari ora kersa dhahar" Tulisen nggunakake basa ngoko kang cetha!',
    kunciJawaban: 'ora doyan mangan',
    bobot: 8,
    minimal_jawab_benar: 2
  }
];
