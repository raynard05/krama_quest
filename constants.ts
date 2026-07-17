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
export const KOTAK_SOAL: number[] = [
  2, 5, 7, 8, 9, 11, 14, 15, 18, 20, 19,
  22, 23, 24, 26, 28, 30, 32, 34, 36, 38, 40,
  42, 44, 46, 48, 47, 46,
];

// Helper to determine if a cell contains a question
export function isKotakSoal(cell: number): boolean {
  if (cell <= 0 || cell >= 50) return false; // Start and End cells do not trigger questions
  return KOTAK_SOAL.includes(cell);
}

// Validation logic: "minimal 2 kata benar sudah dianggap benar"
// If target answer is 1 word, matches if user includes it.
// If target answer is >= 2 words, user must match at least 2 words.
export function checkAnswerCorrectness(userInput: string, correctAnswer: string): boolean {
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

    if (altWords.length === 1) {
      if (userWords.includes(altWords[0])) {
        return true;
      }
    } else {
      let matches = 0;
      for (const w of altWords) {
        if (userWords.includes(w)) {
          matches++;
        }
      }
      if (matches >= 2) {
        return true;
      }
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
    kunciJawaban: 'Dhahar/ Nedha',
    bobot: 3
  },
  {
    id: 'e2',
    tingkat: 'easy',
    pertanyaan: 'Basa ngokone tembung "sare" yaiku...',
    kunciJawaban: 'Turu',
    bobot: 3
  },
  {
    id: 'e3',
    tingkat: 'easy',
    pertanyaan: 'Basa ngokone tembung "tindak" yaiku...',
    kunciJawaban: 'Lunga',
    bobot: 3
  },
  {
    id: 'e4',
    tingkat: 'easy',
    pertanyaan: 'Basa ngokone tembung "mirsani" yaiku...',
    kunciJawaban: 'Ndelok Ndeleng',
    bobot: 3
  },
  {
    id: 'e5',
    tingkat: 'easy',
    pertanyaan: 'Basa kramane tembung "krungu" yaiku...',
    kunciJawaban: 'Miring/ Kepireng',
    bobot: 3
  },
  {
    id: 'e6',
    tingkat: 'easy',
    pertanyaan: 'Basa kramane tembung "njaluk" yaiku...',
    kunciJawaban: 'Nyuwun',
    bobot: 3
  },
  {
    id: 'e7',
    tingkat: 'easy',
    pertanyaan: 'Basa kramane tembung "turu" yaiku...',
    kunciJawaban: 'Sare Tilem',
    bobot: 3
  },
  {
    id: 'e8',
    tingkat: 'easy',
    pertanyaan: 'Basa ngokone tembung "lunga" (mangkat sekolah/kerja) yaiku...',
    kunciJawaban: 'Budhal',
    bobot: 3
  },
  {
    id: 'e9',
    tingkat: 'easy',
    pertanyaan: 'Basa kramane tembung "weruh / takon" yaiku...',
    kunciJawaban: 'Pirsa tanglet',
    bobot: 3
  },
  {
    id: 'e10',
    tingkat: 'easy',
    pertanyaan: 'Basa kramane tembung "njaluk ngapura" yaiku...',
    kunciJawaban: 'Sepura ngapura',
    bobot: 3
  },

  // --- MEDIUM QUESTIONS (10 Soal, Bobot: 3) ---
  {
    id: 'm1',
    tingkat: 'medium',
    pertanyaan: 'Ukara krama saka "Bapak arep lunga menyang ngendi?" yaiku...',
    kunciJawaban: 'Bapak badhe tindak dhateng pundi?',
    bobot: 3
  },
  {
    id: 'm2',
    tingkat: 'medium',
    pertanyaan: 'Ukara krama saka "Ibu arep mangan Lontong Kupang" yaiku...',
    kunciJawaban: 'Ibu badhe dhahar Lontong Kupang',
    bobot: 3
  },
  {
    id: 'm3',
    tingkat: 'medium',
    pertanyaan: '"Panjenengan punapa sampun …. pawarta menika?" Isinen titik-titik kasebut saengga dadi ukara kang jangkep!',
    kunciJawaban: 'Kepireng',
    bobot: 3
  },
  {
    id: 'm4',
    tingkat: 'medium',
    pertanyaan: '"Kula badhe …pirsa dhateng bapak guru" Isinen titik-titik kasebut saengga dadi ukara kang jangkep!',
    kunciJawaban: 'Nyuwun',
    bobot: 3
  },
  {
    id: 'm5',
    tingkat: 'medium',
    pertanyaan: 'Ukara ngoko saka "Kula badhe mirsani wayang" yaiku...',
    kunciJawaban: 'Aku arep ndeleng wayang',
    bobot: 3
  },
  {
    id: 'm6',
    tingkat: 'medium',
    pertanyaan: '"Ibnu nembe mirsani tv" Tulisen nganggo basa ngoko!',
    kunciJawaban: 'Ibnu lagi ndeleng tv',
    bobot: 3
  },
  {
    id: 'm7',
    tingkat: 'medium',
    pertanyaan: '"Simbah sampun …. Dereng?" isinen nganggo basa krama!',
    kunciJawaban: 'Simbah sampun dhahar dereng?',
    bobot: 3
  },
  {
    id: 'm8',
    tingkat: 'medium',
    pertanyaan: '"Panjenengan badhe … pundi?" Isinen titik-titik kasebut saengga dadi ukara kang jangkep!',
    kunciJawaban: 'Tindak',
    bobot: 3
  },
  {
    id: 'm9',
    tingkat: 'medium',
    pertanyaan: '"Aku didukani ibu" Ukara kasebut diowahi ing basa ngoko yaiku...',
    kunciJawaban: 'Aku dikandani ibu/ aku diwarahi ibu',
    bobot: 3
  },
  {
    id: 'm10',
    tingkat: 'medium',
    pertanyaan: '"Aku dhahar karo Adhik, dene Ibu nedha kalih Bapak" Ukara kasebut owahana nggunakake unggah-ungguh basa kang bener!',
    kunciJawaban: 'Aku mangan karo adik. Dene ibu dhahar kalihan/ kalih bapak.',
    bobot: 3
  },

  // --- HOTS QUESTIONS (5 Soal, Bobot: 8) ---
  {
    id: 'h1',
    tingkat: 'hots',
    pertanyaan: '"Pak Fahdi numpak becak menyang stasiun Sidoarjo" Tulisen nganggo basa krama kang trep!',
    kunciJawaban: 'Pak Fahdi nitih becak dhateng stasiun Sidoarjo',
    bobot: 8
  },
  {
    id: 'h2',
    tingkat: 'hots',
    pertanyaan: '"Budhe lunga ning Pantai Tlocor dina Minggu" Tulisen nganggo basa krama kang trep!',
    kunciJawaban: 'Budhe tindak dhateng Pantai Tlocor dina Minggu',
    bobot: 8
  },
  {
    id: 'h3',
    tingkat: 'hots',
    pertanyaan: '"Adik nyuwun jajan kue Lumpur dhateng ibu" Tulisen nganggo basa ngoko kang trep!',
    kunciJawaban: 'Adik njaluk jajan kue lumpur ning ibu',
    bobot: 8
  },
  {
    id: 'h4',
    tingkat: 'hots',
    pertanyaan: '"Pakdhe tuku urang lan bandeng ing pasar larangan" Tulisen nganggo basa krama kang trep!',
    kunciJawaban: 'Pakdhe mundhut urang lan bandheng dhateng peken larangan',
    bobot: 8
  },
  {
    id: 'h5',
    tingkat: 'hots',
    pertanyaan: '"Wiwit esuk kucinge Hari ora kersa dhahar" Tulisen nggunakake basa ngoko kang cetha!',
    kunciJawaban: 'Wiwit esuk kucinge Hari ora doyan mangan',
    bobot: 8
  }
];
