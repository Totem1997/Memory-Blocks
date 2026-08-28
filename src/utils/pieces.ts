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

  // 2x2 square
  { shape: [[1, 1], [1, 1]], colorKey: 'yellow', weight: 6 },

  // 2x2 corners (4 rotations)
  { shape: [[1, 1], [1, 0]], colorKey: 'lime', weight: 4 },
  { shape: [[1, 1], [0, 1]], colorKey: 'lime', weight: 4 },
  { shape: [[1, 0], [1, 1]], colorKey: 'lime', weight: 4 },
  { shape: [[0, 1], [1, 1]], colorKey: 'lime', weight: 4 },

  // 3x3 L-shape
  { shape: [[1, 0], [1, 0], [1, 1]], colorKey: 'purple', weight: 4 },
  { shape: [[0, 1], [0, 1], [1, 1]], colorKey: 'purple', weight: 4 },
  { shape: [[1, 1], [1, 0], [1, 0]], colorKey: 'purple', weight: 4 },
  { shape: [[1, 1], [0, 1], [0, 1]], colorKey: 'purple', weight: 4 },
  { shape: [[1, 1, 1], [1, 0, 0]], colorKey: 'purple', weight: 3 },
  { shape: [[1, 1, 1], [0, 0, 1]], colorKey: 'purple', weight: 3 },
  { shape: [[1, 0, 0], [1, 1, 1]], colorKey: 'purple', weight: 3 },
  { shape: [[0, 0, 1], [1, 1, 1]], colorKey: 'purple', weight: 3 },

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

export function generatePieceTray(
  count: number = 3,
  currentBoard?: (GridCell | null)[][]
): Piece[] {
  const pieces: Piece[] = [];
  for (let i = 0; i < count; i++) {
    pieces.push(generateRandomPiece());
  }

  // Ensure at least one piece can be placed if board is provided and has space
  if (currentBoard) {
    const canAnyFit = pieces.some((p) => canPlaceAnywhere(currentBoard, p));
    if (!canAnyFit) {
      // Find a small piece that can fit (e.g. 1x1 or 2x1)
      const fallbackTemplates = SHAPE_TEMPLATES.filter((t) => (t.weight || 3) >= 4);
      for (const template of fallbackTemplates) {
        const testPiece: Piece = {
          id: `piece_fb_${Date.now()}`,
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

  return pieces;
}
