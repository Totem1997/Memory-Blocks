import { GridCell, Piece } from '../types';

export const PIECE_COLORS = {
  ruby: {
    name: 'ruby',
    primary: '#E11D48',
    top: '#FB7185',
    left: '#F43F5E',
    right: '#BE123C',
    bottom: '#9F1239',
  },
  tangerine: {
    name: 'tangerine',
    primary: '#F97316',
    top: '#FDBA74',
    left: '#FB923C',
    right: '#EA580C',
    bottom: '#C2410C',
  },
  gold: {
    name: 'gold',
    primary: '#EAB308',
    top: '#FDE047',
    left: '#FACC15',
    right: '#CA8A04',
    bottom: '#A16207',
  },
  emerald: {
    name: 'emerald',
    primary: '#10B981',
    top: '#6EE7B7',
    left: '#34D399',
    right: '#059669',
    bottom: '#047857',
  },
  sapphire: {
    name: 'sapphire',
    primary: '#3B82F6',
    top: '#93C5FD',
    left: '#60A5FA',
    right: '#2563EB',
    bottom: '#1D4ED8',
  },
  amethyst: {
    name: 'amethyst',
    primary: '#8B5CF6',
    top: '#C4B5FD',
    left: '#A78BFA',
    right: '#7C3AED',
    bottom: '#6D28D9',
  },
  magenta: {
    name: 'magenta',
    primary: '#D946EF',
    top: '#F0ABFC',
    left: '#E879F9',
    right: '#C026D3',
    bottom: '#A21CAF',
  },
  cyan: {
    name: 'cyan',
    primary: '#06B6D4',
    top: '#67E8F9',
    left: '#22D3EE',
    right: '#0891B2',
    bottom: '#0E7490',
  },
} as const;

export function getPieceStyles(colorName: string, fallbackColor: string) {
  const def = PIECE_COLORS[colorName as keyof typeof PIECE_COLORS];
  if (!def) return { backgroundColor: fallbackColor };
  return {
    backgroundColor: def.primary,
    borderTopColor: def.top,
    borderLeftColor: def.left,
    borderRightColor: def.right,
    borderBottomColor: def.bottom,
  };
}

export interface ShapeTemplate {
  shape: number[][];
  colorKey: keyof typeof PIECE_COLORS;
  weight: number;
  category: 'dot' | 'small' | 'bar' | 'block' | 'complex';
}

