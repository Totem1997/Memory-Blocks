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
  // Candidate generation
  CANDIDATE_SETS: 15, // How many 3-piece sets to generate and evaluate
  SIMULATION_BRANCHING: 3, // Max placements to recurse on per piece (prevents combinatorial explosion)
  
  // Board Scoring Weights
  WEIGHTS: {
    LINES_CLEARED: 2000,
    HOLE_PENALTY: -250, // 1x1 empty cell surrounded by blocks/walls
    ADJACENCY_REWARD: 10,
    CELL_EMPTY_REWARD: 15, // Reward for having fewer blocks on board (preserves open areas)
  },
  
  // Difficulty Progression (Turn thresholds)
  DIFFICULTY: {
    HONEYMOON: 3, // Turns 0-3: Pick the absolute best set
    EARLY: 12,    // Turns 4-12: High generosity
    MID: 25,      // Turns 13-25: Strategic decision making
    LATE: 40      // Turns 26-40: Fewer obvious solutions
    // 40+: End game, any solvable set
  }
};

function simulatePlacementAndClear(board: (GridCell | null)[][], piece: Piece, r: number, c: number) {
  const simBoard = board.map(row => [...row]);
  
  // Place piece
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

  // Clear lines
  const rowsToClear = new Set<number>();
  const colsToClear = new Set<number>();

  for (let row = 0; row < 8; row++) {
    if (simBoard[row].every(cell => cell !== null)) {
      rowsToClear.add(row);
    }
  }
  for (let col = 0; col < 8; col++) {
    let isFull = true;
    for (let row = 0; row < 8; row++) {
      if (simBoard[row][col] === null) {
        isFull = false;
        break;
      }
    }
    if (isFull) colsToClear.add(col);
  }

  const linesCleared = rowsToClear.size + colsToClear.size;

  if (linesCleared > 0) {
    for (const row of rowsToClear) {
      for (let ci = 0; ci < 8; ci++) simBoard[row][ci] = null;
    }
    for (const col of colsToClear) {
      for (let ri = 0; ri < 8; ri++) simBoard[ri][col] = null;
    }
  }

  return { newBoard: simBoard, linesCleared };
}

function evaluateBoardState(board: (GridCell | null)[][]): number {
  let score = 0;
  let emptyCells = 0;
  let holes = 0;
  let adjacency = 0;

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if (board[r][c] === null) {
        emptyCells++;
        
        const up = r === 0 || board[r - 1][c] !== null;
        const down = r === 7 || board[r + 1][c] !== null;
        const left = c === 0 || board[r][c - 1] !== null;
        const right = c === 7 || board[r][c + 1] !== null;
        if (up && down && left && right) {
          holes++;
        }
      } else {
        if (r === 0 || board[r - 1][c] !== null) adjacency++;
        if (r === 7 || board[r + 1][c] !== null) adjacency++;
        if (c === 0 || board[r][c - 1] !== null) adjacency++;
        if (c === 7 || board[r][c + 1] !== null) adjacency++;
      }
    }
  }

  score += emptyCells * GENERATOR_CONFIG.WEIGHTS.CELL_EMPTY_REWARD;
  score += holes * GENERATOR_CONFIG.WEIGHTS.HOLE_PENALTY;
  score += adjacency * GENERATOR_CONFIG.WEIGHTS.ADJACENCY_REWARD;

  return score;
}

function getValidPlacements(board: (GridCell | null)[][], piece: Piece) {
  const placements = [];
  for (let r = 0; r <= 8 - piece.height; r++) {
    for (let c = 0; c <= 8 - piece.width; c++) {
      if (canPlacePiece(board, piece, r, c)) {
        placements.push({ r, c });
      }
    }
  }
  return placements;
}

