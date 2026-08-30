const fs = require('fs');

const content = `import { GridCell, Piece } from '../types';

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

export interface ShapeTemplate {
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

export const GAME_FEEL_CONFIG = {
  BABY_PHASE_TURNS: 10,
  POOL_SIZE: 30,
  SHORTLIST_SIZE: 5,
  WEIGHTS: {
    LINE_CLEAR: 2000,
    PERIMETER_REDUCTION: 100, // Reward pieces that flatten edges/fill holes
    HOLE_PENALTY: 300,        // Penalize creating un-fillable gaps
  }
};

function createPieceObj(shape: number[][], colorKey: string): Piece {
  return {
    id: \`piece_\${Date.now()}_\${Math.random().toString(36).substring(2, 7)}\`,
    shape,
    color: PIECE_COLORS[colorKey as keyof typeof PIECE_COLORS].primary,
    colorName: colorKey,
    width: shape[0].length,
    height: shape.length,
  };
}

function isBasicShape(shape: number[][]): boolean {
  return shape.every(row => row.every(cell => cell === 1));
}

function getRandomTemplate(templates: ShapeTemplate[] = SHAPE_TEMPLATES): ShapeTemplate {
  const totalWeight = templates.reduce((sum, t) => sum + (t.weight || 3), 0);
  let roll = Math.random() * totalWeight;
  let selected = templates[0];
  for (const t of templates) {
    const w = t.weight || 3;
    if (roll <= w) {
      selected = t;
      break;
    }
    roll -= w;
  }
  return selected;
}

function generateRandomPiece(): Piece {
  const t = getRandomTemplate();
  return createPieceObj(t.shape, t.colorKey as string);
}

function generateRandomBasicPiece(): Piece {
  const basicTemplates = SHAPE_TEMPLATES.filter(t => isBasicShape(t.shape));
  const t = getRandomTemplate(basicTemplates);
  return createPieceObj(t.shape, t.colorKey as string);
}

function getComplementaryShape(shape: number[][]): ShapeTemplate | null {
  const shapeStr = JSON.stringify(shape);
  // Big 3x3 L shapes (needs 2x2 square)
  if (
    shapeStr === JSON.stringify([[1, 0, 0], [1, 0, 0], [1, 1, 1]]) ||
    shapeStr === JSON.stringify([[0, 0, 1], [0, 0, 1], [1, 1, 1]]) ||
    shapeStr === JSON.stringify([[1, 1, 1], [1, 0, 0], [1, 0, 0]]) ||
    shapeStr === JSON.stringify([[1, 1, 1], [0, 0, 1], [0, 0, 1]])
  ) {
    return SHAPE_TEMPLATES.find(t => JSON.stringify(t.shape) === JSON.stringify([[1, 1], [1, 1]])) || null;
  }
  
  // 3x2 L shapes (needs 1x2 or 2x1)
  if (
    shapeStr === JSON.stringify([[1, 0], [1, 0], [1, 1]]) ||
    shapeStr === JSON.stringify([[0, 1], [0, 1], [1, 1]])
  ) {
    return SHAPE_TEMPLATES.find(t => JSON.stringify(t.shape) === JSON.stringify([[1], [1]])) || null;
  }
  
  if (
    shapeStr === JSON.stringify([[1, 1, 1], [1, 0, 0]]) ||
    shapeStr === JSON.stringify([[1, 1, 1], [0, 0, 1]]) ||
    shapeStr === JSON.stringify([[1, 0, 0], [1, 1, 1]]) ||
    shapeStr === JSON.stringify([[0, 0, 1], [1, 1, 1]])
  ) {
    return SHAPE_TEMPLATES.find(t => JSON.stringify(t.shape) === JSON.stringify([[1, 1]])) || null;
  }

  // 2x2 corners (needs 1x1)
  if (
    shapeStr === JSON.stringify([[1, 1], [1, 0]]) ||
    shapeStr === JSON.stringify([[1, 1], [0, 1]]) ||
    shapeStr === JSON.stringify([[1, 0], [1, 1]]) ||
    shapeStr === JSON.stringify([[0, 1], [1, 1]])
  ) {
    return SHAPE_TEMPLATES.find(t => JSON.stringify(t.shape) === JSON.stringify([[1]])) || null;
  }

  return null;
}

function getPerimeter(board: (GridCell | null)[][]): number {
  let perimeter = 0;
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if (board[r][c] !== null) {
        if (r === 0 || board[r - 1][c] === null) perimeter++;
        if (r === 7 || board[r + 1][c] === null) perimeter++;
        if (c === 0 || board[r][c - 1] === null) perimeter++;
        if (c === 7 || board[r][c + 1] === null) perimeter++;
      }
    }
  }
  return perimeter;
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

function scorePieceForPattern(board: (GridCell | null)[][], piece: Piece, currentPerimeter: number): number {
  let maxScore = -Infinity;
  for (let r = 0; r <= 8 - piece.height; r++) {
    for (let c = 0; c <= 8 - piece.width; c++) {
      if (canPlacePiece(board, piece, r, c)) {
        const sim = simPlace(board, piece, r, c);
        const newPerimeter = getPerimeter(sim.newBoard);
        const holes = countHoles(sim.newBoard);
        
        // Positive delta means perimeter went down (board got flatter/cleaner)
        const deltaPerimeter = currentPerimeter - newPerimeter; 
        
        const score = (sim.linesCleared * GAME_FEEL_CONFIG.WEIGHTS.LINE_CLEAR) +
                      (deltaPerimeter * GAME_FEEL_CONFIG.WEIGHTS.PERIMETER_REDUCTION) -
                      (holes * GAME_FEEL_CONFIG.WEIGHTS.HOLE_PENALTY);
                      
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
     return Array.from({length: count}, () => generateRandomBasicPiece());
  }

  const isBabyPhase = turnsCount <= GAME_FEEL_CONFIG.BABY_PHASE_TURNS;

  const placeableTemplates = SHAPE_TEMPLATES.filter(t => {
    const dummy = createPieceObj(t.shape, t.colorKey as string);
    return canPlaceAnywhere(currentBoard, dummy);
  });

  if (placeableTemplates.length === 0) {
    // Board is completely dead. Just give 1x1s so run ends gracefully.
    const fb = SHAPE_TEMPLATES[0]; 
    return Array.from({length: count}, (_, i) => ({
      ...createPieceObj(fb.shape, fb.colorKey as string),
      id: \`piece_\${Date.now()}_\${i}\`
    }));
  }

  const currentPerimeter = getPerimeter(currentBoard);
  const candidateTrays: Piece[][] = [];
  
  for (let i = 0; i < GAME_FEEL_CONFIG.POOL_SIZE; i++) {
    let tray: Piece[] = [];
    
    if (isBabyPhase) {
      for(let j=0; j<count; j++) tray.push(generateRandomBasicPiece());
    } else {
      // "Shape Sorter" Pair Logic: 40% chance to offer a piece and its perfect complement
      if (Math.random() < 0.4 && count >= 2) {
         const t1 = getRandomTemplate();
         tray.push(createPieceObj(t1.shape, t1.colorKey as string));
         
         const complement = getComplementaryShape(t1.shape);
         if (complement) {
           tray.push(createPieceObj(complement.shape, complement.colorKey as string));
         } else {
           tray.push(generateRandomPiece());
         }
         
         while (tray.length < count) {
           tray.push(generateRandomPiece());
         }
      } else {
         for(let j=0; j<count; j++) tray.push(generateRandomPiece());
      }
    }
    
    // GUARANTEE PLAYABILITY: Ensure at least one piece in the tray can be placed.
    let valid = false;
    for (const p of tray) {
      if (canPlaceAnywhere(currentBoard, p)) {
        valid = true; break;
      }
    }
    
    if (!valid) {
       // Replace the first piece with a guaranteed placeable template
       const t = placeableTemplates[Math.floor(Math.random() * placeableTemplates.length)];
       tray[0] = createPieceObj(t.shape, t.colorKey as string);
       valid = true;
    }
    
    if (valid) {
      // Shuffle tray to hide the "injected" complementary pairs or fallback pieces
      tray = tray.sort(() => Math.random() - 0.5);
      candidateTrays.push(tray);
    }
  }

  // Score candidate trays by finding the piece in the tray that best "cleans" the board
  const scoredTrays = candidateTrays.map(tray => {
     let bestTrayScore = -Infinity;
     for (const piece of tray) {
        const pieceScore = scorePieceForPattern(currentBoard, piece, currentPerimeter);
        if (pieceScore > bestTrayScore) bestTrayScore = pieceScore;
     }
     return { tray, score: bestTrayScore };
  });

  // Pick one of the best trays to keep it organic
  scoredTrays.sort((a, b) => b.score - a.score);
  const shortlist = scoredTrays.slice(0, GAME_FEEL_CONFIG.SHORTLIST_SIZE);
  const selected = shortlist[Math.floor(Math.random() * shortlist.length)];
  
  // Guarantee unique React IDs across the final selected tray
  return selected.tray.map((p, idx) => ({
    ...p,
    id: \`piece_\${Date.now()}_\${Math.random().toString(36).substring(2, 7)}_\${idx}\`
  }));
}
`;

fs.writeFileSync('src/utils/pieces.ts', content);