const SHAPE_TEMPLATES: ShapeTemplate[] = [
  // DOT (Rescue only, highly penalized natural spawn)
  { shape: [[1]], colorKey: 'tangerine', weight: 0.1, category: 'dot' },

  // SMALL BARS
  { shape: [[1, 1]], colorKey: 'emerald', weight: 3, category: 'small' },
  { shape: [[1], [1]], colorKey: 'emerald', weight: 3, category: 'small' },

  // BARS
  { shape: [[1, 1, 1]], colorKey: 'cyan', weight: 6, category: 'bar' },
  { shape: [[1], [1], [1]], colorKey: 'cyan', weight: 6, category: 'bar' },
  { shape: [[1, 1, 1, 1]], colorKey: 'sapphire', weight: 5, category: 'bar' },
  { shape: [[1], [1], [1], [1]], colorKey: 'sapphire', weight: 5, category: 'bar' },
  { shape: [[1, 1, 1, 1, 1]], colorKey: 'sapphire', weight: 3, category: 'bar' },
  { shape: [[1], [1], [1], [1], [1]], colorKey: 'sapphire', weight: 3, category: 'bar' },

  // BLOCKS
  { shape: [[1, 1], [1, 1]], colorKey: 'gold', weight: 7, category: 'block' },
  { shape: [[1, 1], [1, 1], [1, 1]], colorKey: 'ruby', weight: 3, category: 'block' },
  { shape: [[1, 1, 1], [1, 1, 1]], colorKey: 'ruby', weight: 3, category: 'block' },
  { shape: [[1, 1, 1], [1, 1, 1], [1, 1, 1]], colorKey: 'gold', weight: 1.5, category: 'block' },

  // COMPLEX (Corners, Ls, Ts)
  // 2x2 corners
  { shape: [[1, 1], [1, 0]], colorKey: 'emerald', weight: 4, category: 'complex' },
  { shape: [[1, 1], [0, 1]], colorKey: 'emerald', weight: 4, category: 'complex' },
  { shape: [[1, 0], [1, 1]], colorKey: 'emerald', weight: 4, category: 'complex' },
  { shape: [[0, 1], [1, 1]], colorKey: 'emerald', weight: 4, category: 'complex' },

  // 3x2 L-shape
  { shape: [[1, 0], [1, 0], [1, 1]], colorKey: 'amethyst', weight: 4, category: 'complex' },
  { shape: [[0, 1], [0, 1], [1, 1]], colorKey: 'amethyst', weight: 4, category: 'complex' },
  { shape: [[1, 1], [1, 0], [1, 0]], colorKey: 'amethyst', weight: 4, category: 'complex' },
  { shape: [[1, 1], [0, 1], [0, 1]], colorKey: 'amethyst', weight: 4, category: 'complex' },
  { shape: [[1, 1, 1], [1, 0, 0]], colorKey: 'amethyst', weight: 3, category: 'complex' },
  { shape: [[1, 1, 1], [0, 0, 1]], colorKey: 'amethyst', weight: 3, category: 'complex' },
  { shape: [[1, 0, 0], [1, 1, 1]], colorKey: 'amethyst', weight: 3, category: 'complex' },
  { shape: [[0, 0, 1], [1, 1, 1]], colorKey: 'amethyst', weight: 3, category: 'complex' },

  // Big 3x3 L-shape
  { shape: [[1, 0, 0], [1, 0, 0], [1, 1, 1]], colorKey: 'amethyst', weight: 3, category: 'complex' },
  { shape: [[0, 0, 1], [0, 0, 1], [1, 1, 1]], colorKey: 'amethyst', weight: 3, category: 'complex' },
  { shape: [[1, 1, 1], [1, 0, 0], [1, 0, 0]], colorKey: 'amethyst', weight: 3, category: 'complex' },
  { shape: [[1, 1, 1], [0, 0, 1], [0, 0, 1]], colorKey: 'amethyst', weight: 3, category: 'complex' },

  // 3x2 T-shape
  { shape: [[1, 1, 1], [0, 1, 0]], colorKey: 'amethyst', weight: 3, category: 'complex' },
  { shape: [[0, 1, 0], [1, 1, 1]], colorKey: 'amethyst', weight: 3, category: 'complex' },
  { shape: [[1, 0], [1, 1], [1, 0]], colorKey: 'amethyst', weight: 3, category: 'complex' },
  { shape: [[0, 1], [1, 1], [0, 1]], colorKey: 'amethyst', weight: 3, category: 'complex' },
];

export function canPlacePiece(
  board: (GridCell | null)[][],
  piece: Piece,
  startRow: number,
  startCol: number
): boolean {
  const height = piece.shape.length;
  const width = piece.shape[0].length;

  if (startRow < 0 || startCol < 0 || startRow + height > 8 || startCol + width > 8) {
    return false;
  }

  for (let r = 0; r < height; r++) {
    for (let c = 0; c < width; c++) {
      if (piece.shape[r][c] === 1) {
        if (board[startRow + r][startCol + c] !== null) {
          return false;
        }
      }
    }
  }
  return true;
}

export function canPlaceAnywhere(board: (GridCell | null)[][], piece: Piece): boolean {
  for (let r = 0; r <= 8 - piece.height; r++) {
    for (let c = 0; c <= 8 - piece.width; c++) {
      if (canPlacePiece(board, piece, r, c)) {
        return true;
      }
    }
  }
  return false;
}

export function hasAnyValidMove(board: (GridCell | null)[][], pieces: (Piece | null)[]): boolean {
  const activePieces = pieces.filter((p): p is Piece => p !== null);
  if (activePieces.length === 0) return true;

  for (const piece of activePieces) {
    if (canPlaceAnywhere(board, piece)) {
      return true;
    }
  }
  return false;
}

export const GAME_FEEL_CONFIG = {
  BABY_PHASE_TURNS: 6,
  POOL_SIZE: 50,
  SHORTLIST_SIZE: 6,
  WEIGHTS: {
    LINE_CLEAR: 10000,      // Massive reward for pieces that instantly clear a line
    BUILD_MOMENTUM: 300,    // Reward for placing pieces into rows/cols that are nearly full
    HOLE_PENALTY: 600,      // Harsh penalty for creating 1x1 trapped holes
  }
};

function countBlocks(board: (GridCell | null)[][]): number {
  let count = 0;
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if (board[r][c] !== null) count++;
    }
  }
  return count;
}

function countShapeBlocks(shape: number[][]): number {
  let blocks = 0;
  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[0].length; c++) {
      if (shape[r][c] === 1) blocks++;
    }
  }
  return blocks;
}