function scorePieceSet(board: (GridCell | null)[][], pieces: Piece[]): { maxScore: number, isSolvable: boolean } {
  // Evaluate all valid sequences of placing the pieces
  const permutations: number[][] = [];
  if (pieces.length === 3) {
    permutations.push([0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]);
  } else if (pieces.length === 2) {
    permutations.push([0, 1], [1, 0]);
  } else if (pieces.length === 1) {
    permutations.push([0]);
  }

  let overallMaxScore = -Infinity;
  let isSolvable = false;

  for (const perm of permutations) {
    const p1 = pieces[perm[0]];
    const p2 = perm.length > 1 ? pieces[perm[1]] : null;
    const p3 = perm.length > 2 ? pieces[perm[2]] : null;

    // LEVEL 1
    const placements1 = getValidPlacements(board, p1);
    if (placements1.length === 0) continue; 
    
    let states1 = placements1.map(pos => {
      const { newBoard, linesCleared } = simulatePlacementAndClear(board, p1, pos.r, pos.c);
      const score = evaluateBoardState(newBoard) + (linesCleared * GENERATOR_CONFIG.WEIGHTS.LINES_CLEARED);
      return { board: newBoard, score, totalLinesCleared: linesCleared };
    });
    
    states1.sort((a, b) => b.score - a.score);
    states1 = states1.slice(0, GENERATOR_CONFIG.SIMULATION_BRANCHING);

    if (!p2) {
      isSolvable = true;
      if (states1[0].score > overallMaxScore) overallMaxScore = states1[0].score;
      continue;
    }

    // LEVEL 2
    for (const s1 of states1) {
      const placements2 = getValidPlacements(s1.board, p2);
      if (placements2.length === 0) continue;

      let states2 = placements2.map(pos => {
        const { newBoard, linesCleared } = simulatePlacementAndClear(s1.board, p2, pos.r, pos.c);
        const score = evaluateBoardState(newBoard) + ((s1.totalLinesCleared + linesCleared) * GENERATOR_CONFIG.WEIGHTS.LINES_CLEARED);
        return { board: newBoard, score, totalLinesCleared: s1.totalLinesCleared + linesCleared };
      });

      states2.sort((a, b) => b.score - a.score);
      states2 = states2.slice(0, GENERATOR_CONFIG.SIMULATION_BRANCHING);

      if (!p3) {
        isSolvable = true;
        if (states2.length > 0 && states2[0].score > overallMaxScore) {
          overallMaxScore = states2[0].score;
        }
        continue;
      }

      // LEVEL 3
      for (const s2 of states2) {
        const placements3 = getValidPlacements(s2.board, p3);
        if (placements3.length > 0) {
          isSolvable = true;
          let bestLeafScore = -Infinity;
          for (const pos of placements3) {
             const { newBoard, linesCleared } = simulatePlacementAndClear(s2.board, p3, pos.r, pos.c);
             const score = evaluateBoardState(newBoard) + ((s2.totalLinesCleared + linesCleared) * GENERATOR_CONFIG.WEIGHTS.LINES_CLEARED);
             if (score > bestLeafScore) bestLeafScore = score;
          }
          if (bestLeafScore > overallMaxScore) overallMaxScore = bestLeafScore;
        }
      }
    }
  }

  return { maxScore: overallMaxScore, isSolvable };
}

export function generatePieceTray(
  count: number = 3,
  currentBoard?: (GridCell | null)[][],
  turnsCount: number = 0
): Piece[] {
  const pieces: Piece[] = [];
  
  // 1. TURN 0: PERFECT START COMBO
  if (turnsCount === 0) {
    // Pick 3 random, distinct LARGE pieces (4 or 5 blocks) to give a satisfying and varied opening
    const largeTemplates = SHAPE_TEMPLATES.filter((t) => {
      let blocks = 0;
      t.shape.forEach(row => row.forEach(val => blocks += val));
      return blocks >= 4;
    });

    const shuffled = [...largeTemplates].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, Math.max(count, 3));

    for (let i = 0; i < count; i++) {
      const template = selected[i % selected.length];
      pieces.push({
        id: `piece_start_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        shape: template.shape,
        color: PIECE_COLORS[template.colorKey].primary,
        colorName: template.colorKey,
        width: template.shape[0].length,
        height: template.shape.length,
      });
    }
    
    for (let i = pieces.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pieces[i], pieces[j]] = [pieces[j], pieces[i]];
    }
    return pieces;
  }

  if (!currentBoard) {
    for (let i = 0; i < count; i++) pieces.push(generateRandomPiece());
    return pieces;
  }

  // 2. SET-BASED GENERATION
  const candidates: { pieces: Piece[]; maxScore: number; isSolvable: boolean }[] = [];
  
  for (let i = 0; i < GENERATOR_CONFIG.CANDIDATE_SETS; i++) {
    const candidatePieces: Piece[] = [];
    for (let p = 0; p < count; p++) {
      candidatePieces.push(generateRandomPiece());
    }
    candidates.push({ pieces: candidatePieces, ...scorePieceSet(currentBoard, candidatePieces) });
  }

  const solvableCandidates = candidates.filter(c => c.isSolvable);
  
  // If no sets are solvable, just hand them the best unsolvable attempt (or purely random)
  // Game over is inevitable, let it happen naturally.
  if (solvableCandidates.length === 0) {
    return candidates[0].pieces;
  }

  solvableCandidates.sort((a, b) => b.maxScore - a.maxScore);

  // Measure board congestion to adapt difficulty
  let emptyCells = 0;
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if (currentBoard[r][c] === null) emptyCells++;
    }
  }
  const isCongested = emptyCells < 32;

  let selectedIndex = 0;
  
  if (turnsCount <= GENERATOR_CONFIG.DIFFICULTY.HONEYMOON) {
    selectedIndex = 0; // Absolute best set found
  } else {
    // Dynamic difficulty: calculate how deep into the candidate pool we are willing to pull from
    let topPercentile = 0.2;
    
    if (turnsCount <= GENERATOR_CONFIG.DIFFICULTY.EARLY) {
      topPercentile = isCongested ? 0.1 : 0.3; // Be kinder if they are struggling early
    } else if (turnsCount <= GENERATOR_CONFIG.DIFFICULTY.MID) {
      topPercentile = isCongested ? 0.3 : 0.6; 
    } else if (turnsCount <= GENERATOR_CONFIG.DIFFICULTY.LATE) {
      topPercentile = isCongested ? 0.5 : 0.9;
    } else {
      topPercentile = 1.0; // Late game: can pick any solvable set
    }
    
    const maxIndex = Math.max(0, Math.floor((solvableCandidates.length - 1) * topPercentile));
    selectedIndex = Math.floor(Math.random() * (maxIndex + 1));
  }

  return solvableCandidates[selectedIndex].pieces;
}
