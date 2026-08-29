import { GridCell, Piece } from '../types';

export const PIECE_COLORS = {
  purple: {
    name: 'purple',
    primary: '#A855F7',
    gradient: 'linear-gradient(135deg, #C084FC 0%, #9333EA 100%)',
    border: '#7E22CE',
    shadow: 'rgba(147, 51, 234, 0.4)',
  },
  yellow: {
    name: 'yellow',
    primary: '#FBBF24',
    gradient: 'linear-gradient(135deg, #FDE047 0%, #F59E0B 100%)',
    border: '#D97706',
    shadow: 'rgba(245, 158, 11, 0.4)',
  },
  coral: {
    name: 'coral',
    primary: '#F87171',
    gradient: 'linear-gradient(135deg, #FCA5A5 0%, #EF4444 100%)',
    border: '#DC2626',
    shadow: 'rgba(239, 68, 68, 0.4)',
  },
  cyan: {
    name: 'cyan',
    primary: '#38BDF8',
    gradient: 'linear-gradient(135deg, #7DD3FC 0%, #0284C7 100%)',
    border: '#0369A1',
    shadow: 'rgba(2, 132, 199, 0.4)',
  },
  blue: {
    name: 'blue',
    primary: '#60A5FA',
    gradient: 'linear-gradient(135deg, #93C5FD 0%, #3B82F6 100%)',
    border: '#1D4ED8',
    shadow: 'rgba(59, 130, 246, 0.4)',
  },
  lime: {
    name: 'lime',
    primary: '#A3E635',
    gradient: 'linear-gradient(135deg, #BEF264 0%, #84CC16 100%)',
    border: '#65A30D',
    shadow: 'rgba(132, 204, 22, 0.4)',
  },
  orange: {
    name: 'orange',
    primary: '#FB923C',
    gradient: 'linear-gradient(135deg, #FDBA74 0%, #F97316 100%)',
    border: '#EA580C',
    shadow: 'rgba(249, 115, 22, 0.4)',
  },
} as const;

interface ShapeTemplate {
  shape: number[][];
  colorKey: keyof typeof PIECE_COLORS;
  weight?: number;
}

const SHAPE_TEMPLATES: ShapeTemplate[] = [
  // 1x1 dot
  { shape: [[1]], colorKey: 'orange', weight: 4 },

  // 2x1 domino
  { shape: [[1, 1]], colorKey: 'lime', weight: 5 },
  { shape: [[1], [1]], colorKey: 'lime', weight: 5 },

  // 3x1 triomino
  { shape: [[1, 1, 1]], colorKey: 'cyan', weight: 6 },
  { shape: [[1], [1], [1]], colorKey: 'cyan', weight: 6 },

  // 4x1 tetromino
  { shape: [[1, 1, 1, 1]], colorKey: 'blue', weight: 4 },
  { shape: [[1], [1], [1], [1]], colorKey: 'blue', weight: 4 },

  // 5x1 pentomino
  { shape: [[1, 1, 1, 1, 1]], colorKey: 'blue', weight: 3 },
  { shape: [[1], [1], [1], [1], [1]], colorKey: 'blue', weight: 3 },

  // 2x2 square
  { shape: [[1, 1], [1, 1]], colorKey: 'yellow', weight: 6 },

  // 2x2 corners (4 rotations)
  { shape: [[1, 1], [1, 0]], colorKey: 'lime', weight: 4 },
  { shape: [[1, 1], [0, 1]], colorKey: 'lime', weight: 4 },
  { shape: [[1, 0], [1, 1]], colorKey: 'lime', weight: 4 },
  { shape: [[0, 1], [1, 1]], colorKey: 'lime', weight: 4 },

  // 3x2 / 2x3 L-shape
  { shape: [[1, 0], [1, 0], [1, 1]], colorKey: 'purple', weight: 4 },
  { shape: [[0, 1], [0, 1], [1, 1]], colorKey: 'purple', weight: 4 },
  { shape: [[1, 1], [1, 0], [1, 0]], colorKey: 'purple', weight: 4 },
  { shape: [[1, 1], [0, 1], [0, 1]], colorKey: 'purple', weight: 4 },
  { shape: [[1, 1, 1], [1, 0, 0]], colorKey: 'purple', weight: 3 },
  { shape: [[1, 1, 1], [0, 0, 1]], colorKey: 'purple', weight: 3 },
  { shape: [[1, 0, 0], [1, 1, 1]], colorKey: 'purple', weight: 3 },
  { shape: [[0, 0, 1], [1, 1, 1]], colorKey: 'purple', weight: 3 },

  // Big 3x3 L-shape
  { shape: [[1, 0, 0], [1, 0, 0], [1, 1, 1]], colorKey: 'purple', weight: 3 },
  { shape: [[0, 0, 1], [0, 0, 1], [1, 1, 1]], colorKey: 'purple', weight: 3 },
  { shape: [[1, 1, 1], [1, 0, 0], [1, 0, 0]], colorKey: 'purple', weight: 3 },
  { shape: [[1, 1, 1], [0, 0, 1], [0, 0, 1]], colorKey: 'purple', weight: 3 },

  // 3x2 T-shape
  { shape: [[1, 1, 1], [0, 1, 0]], colorKey: 'purple', weight: 3 },
  { shape: [[0, 1, 0], [1, 1, 1]], colorKey: 'purple', weight: 3 },
  { shape: [[1, 0], [1, 1], [1, 0]], colorKey: 'purple', weight: 3 },
  { shape: [[0, 1], [1, 1], [0, 1]], colorKey: 'purple', weight: 3 },

  // 2x3 block / 3x2 block
  { shape: [[1, 1], [1, 1], [1, 1]], colorKey: 'coral', weight: 2 },
  { shape: [[1, 1, 1], [1, 1, 1]], colorKey: 'coral', weight: 2 },

  // 3x3 square (rare)
  { shape: [[1, 1, 1], [1, 1, 1], [1, 1, 1]], colorKey: 'yellow', weight: 1 },
];