function createPieceObj(shape: number[][], colorKey: string): Piece {
  return {
    id: `piece_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    shape,
    color: PIECE_COLORS[colorKey as keyof typeof PIECE_COLORS].primary,
    colorName: colorKey,
    width: shape[0].length,
    height: shape.length,
  };
}

function getRandomTemplate(allowedCategories?: string[]): ShapeTemplate {
  let pool = SHAPE_TEMPLATES;
  if (allowedCategories) {
    pool = SHAPE_TEMPLATES.filter(t => allowedCategories.includes(t.category));
  }
  const totalWeight = pool.reduce((sum, t) => sum + t.weight, 0);
  let roll = Math.random() * totalWeight;
  for (const t of pool) {
    if (roll <= t.weight) return t;
    roll -= t.weight;
  }
  return pool[0];
}

function countHoles(board: (GridCell | null)[][]): number {
  let holes = 0;
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if (board[r][c] === null) {
        const up = r === 0 || board[r - 1][c] !== null;
        const down = r === 7 || board[r + 1][c] !== null;
        const left = c === 0 || board[r][c - 1] !== null;
        const right = c === 7 || board[r][c + 1] !== null;
        if (up && down && left && right) holes++;
      }
    }
  }
  return holes;
}

function simPlace(board: (GridCell | null)[][], piece: Piece, r: number, c: number) {
  const simBoard = board.map(row => [...row]);
  for (let pr = 0; pr < piece.height; pr++) {
    for (let pc = 0; pc < piece.width; pc++) {
      if (piece.shape[pr][pc] === 1) {
        simBoard[r + pr][c + pc] = {
          color: piece.color,
          colorName: piece.colorName,
          id: 'sim',
          placedAt: 0,
        };
      }
    }
  }
  
  let linesCleared = 0;
  const rowsToClear = new Set<number>();
  const colsToClear = new Set<number>();
  
  for (let row = 0; row < 8; row++) {
    if (simBoard[row].every(cell => cell !== null)) rowsToClear.add(row);
  }
  for (let col = 0; col < 8; col++) {
    if (simBoard.every(row => row[col] !== null)) colsToClear.add(col);
  }
  
  linesCleared = rowsToClear.size + colsToClear.size;
  
  for (const row of rowsToClear) {
    for (let ci = 0; ci < 8; ci++) simBoard[row][ci] = null;
  }
  for (const col of colsToClear) {
    for (let ri = 0; ri < 8; ri++) simBoard[ri][col] = null;
  }

  return { newBoard: simBoard, linesCleared };
}

function scorePieceForLineClear(board: (GridCell | null)[][], piece: Piece): number {
  let maxScore = -Infinity;

  for (let r = 0; r <= 8 - piece.height; r++) {
    for (let c = 0; c <= 8 - piece.width; c++) {
      if (canPlacePiece(board, piece, r, c)) {
        const sim = simPlace(board, piece, r, c);
        let score = 0;

        // 1. Mission Accomplished: Cleared a line
        if (sim.linesCleared > 0) {
          score += sim.linesCleared * GAME_FEEL_CONFIG.WEIGHTS.LINE_CLEAR;
        }

        // 2. Mission Progress: Filling up almost-complete lines
        for (let pr = 0; pr < piece.height; pr++) {
          for (let pc = 0; pc < piece.width; pc++) {
            if (piece.shape[pr][pc] === 1) {
              const boardRow = r + pr;
              const boardCol = c + pc;
              
              // How full is the row and col in the NEW board?
              let rowFill = 0;
              for (let i = 0; i < 8; i++) if (sim.newBoard[boardRow][i] !== null) rowFill++;
              
              let colFill = 0;
              for (let i = 0; i < 8; i++) if (sim.newBoard[i][boardCol] !== null) colFill++;

              // Reward heavily for building lines up to 4, 5, 6, 7 blocks. 
              if (rowFill >= 4 && rowFill < 8) score += (rowFill * GAME_FEEL_CONFIG.WEIGHTS.BUILD_MOMENTUM);
              if (colFill >= 4 && colFill < 8) score += (colFill * GAME_FEEL_CONFIG.WEIGHTS.BUILD_MOMENTUM);
            }
          }
        }

        // 3. Penalty for isolated holes
        const holes = countHoles(sim.newBoard);
        score -= (holes * GAME_FEEL_CONFIG.WEIGHTS.HOLE_PENALTY);

        if (score > maxScore) maxScore = score;
      }
    }
  }
  return maxScore;
}

export function generatePieceTray(
  count: number = 3,
  currentBoard?: (GridCell | null)[][],
  turnsCount: number = 0
): Piece[] {
  
  if (!currentBoard) {
     // Return big chunks immediately for a satisfying start
     return Array.from({length: count}, (_, i) => {
       const t = getRandomTemplate(['bar', 'block']);
       return {
          ...createPieceObj(t.shape, t.colorKey),
          id: `piece_${Date.now()}_${i}`
       }
     });
  }

  const isBabyPhase = turnsCount <= GAME_FEEL_CONFIG.BABY_PHASE_TURNS;
  const candidateTrays: Piece[][] = [];

  for (let i = 0; i < GAME_FEEL_CONFIG.POOL_SIZE; i++) {
    let tray: Piece[] = [];
    
    if (isBabyPhase) {
      // Strictly chunks
      for (let j = 0; j < count; j++) {
        const t = getRandomTemplate(['bar', 'block']);
        tray.push(createPieceObj(t.shape, t.colorKey));
      }
    } else {
      // Normal generation
      for (let j = 0; j < count; j++) {
        const t = getRandomTemplate();
        tray.push(createPieceObj(t.shape, t.colorKey));
      }
    }
    candidateTrays.push(tray);
  }

  // Score the trays by finding the piece in the tray that best advances the "Line Clear Mission"
  const scoredTrays = candidateTrays.map(tray => {
     let trayScore = 0;
     let playableCount = 0;
     
     for (const piece of tray) {
        const pieceScore = scorePieceForLineClear(currentBoard, piece);
        if (pieceScore > -Infinity) {
          playableCount++;
          // The tray is primarily scored by the BEST piece it offers
          if (pieceScore > trayScore) trayScore = pieceScore;
        }
     }
     
     if (playableCount === 0) {
        return { tray, score: -Infinity }; // Dead tray
     }
     
     // Give a minor bonus if the tray has multiple playable options
     trayScore += playableCount * 100;
     
     return { tray, score: trayScore };
  });

  // Filter out completely dead trays
  const viableTrays = scoredTrays.filter(t => t.score > -Infinity);

  let finalTray: Piece[];

  if (viableTrays.length > 0) {
    viableTrays.sort((a, b) => b.score - a.score);
    const shortlistCount = Math.min(GAME_FEEL_CONFIG.SHORTLIST_SIZE, viableTrays.length);
    const shortlist = viableTrays.slice(0, shortlistCount);
    finalTray = shortlist[Math.floor(Math.random() * shortlist.length)].tray;
  } else {
    // Board is entirely dead for all 50 generated trays. 
    // We MUST find at least one piece that fits to be fair, or default to dots for game over.
    finalTray = [];
    const allFits = SHAPE_TEMPLATES.filter(t => canPlaceAnywhere(currentBoard, createPieceObj(t.shape, t.colorKey)));
    
    if (allFits.length > 0) {
      // Put the biggest piece that fits in slot 1
      allFits.sort((a,b) => countShapeBlocks(b.shape) - countShapeBlocks(a.shape));
      finalTray.push(createPieceObj(allFits[0].shape, allFits[0].colorKey));
      
      // Fill the rest with dots (smallest possible, likely fit or dead anyway)
      const dot = SHAPE_TEMPLATES.find(t => t.category === 'dot') || SHAPE_TEMPLATES[0];
      while(finalTray.length < count) {
        finalTray.push(createPieceObj(dot.shape, dot.colorKey));
      }
    } else {
      // 100% Dead board. Fill with dots to cleanly trigger game over on drag.
      const dot = SHAPE_TEMPLATES.find(t => t.category === 'dot') || SHAPE_TEMPLATES[0];
      finalTray = Array.from({length: count}, () => createPieceObj(dot.shape, dot.colorKey));
    }
  }

  // Shuffle the final tray so the "best" piece isn't predictably always in slot 1
  finalTray = finalTray.sort(() => Math.random() - 0.5);

  // Pick N distinct colors from PIECE_COLORS for the tray pieces
  const allColorKeys = Object.keys(PIECE_COLORS) as Array<keyof typeof PIECE_COLORS>;
  const shuffledColors = [...allColorKeys].sort(() => Math.random() - 0.5);

  // Re-assign IDs and unique vibrant colors
  return finalTray.map((p, idx) => {
     const assignedColorKey = shuffledColors[idx % shuffledColors.length];
     const colorObj = PIECE_COLORS[assignedColorKey];
     return {
       ...p,
       color: colorObj.primary,
       colorName: assignedColorKey,
       id: `piece_${Date.now()}_${Math.random().toString(36).substring(2, 7)}_${idx}`
     };
  });
}
