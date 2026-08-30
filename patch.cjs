const fs = require('fs');
const content = fs.readFileSync('src/utils/pieces.ts', 'utf8');
const targetStr = 'export const GENERATOR_CONFIG';
const index = content.indexOf(targetStr);
if (index === -1) {
  console.log('Target string not found!');
  process.exit(1);
}

const newContent = content.substring(0, index) + `export const GAME_FEEL_CONFIG = {
  // How we score the board after placing a piece
  WEIGHTS: {
    LINE_CLEAR: 1000,
    NEAR_MISS: 300,       // Bonus for rows/cols that are exactly 7/8 filled
    HOLE_PENALTY: 200,    // Penalty for each isolated 1x1 empty space created
    VALID_MOVES_LEFT: 5,  // Small bonus for keeping the board open
  },
  
  // Rubber-banding thresholds (0.0 to 1.0 occupancy)
  CLUTTER: {
    HIGH_THRESHOLD: 0.65, // If board is >65% full, panic mode (small pieces)
    LOW_THRESHOLD: 0.25,  // If board is <25% full, big pieces allowed
  },
  
  // Piece size generation weights based on clutter state
  // Array format: [Weight for Small (1-3 blocks), Medium (4), Large (5+)]
  SIZE_WEIGHTS: {
    EMPTY_BOARD:  [10, 40, 50], // Lots of big/medium pieces
    NORMAL_BOARD: [30, 50, 20], // Balanced
    CLUTTERED:    [70, 25,  5], // Mostly small pieces for survival
  },
  
  // How many candidate pieces to evaluate before picking the tray
  POOL_SIZE: 30,
  
  // We pick the final 3 pieces randomly from the top X best-scoring pieces
  SHORTLIST_SIZE: 8,
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

function countNearMisses(board: (GridCell | null)[][]): number {
  let count = 0;
  for (let r = 0; r < 8; r++) {
    let filled = 0;
    for (let c = 0; c < 8; c++) if (board[r][c] !== null) filled++;
    if (filled === 7) count++;
  }
  for (let c = 0; c < 8; c++) {
    let filled = 0;
    for (let r = 0; r < 8; r++) if (board[r][c] !== null) filled++;
    if (filled === 7) count++;
  }
  return count;
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

function generateWeightedPiece(weights: number[]): Piece {
   const smalls = SHAPE_TEMPLATES.filter(t => countShapeBlocks(t.shape) <= 3);
   const meds = SHAPE_TEMPLATES.filter(t => countShapeBlocks(t.shape) === 4);
   const larges = SHAPE_TEMPLATES.filter(t => countShapeBlocks(t.shape) >= 5);
   
   const totalWeight = weights[0] + weights[1] + weights[2];
   const roll = Math.random() * totalWeight;
   
   let selectedTemplates;
   if (roll < weights[0]) selectedTemplates = smalls;
   else if (roll < weights[0] + weights[1]) selectedTemplates = meds;
   else selectedTemplates = larges;
   
   if (selectedTemplates.length === 0) selectedTemplates = SHAPE_TEMPLATES;
   
   const t = selectedTemplates[Math.floor(Math.random() * selectedTemplates.length)];
   return createPieceObj(t.shape, t.colorKey as string);
}

function scorePiece(board: (GridCell | null)[][], piece: Piece): number {
  let maxScore = -Infinity;
  for (let r = 0; r <= 8 - piece.height; r++) {
    for (let c = 0; c <= 8 - piece.width; c++) {
      if (canPlacePiece(board, piece, r, c)) {
        const sim = simPlace(board, piece, r, c);
        const holes = countHoles(sim.newBoard);
        const nearMisses = countNearMisses(sim.newBoard);
        const openSpaces = 64 - countBlocks(sim.newBoard);
        
        const score = (sim.linesCleared * GAME_FEEL_CONFIG.WEIGHTS.LINE_CLEAR) +
                      (nearMisses * GAME_FEEL_CONFIG.WEIGHTS.NEAR_MISS) -
                      (holes * GAME_FEEL_CONFIG.WEIGHTS.HOLE_PENALTY) +
                      (openSpaces * GAME_FEEL_CONFIG.WEIGHTS.VALID_MOVES_LEFT);
                      
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
  
  if (!currentBoard || turnsCount === 0 || countBlocks(currentBoard) === 0) {
     const tray = [];
     for(let i=0; i < count; i++) tray.push(generateWeightedPiece(GAME_FEEL_CONFIG.SIZE_WEIGHTS.EMPTY_BOARD));
     return tray;
  }

  // 1. Determine Board Clutter
  const occupancy = countBlocks(currentBoard) / 64;
  let sizeWeights = GAME_FEEL_CONFIG.SIZE_WEIGHTS.NORMAL_BOARD;
  if (occupancy > GAME_FEEL_CONFIG.CLUTTER.HIGH_THRESHOLD) {
     sizeWeights = GAME_FEEL_CONFIG.SIZE_WEIGHTS.CLUTTERED;
  } else if (occupancy < GAME_FEEL_CONFIG.CLUTTER.LOW_THRESHOLD) {
     sizeWeights = GAME_FEEL_CONFIG.SIZE_WEIGHTS.EMPTY_BOARD;
  }

  // 2. Generate Candidate Pool
  const candidates: Piece[] = [];
  for (let i = 0; i < GAME_FEEL_CONFIG.POOL_SIZE; i++) {
     candidates.push(generateWeightedPiece(sizeWeights));
  }

  // 3. Score Candidates on current board
  const scoredCandidates = candidates.map(piece => {
      return { piece, score: scorePiece(currentBoard, piece) };
  });

  // Filter out completely unplayable pieces
  const playableCandidates = scoredCandidates.filter(c => c.score > -Infinity);

  // Solvability check: if board is dead, return fallback 1x1 pieces to trigger game over cleanly
  if (playableCandidates.length === 0) {
      const fb = SHAPE_TEMPLATES[0]; 
      const deadTray = [];
      for(let i=0; i<count; i++) deadTray.push(createPieceObj(fb.shape, fb.colorKey as string));
      return deadTray;
  }

  // 4. Sort and Shortlist
  playableCandidates.sort((a, b) => b.score - a.score);
  const shortlistCount = Math.min(GAME_FEEL_CONFIG.SHORTLIST_SIZE, playableCandidates.length);
  const shortlist = playableCandidates.slice(0, shortlistCount);

  // 5. Pick randomly from shortlist
  const finalTray: Piece[] = [];
  for (let i = 0; i < count; i++) {
      const randomIndex = Math.floor(Math.random() * shortlist.length);
      const selectedPiece = shortlist[randomIndex].piece;
      
      finalTray.push({
         ...selectedPiece, 
         id: \`piece_\${Date.now()}_\${Math.random().toString(36).substring(2, 7)}_\${i}\`
      });
  }

  return finalTray;
}
`;

fs.writeFileSync('src/utils/pieces.ts', newContent);
console.log('Successfully patched pieces.ts');
