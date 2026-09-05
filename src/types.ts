/**
 * Types and interfaces for Memory Blocks
 */

export type AudienceType = 'adult' | 'child';

export type AppScreen = 'initializing' | 'home' | 'welcome' | 'choose-photo' | 'crop-photo' | 'reassurance' | 'creating' | 'game';

export interface GridCell {
  color: string;
  colorName: string;
  id: string;
  placedAt: number;
}

export interface Piece {
  id: string;
  shape: number[][];
  color: string;
  colorName: string;
  width: number;
  height: number;
}

export interface RewardItem {
  id: string;
  content: string;
}

export interface ThemeConfig {
  name: string;
  welcomeHeadline: string;
  welcomeSubtext: string;
  accentColor: string;
  bgDotColor: string;
  tagline: string;
}

export interface DraggingState {
  piece: Piece;
  pieceIndex: number;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  targetRow: number | null;
  targetCol: number | null;
  isValidPlacement: boolean;
  affectedLines: { rows: number[]; cols: number[] };
}

export interface ScorePopup {
  id: string;
  text: string;
  x: number;
  y: number;
  type: 'normal' | 'combo' | 'board-clear';
}
