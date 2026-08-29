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

export function scoreBoard(board: (GridCell | null)[][]): number {
  let score = 0;
  
  // 1. Cleared lines are excellent
  let fullRows = 0;
  let fullCols = 0;
  for (let r = 0; r < 8; r++) {
    if (board[r].every(c => c !== null)) fullRows++;
  }
  for (let c = 0; c < 8; c++) {
    let isFull = true;
    for (let r = 0; r < 8; r++) {
      if (board[r][c] === null) {
        isFull = false;
        break;
      }
    }
    if (isFull) fullCols++;
  }
  score += (fullRows + fullCols) * 1000;

  // 2. Penalize 1x1 holes (empty cell surrounded by 4 blocks/walls)
  let holes = 0;
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if (board[r][c] === null) {
        const up = r === 0 || board[r - 1][c] !== null;
        const down = r === 7 || board[r + 1][c] !== null;
        const left = c === 0 || board[r][c - 1] !== null;
        const right = c === 7 || board[r][c + 1] !== null;
        if (up && down && left && right) {
          holes++;
        }
      }
    }
  }
  score -= holes * 100;

  // 3. Reward adjacency (compactness)
  let adjacency = 0;
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if (board[r][c] !== null) {
        if (r === 0 || board[r - 1][c] !== null) adjacency++;
        if (r === 7 || board[r + 1][c] !== null) adjacency++;
        if (c === 0 || board[r][c - 1] !== null) adjacency++;
        if (c === 7 || board[r][c + 1] !== null) adjacency++;
      }
    }
  }
  score += adjacency * 2;

  return score;
}

export function evaluatePieceFit(board: (GridCell | null)[][], piece: Piece): number {
  let maxScore = -Infinity;
  let canPlace = false;

  for (let r = 0; r <= 8 - piece.height; r++) {
    for (let c = 0; c <= 8 - piece.width; c++) {
      if (canPlacePiece(board, piece, r, c)) {
        canPlace = true;
        // Simulate board
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
        const score = scoreBoard(simBoard);
        if (score > maxScore) {
          maxScore = score;
        }
      }
    }
  }
  return canPlace ? maxScore : -Infinity;
}

export function generatePerfectPiece(currentBoard: (GridCell | null)[][]): Piece {
  let bestTemplates: typeof SHAPE_TEMPLATES = [];
  let bestScore = -Infinity;

  for (const template of SHAPE_TEMPLATES) {
    const testPiece: Piece = {
      id: 'test',
      shape: template.shape,
      color: PIECE_COLORS[template.colorKey].primary,
      colorName: template.colorKey,
      width: template.shape[0].length,
      height: template.shape.length,
    };
    const score = evaluatePieceFit(currentBoard, testPiece);
    if (score > bestScore) {
      bestScore = score;
      bestTemplates = [template];
    } else if (score === bestScore && score !== -Infinity) {
      bestTemplates.push(template);
    }
  }

  // If literally no piece fits (score is -Infinity), fallback
  if (bestTemplates.length === 0) {
    const fallbackTemplates = SHAPE_TEMPLATES.filter((t) => (t.weight || 3) >= 4);
    const selectedTemplate = fallbackTemplates[Math.floor(Math.random() * fallbackTemplates.length)] || SHAPE_TEMPLATES[0];
    return {
      id: `piece_perf_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      shape: selectedTemplate.shape,
      color: PIECE_COLORS[selectedTemplate.colorKey].primary,
      colorName: selectedTemplate.colorKey,
      width: selectedTemplate.shape[0].length,
      height: selectedTemplate.shape.length,
    };
  }

  const selectedTemplate = bestTemplates[Math.floor(Math.random() * bestTemplates.length)];
  return {
    id: `piece_perf_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    shape: selectedTemplate.shape,
    color: PIECE_COLORS[selectedTemplate.colorKey].primary,
    colorName: selectedTemplate.colorKey,
    width: selectedTemplate.shape[0].length,
    height: selectedTemplate.shape.length,
  };
}

export function generateHelpfulPiece(currentBoard: (GridCell | null)[][]): Piece {
  // Generate a few random candidates and pick the one with the best board score
  const candidates = [generateRandomPiece(), generateRandomPiece(), generateRandomPiece(), generateRandomPiece()];
  
  let bestPiece = candidates[0];
  let bestScore = -Infinity;

  for (const piece of candidates) {
    const score = evaluatePieceFit(currentBoard, piece);
    if (score > bestScore) {
      bestScore = score;
      bestPiece = piece;
    }
  }

  // If none of the candidates could be placed at all, just fall back to generating a small piece that fits
  if (bestScore === -Infinity) {
    const fallbackTemplates = SHAPE_TEMPLATES.filter((t) => (t.weight || 3) >= 4);
    for (const template of fallbackTemplates) {
      const testPiece: Piece = {
        id: `piece_fb_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        shape: template.shape,
        color: PIECE_COLORS[template.colorKey].primary,
        colorName: template.colorKey,
        width: template.shape[0].length,
        height: template.shape.length,
      };
      if (evaluatePieceFit(currentBoard, testPiece) !== -Infinity) {
        return testPiece;
      }
    }
  }

  return bestPiece;
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
    const selected = shuffled.slice(0, 3);

    for (const template of selected) {
      pieces.push({
        id: `piece_start_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        shape: template.shape,
        color: PIECE_COLORS[template.colorKey].primary,
        colorName: template.colorKey,
        width: template.shape[0].length,
        height: template.shape.length,
      });
    }
    
    // Shuffle the starter pieces slightly
    for (let i = pieces.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pieces[i], pieces[j]] = [pieces[j], pieces[i]];
    }
    return pieces;
  }

  let perfectCount = 1;
  let helpfulCount = 1;
  
  // Fair Dealer permanent logic: always provide a mix of highly useful and standard random pieces
  // 1 Perfect (exact gap fill/line clear), 1 Helpful (compact/good fit), and the rest Random.

  // Cap helpfulCount and perfectCount to the total requested pieces
  perfectCount = Math.min(perfectCount, count);
  helpfulCount = Math.min(helpfulCount, count - perfectCount);

  for (let i = 0; i < count; i++) {
    if (currentBoard) {
      if (i < perfectCount) {
        pieces.push(generatePerfectPiece(currentBoard));
      } else if (i < perfectCount + helpfulCount) {
        pieces.push(generateHelpfulPiece(currentBoard));
      } else {
        pieces.push(generateRandomPiece());
      }
    } else {
      pieces.push(generateRandomPiece());
    }
  }

  // Ensure at least one piece can be placed if board is provided and has space
  if (currentBoard && helpfulCount === 0 && perfectCount === 0) {
    const canAnyFit = pieces.some((p) => canPlaceAnywhere(currentBoard, p));
    if (!canAnyFit) {
      // Find a small piece that can fit
      const fallbackTemplates = SHAPE_TEMPLATES.filter((t) => (t.weight || 3) >= 4);
      for (const template of fallbackTemplates) {
        const testPiece: Piece = {
          id: `piece_fb_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          shape: template.shape,
          color: PIECE_COLORS[template.colorKey].primary,
          colorName: template.colorKey,
          width: template.shape[0].length,
          height: template.shape.length,
        };
        if (canPlaceAnywhere(currentBoard, testPiece)) {
          pieces[0] = testPiece;
          break;
        }
      }
    }
  }

  // Shuffle pieces so the helpful pieces aren't always in the same slots
  for (let i = pieces.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pieces[i], pieces[j]] = [pieces[j], pieces[i]];
  }

  return pieces;
}