export function canPlacePiece(
  board: (GridCell | null)[][],
  piece: Piece,
  startRow: number,
  startCol: number
): boolean {
  const shape = piece.shape;
  const height = shape.length;
  const width = shape[0].length;

  if (startRow < 0 || startCol < 0 || startRow + height > 8 || startCol + width > 8) {
    return false;
  }

  for (let r = 0; r < height; r++) {
    for (let c = 0; c < width; c++) {
      if (shape[r][c] === 1) {
        const boardRow = startRow + r;
        const boardCol = startCol + c;
        if (board[boardRow][boardCol] !== null) {
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

export function generateRandomPiece(): Piece {
  // Weighted random selection
  const totalWeight = SHAPE_TEMPLATES.reduce((acc, t) => acc + (t.weight || 3), 0);
  let randomVal = Math.random() * totalWeight;

  let selectedTemplate = SHAPE_TEMPLATES[0];
  for (const template of SHAPE_TEMPLATES) {
    const w = template.weight || 3;
    if (randomVal <= w) {
      selectedTemplate = template;
      break;
    }
    randomVal -= w;
  }

  const colorConfig = PIECE_COLORS[selectedTemplate.colorKey];
  const shape = selectedTemplate.shape;

  return {
    id: `piece_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    shape,
    color: colorConfig.primary,
    colorName: selectedTemplate.colorKey,
    width: shape[0].length,
    height: shape.length,
  };
}

export const GENERATOR_CONFIG = {
  WEIGHTS: {
    BOARD_CLEAR: 100000,
    LINES_CLEARED: 2000,
    MULTI_CLEAR_BONUS: 1500, // per extra line cleared in one move
    CASCADE_BONUS: 2500, // consecutive clearing moves
    LARGE_PIECE_PLACEMENT: 100, // per block in the piece placed
    HOLE_PENALTY: -400,
  },
  DIFFICULTY: {
    HONEYMOON: 5,   // turns 0-5
    EARLY_MID: 15,  // turns 6-15
    MID: 30,        // turns 16-30
  },
  SELECTION_PERCENTILES: {
    HONEYMOON: 0.05, 
    EARLY_MID: 0.20, 
    MID: 0.40,       
    LATE: 0.70,      
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

function countPieceBlocks(piece: Piece): number {
  let blocks = 0;
  for (let r = 0; r < piece.height; r++) {
    for (let c = 0; c < piece.width; c++) {
      if (piece.shape[r][c] === 1) blocks++;
    }
  }
  return blocks;
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

function scoreSequence(board: (GridCell | null)[][], pieces: Piece[]): { score: number, isSolvable: boolean } {
  let maxScore = -Infinity;
  let isSolvable = false;
  
  function getPlacements(b: (GridCell | null)[][], p: Piece) {
     const pl = [];
     for (let r = 0; r <= 8 - p.height; r++) {
       for (let c = 0; c <= 8 - p.width; c++) {
         if (canPlacePiece(b, p, r, c)) {
           pl.push({ r, c });
         }
       }
     }
     
     // Evaluate each placement briefly to prune branches
     return pl.map(pos => {
         const sim = simPlace(b, p, pos.r, pos.c);
         return { pos, sim };
     }).sort((a, b) => {
         // Sort by clears first, then by fewest remaining blocks
         if (a.sim.linesCleared !== b.sim.linesCleared) {
             return b.sim.linesCleared - a.sim.linesCleared;
         }
         return countBlocks(a.sim.newBoard) - countBlocks(b.sim.newBoard);
     }).slice(0, 3); // Branch pruning: top 3 placements per piece
  }

  function evaluateLevel(currentBoard: (GridCell | null)[][], pieceIndex: number, currentScore: number, prevCleared: boolean) {
    if (pieceIndex >= pieces.length) {
      let holes = 0;
      let blocks = 0;
      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          if (currentBoard[r][c] === null) {
            const up = r === 0 || currentBoard[r - 1][c] !== null;
            const down = r === 7 || currentBoard[r + 1][c] !== null;
            const left = c === 0 || currentBoard[r][c - 1] !== null;
            const right = c === 7 || currentBoard[r][c + 1] !== null;
            if (up && down && left && right) holes++;
          } else {
             blocks++;
          }
        }
      }
      
      let finalScore = currentScore + (holes * GENERATOR_CONFIG.WEIGHTS.HOLE_PENALTY);
      if (blocks === 0) finalScore += GENERATOR_CONFIG.WEIGHTS.BOARD_CLEAR;
      
      if (finalScore > maxScore) maxScore = finalScore;
      return;
    }
    
    const placements = getPlacements(currentBoard, pieces[pieceIndex]);
    if (placements.length > 0) {
      isSolvable = true;
    } else {
      // Can't place this piece, score what we have but heavily penalize dead ends
      const penalty = -10000;
      if (currentScore + penalty > maxScore) maxScore = currentScore + penalty;
      return;
    }
    
    for (const p of placements) {
      let stepScore = p.sim.linesCleared * GENERATOR_CONFIG.WEIGHTS.LINES_CLEARED;
      if (p.sim.linesCleared > 1) {
        stepScore += (p.sim.linesCleared - 1) * GENERATOR_CONFIG.WEIGHTS.MULTI_CLEAR_BONUS;
      }
      if (prevCleared && p.sim.linesCleared > 0) {
        stepScore += GENERATOR_CONFIG.WEIGHTS.CASCADE_BONUS; // Cascade!
      }
      stepScore += countPieceBlocks(pieces[pieceIndex]) * GENERATOR_CONFIG.WEIGHTS.LARGE_PIECE_PLACEMENT;
      
      evaluateLevel(p.sim.newBoard, pieceIndex + 1, currentScore + stepScore, p.sim.linesCleared > 0);
    }
  }

  evaluateLevel(board, 0, 0, false);
  return { score: maxScore, isSolvable };
}

function scoreTray(board: (GridCell | null)[][], pieces: Piece[]) {
   let bestScore = -Infinity;
   let isSolvable = false;
   
   if (pieces.length === 3) {
       const perms = [
         [0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]
       ];
       for (const perm of perms) {
          const seq = [pieces[perm[0]], pieces[perm[1]], pieces[perm[2]]];
          const res = scoreSequence(board, seq);
          if (res.isSolvable) isSolvable = true;
          if (res.score > bestScore) bestScore = res.score;
       }
   } else if (pieces.length === 2) {
       const perms = [[0, 1], [1, 0]];
       for (const perm of perms) {
          const seq = [pieces[perm[0]], pieces[perm[1]]];
          const res = scoreSequence(board, seq);
          if (res.isSolvable) isSolvable = true;
          if (res.score > bestScore) bestScore = res.score;
       }
   } else if (pieces.length === 1) {
       const res = scoreSequence(board, pieces);
       if (res.isSolvable) isSolvable = true;
       if (res.score > bestScore) bestScore = res.score;
   }
   
   return { bestScore, isSolvable };
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

function getHelpfulPieces(board: (GridCell | null)[][]): Piece[] {
  const helpful: Piece[] = [];
  for (const t of SHAPE_TEMPLATES) {
    const p = createPieceObj(t.shape, t.colorKey);
    let clears = false;
    for (let r = 0; r <= 8 - p.height; r++) {
       for (let c = 0; c <= 8 - p.width; c++) {
          if (canPlacePiece(board, p, r, c)) {
             const sim = simPlace(board, p, r, c);
             if (sim.linesCleared > 0) {
                clears = true;
                break;
             }
          }
       }
       if (clears) break;
    }
    if (clears) helpful.push(p);
  }
  return helpful;
}

function getLargeFittingPieces(board: (GridCell | null)[][]): Piece[] {
  const fitting: Piece[] = [];
  for (const t of SHAPE_TEMPLATES) {
    const p = createPieceObj(t.shape, t.colorKey);
    if (countPieceBlocks(p) >= 5) {
      for (let r = 0; r <= 8 - p.height; r++) {
         for (let c = 0; c <= 8 - p.width; c++) {
            if (canPlacePiece(board, p, r, c)) {
               fitting.push(p);
               break; 
            }
         }
         if (fitting.includes(p)) break;
      }
    }
  }
  return fitting;
}

function getLargeStartTray(count: number): Piece[] {
    const largeTemplates = SHAPE_TEMPLATES.filter((t) => {
      let blocks = 0;
      t.shape.forEach(row => row.forEach(val => blocks += val));
      return blocks >= 4;
    });

    const shuffled = [...largeTemplates].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, Math.max(count, 3));
    const tray = [];
    for (let i = 0; i < count; i++) {
        const t = selected[i % selected.length];
        tray.push(createPieceObj(t.shape, t.colorKey));
    }
    return tray;
}

export function generatePieceTray(
  count: number = 3,
  currentBoard?: (GridCell | null)[][],
  turnsCount: number = 0
): Piece[] {
  
  if (turnsCount === 0 || (!currentBoard || countBlocks(currentBoard) === 0)) {
     return getLargeStartTray(count); 
  }

  const candidates: Piece[][] = [];
  const TOTAL_CANDIDATES = 40;
  
  const helpfulPieces = getHelpfulPieces(currentBoard);
  const largePieces = getLargeFittingPieces(currentBoard);
  const pool = [...helpfulPieces, ...largePieces];

  for (let i = 0; i < TOTAL_CANDIDATES; i++) {
     const tray: Piece[] = [];
     for (let j = 0; j < count; j++) {
         if (pool.length > 0 && Math.random() < 0.5) {
             const p = pool[Math.floor(Math.random() * pool.length)];
             tray.push({...p, id: `piece_${Date.now()}_${Math.random().toString(36).substring(2, 7)}_${j}`});
         } else {
             tray.push(generateRandomPiece());
         }
     }
     candidates.push(tray);
  }

  const scoredCandidates = candidates.map(tray => {
      const { bestScore, isSolvable } = scoreTray(currentBoard, tray);
      return { tray, score: bestScore, isSolvable };
  }).filter(c => c.isSolvable);

  if (scoredCandidates.length === 0) {
      const fb = SHAPE_TEMPLATES[0]; 
      return [createPieceObj(fb.shape, fb.colorKey)];
  }

  scoredCandidates.sort((a, b) => b.score - a.score);

  let percentile = GENERATOR_CONFIG.SELECTION_PERCENTILES.LATE;
  if (turnsCount <= GENERATOR_CONFIG.DIFFICULTY.HONEYMOON) {
      percentile = GENERATOR_CONFIG.SELECTION_PERCENTILES.HONEYMOON;
  } else if (turnsCount <= GENERATOR_CONFIG.DIFFICULTY.EARLY_MID) {
      percentile = GENERATOR_CONFIG.SELECTION_PERCENTILES.EARLY_MID;
  } else if (turnsCount <= GENERATOR_CONFIG.DIFFICULTY.MID) {
      percentile = GENERATOR_CONFIG.SELECTION_PERCENTILES.MID;
  }

  // Luck Injector: 5% chance to give a flawless tray in the late game
  if (turnsCount > GENERATOR_CONFIG.DIFFICULTY.HONEYMOON && Math.random() < 0.05) {
      percentile = 0.0;
  }

  const maxIndex = Math.max(0, Math.floor((scoredCandidates.length - 1) * percentile));
  const selectedIndex = Math.floor(Math.random() * (maxIndex + 1));
  const finalTray = scoredCandidates[selectedIndex].tray;
  
  // Shuffle pieces inside the selected tray to obscure the intended order
  for (let i = finalTray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [finalTray[i], finalTray[j]] = [finalTray[j], finalTray[i]];
  }

  return finalTray;
}
