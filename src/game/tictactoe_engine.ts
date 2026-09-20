export type CellValue = ' ' | 'x' | 'o';

export interface GameState {
  board: CellValue[]; // 1-indexed conceptually: board[1] to board[9]
  pickedCells: number[];
  currentTurn: number; // 0 to 8
  isGameOver: boolean;
  winner: 'user1' | 'user2' | 'draw' | null;
  mode: 'pvp' | 'ai'; // 2-player or vs computer
  waitingForInput: boolean;
}

export function formatOctothrope(board: CellValue[]): string[] {
  const [_, one, two, three, four, five, six, seven, eight, nine] = board;
  return [
    "       *       *      ",
    `   ${one}   *   ${two}   *   ${three}   `,
    "       *       *      ",
    "* * * * * * * * * * * *",
    "       *       *      ",
    `   ${four}   *   ${five}   *   ${six}   `,
    "       *       *      ",
    "* * * * * * * * * * * *",
    "       *       *      ",
    `   ${seven}   *   ${eight}   *   ${nine}   `,
    "       *       *      "
  ];
}

export const INITIAL_GUIDE = [
  "1 | 2 | 3",
  "---------",
  "4 | 5 | 6",
  "---------",
  "7 | 8 | 9"
];

export function checkWinner(board: CellValue[]): 'user1' | 'user2' | null {
  const [_, one, two, three, four, five, six, seven, eight, nine] = board;

  const isXWin = (
    (one === 'x' && two === 'x' && three === 'x') ||
    (four === 'x' && five === 'x' && six === 'x') ||
    (seven === 'x' && eight === 'x' && nine === 'x') ||
    (one === 'x' && four === 'x' && seven === 'x') ||
    (two === 'x' && five === 'x' && eight === 'x') ||
    (three === 'x' && six === 'x' && nine === 'x') ||
    (one === 'x' && five === 'x' && nine === 'x') ||
    (three === 'x' && five === 'x' && seven === 'x')
  );

  if (isXWin) return 'user1';

  const isOWin = (
    (one === 'o' && two === 'o' && three === 'o') ||
    (four === 'o' && five === 'o' && six === 'o') ||
    (seven === 'o' && eight === 'o' && nine === 'o') ||
    (one === 'o' && four === 'o' && seven === 'o') ||
    (two === 'o' && five === 'o' && eight === 'o') ||
    (three === 'o' && six === 'o' && nine === 'o') ||
    (one === 'o' && five === 'o' && nine === 'o') ||
    (three === 'o' && five === 'o' && seven === 'o')
  );

  if (isOWin) return 'user2';

  return null;
}

export function createInitialState(mode: 'pvp' | 'ai' = 'pvp'): GameState {
  return {
    board: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '], // indices 0..9, 0 unused
    pickedCells: [],
    currentTurn: 0,
    isGameOver: false,
    winner: null,
    mode,
    waitingForInput: true
  };
}

/**
 * Intelligent minimax AI move selector for 'o'
 */
export function getBestAIMove(board: CellValue[], picked: number[]): number {
  const available = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(c => !picked.includes(c));
  if (available.length === 0) return 0;

  // 1. Can AI win in one move?
  for (const cell of available) {
    const copy = [...board];
    copy[cell] = 'o';
    if (checkWinner(copy) === 'user2') return cell;
  }

  // 2. Can player win in one move? Block it!
  for (const cell of available) {
    const copy = [...board];
    copy[cell] = 'x';
    if (checkWinner(copy) === 'user1') return cell;
  }

  // 3. Take center cell 5 if available
  if (available.includes(5)) return 5;

  // 4. Take corners
  const corners = [1, 3, 7, 9].filter(c => available.includes(c));
  if (corners.length > 0) {
    return corners[Math.floor(Math.random() * corners.length)];
  }

  // 5. Pick any available
  return available[Math.floor(Math.random() * available.length)];
}
