import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Pause, Crown, Gift, Sparkles } from 'lucide-react';
import { AudienceType, GridCell, Piece, ScorePopup, ThemeConfig } from '../types';
import {
  canPlacePiece,
  generatePieceTray,
  hasAnyValidMove,
  PIECE_COLORS,
} from '../utils/pieces';
import {
  isRewardOnCooldown,
  getNextReward,
  startRewardCooldown,
} from '../utils/rewards';
import {
  playPickupSound,
  playPlaceSound,
  playLineClearSound,
  playFullBoardClearSound,
  playRewardSound,
  playGameOverSound,
} from '../utils/audio';
import { getStoredItem, setStoredItem } from '../utils/storage';
import { RewardModal } from './RewardModal';
import { PauseModal } from './PauseModal';
import { GameOverModal } from './GameOverModal';

interface GameBoardProps {
  photoSrc: string;
  audience: AudienceType;
  themeConfig: ThemeConfig;
  onChangeMemory: () => void;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  photoSrc,
  audience,
  themeConfig,
  onChangeMemory,
}) => {
  // 8x8 Board state (null = empty cell)
  const [board, setBoard] = useState<(GridCell | null)[][]>(() =>
    Array(8)
      .fill(null)
      .map(() => Array(8).fill(null))
  );

  // Available pieces in bottom tray (3 slots)
  const [trayPieces, setTrayPieces] = useState<(Piece | null)[]>([null, null, null]);

  // Turn tracking for piece generation difficulty
  const [turnsCount, setTurnsCount] = useState(0);

  // Scores
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [isNewBest, setIsNewBest] = useState(false);

  // Modals & Popups
  const [isPaused, setIsPaused] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [clearingLines, setClearingLines] = useState<{ rows: number[]; cols: number[] }>({
    rows: [],
    cols: [],
  });
  const [scorePopups, setScorePopups] = useState<ScorePopup[]>([]);

  // Reward state
  const [rewardPopupAvailable, setRewardPopupAvailable] = useState(false);
  const [currentReward, setCurrentReward] = useState<{ id: string; content: string } | null>(null);
  const [isRewardModalOpen, setIsRewardModalOpen] = useState(false);

  // Dragging state
  const [activeDragIndex, setActiveDragIndex] = useState<number | null>(null);
  const [dragPointerPos, setDragPointerPos] = useState<{ x: number; y: number } | null>(null);
  const [dragGhost, setDragGhost] = useState<{
    row: number;
    col: number;
    isValid: boolean;
    previewLines: { rows: number[]; cols: number[] };
  } | null>(null);

  // DOM Refs & Drag state
  const boardRef = useRef<HTMLDivElement>(null);
  const trayRef = useRef<HTMLDivElement>(null);
  const dragStartX = useRef<number>(0);
  const dragStartY = useRef<number>(0);
  const dragTouchBaseOffset = useRef<number>(0);
  const isTouchPointer = useRef<boolean>(false);

  // Load persistent best score on mount
  useEffect(() => {
    getStoredItem<number>('bestScore', 0).then((saved) => {
      setBestScore(saved);
    });
  }, []);

  // Initialize board and tray
  const startNewGame = useCallback(() => {
    const freshBoard = Array(8)
      .fill(null)
      .map(() => Array(8).fill(null));
    setBoard(freshBoard);
    setScore(0);
    setIsNewBest(false);
    setIsGameOver(false);
    setClearingLines({ rows: [], cols: [] });
    setScorePopups([]);
    setRewardPopupAvailable(false);
    setTurnsCount(0);
    const initialPieces = generatePieceTray(3, freshBoard, 0);
    setTrayPieces(initialPieces);
  }, []);

  useEffect(() => {
    startNewGame();
  }, [startNewGame]);

  // Update best score whenever current score surpasses it
  const addScore = useCallback(
    (points: number) => {
      setScore((prev) => {
        const next = prev + points;
        setBestScore((currentBest) => {
          if (next > currentBest) {
            setIsNewBest(true);
            setStoredItem('bestScore', next);
            return next;
          }
          return currentBest;
        });
        return next;
      });
    },
    []
  );

  // Add floating score popups
  const showScorePopup = useCallback((text: string, x: number, y: number, type: 'normal' | 'combo' | 'board-clear') => {
    const id = `popup_${Date.now()}_${Math.random()}`;
    setScorePopups((prev) => [...prev, { id, text, x, y, type }]);
    setTimeout(() => {
      setScorePopups((prev) => prev.filter((p) => p.id !== id));
    }, 1100);
  }, []);

  // Check board state after placement and line clears
  const evaluateBoardAfterPlacement = useCallback(
    async (currentBoard: (GridCell | null)[][], newlyPlacedCellsCount: number) => {
      // 1. Identify completed rows and columns
      const fullRows: number[] = [];
      const fullCols: number[] = [];

      for (let r = 0; r < 8; r++) {
        if (currentBoard[r].every((cell) => cell !== null)) {
          fullRows.push(r);
        }
      }

      for (let c = 0; c < 8; c++) {
        let isColFull = true;
        for (let r = 0; r < 8; r++) {
          if (currentBoard[r][c] === null) {
            isColFull = false;
            break;
          }
        }
        if (isColFull) {
          fullCols.push(c);
        }
      }

      const totalLines = fullRows.length + fullCols.length;

      // Base placement score (+10 per cell)
      const placementPoints = newlyPlacedCellsCount * 10;
      addScore(placementPoints);

      if (totalLines === 0) {
        // No lines cleared, just update board
        setBoard(currentBoard);
        return;
      }

      // Trigger line clearing animation
      setClearingLines({ rows: fullRows, cols: fullCols });
      playLineClearSound(totalLines);

      // Points calculation with combo multipliers
      let linePoints = 0;
      if (totalLines === 1) linePoints = 100;
      else if (totalLines === 2) linePoints = 250;
      else if (totalLines === 3) linePoints = 450;
      else if (totalLines >= 4) linePoints = 700 + (totalLines - 4) * 300;

      addScore(linePoints);

      // Show floating score
      if (boardRef.current) {
        const rect = boardRef.current.getBoundingClientRect();
        const popupText = totalLines > 1 ? `+${linePoints} COMBO x${totalLines}!` : `+${linePoints}`;
        showScorePopup(popupText, rect.width / 2, rect.height / 2, totalLines > 1 ? 'combo' : 'normal');
      }

      // Wait for clear animation (240ms) then clear cells
      setTimeout(async () => {
        const updatedBoard = currentBoard.map((row, rIdx) =>
          row.map((cell, cIdx) => {
            if (fullRows.includes(rIdx) || fullCols.includes(cIdx)) {
              return null;
            }
            return cell;
          })
        );

        setClearingLines({ rows: [], cols: [] });
        setBoard(updatedBoard);

        // Check if board is now COMPLETELY empty! (Section 22 & 23 requirement)
        let remainingFilledCells = 0;
        for (let r = 0; r < 8; r++) {
          for (let c = 0; c < 8; c++) {
            if (updatedBoard[r][c] !== null) {
              remainingFilledCells++;
            }
          }
        }

        if (remainingFilledCells === 0) {
          // COMPLETE BOARD CLEARED!
          playFullBoardClearSound();
          if (boardRef.current) {
            const rect = boardRef.current.getBoundingClientRect();
            showScorePopup('PERFECT CLEAR! +500', rect.width / 2, rect.height / 2 - 20, 'board-clear');
          }
          addScore(500);

          // Check reward cooldown (3 minutes, Section 28)
          const onCooldown = await isRewardOnCooldown();
          if (!onCooldown) {
            // Reward eligible! Show small reward notification popup (Section 23)
            playRewardSound();
            setRewardPopupAvailable(true);
          }
        }
      }, 240);
    },
    [addScore, showScorePopup]
  );

  // Trigger reward modal when player clicks OPEN REWARD
  const handleOpenReward = async () => {
    const reward = await getNextReward(audience);
    await startRewardCooldown();
    setCurrentReward(reward);
    setRewardPopupAvailable(false);
    setIsRewardModalOpen(true);
  };

  // Check Game Over conditions whenever board or tray pieces change
  useEffect(() => {
    const activePieces = trayPieces.filter((p): p is Piece => p !== null);
    if (activePieces.length === 0) {
      // All 3 pieces used! Refill tray with 3 new pieces
      const nextTurns = turnsCount + 1;
      setTurnsCount(nextTurns);
      const newPieces = generatePieceTray(3, board, nextTurns);
      setTrayPieces(newPieces);
      return;
    }

    // Check if any piece can be placed anywhere on current board
    const hasMove = hasAnyValidMove(board, trayPieces);
    if (!hasMove && !isGameOver) {
      // Delay slightly for natural pacing
      const timer = setTimeout(() => {
        playGameOverSound();
        setIsGameOver(true);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [board, trayPieces, isGameOver, turnsCount]);

  // Pointer / Touch Drag Handler (Ergonomic Block Blast progressive offset & reach)
  const handlePiecePointerDown = (
    e: React.PointerEvent,
    piece: Piece,
    pieceIndex: number
  ) => {
    if (isPaused || isGameOver) return;

    // Prevent default touch scrolling
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);

    playPickupSound();

    const isTouch = e.pointerType === 'touch' || e.pointerType === 'pen';
    isTouchPointer.current = isTouch;
    dragStartX.current = e.clientX;
    dragStartY.current = e.clientY;

    // Base offset: immediately lift piece above the finger so thumb doesn't obscure blocks or cells.
    // Provide slight extra clearance for taller pieces so the bottom row remains fully visible.
    const heightClearance = Math.max(0, (piece.height - 1) * 8);
    const baseOffset = (isTouch ? 80 : 45) + heightClearance;
    dragTouchBaseOffset.current = baseOffset;

    setActiveDragIndex(pieceIndex);
    setDragPointerPos({
      x: e.clientX,
      y: e.clientY - baseOffset,
    });
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (activeDragIndex === null) return;
    e.preventDefault();

    const currentRawX = e.clientX;
    const currentRawY = e.clientY;

    // 1. Progressive upward reach amplification (Block Blast vertical mechanic):
    // As the player drags upward from the tray toward the board, smoothly expand the distance
    // between finger touch point and the floating piece. This allows the player's thumb to remain
    // comfortably in the bottom portion of the screen while effortlessly reaching the top rows of the board.
    const deltaUp = Math.max(0, dragStartY.current - currentRawY);
    const vProgressiveFactor = isTouchPointer.current ? 0.8 : 0.45;
    const vProgressiveBoost = deltaUp * vProgressiveFactor;
    const effectiveVOffset = dragTouchBaseOffset.current + vProgressiveBoost;
    const currentY = currentRawY - effectiveVOffset;

    // 2. Dynamic horizontal reach amplification (Block Blast horizontal mechanic):
    // As the player drags left or right from where they picked up the piece,
    // expand the distance horizontally so the thumb doesn't have to reach the extreme
    // left and right physical edges of the mobile screen to place pieces in column 0 or 7.
    const deltaX = currentRawX - dragStartX.current;
    const hProgressiveFactor = isTouchPointer.current ? 0.35 : 0.18;
    const currentX = currentRawX + deltaX * hProgressiveFactor;

    setDragPointerPos({ x: currentX, y: currentY });

    if (!boardRef.current) return;

    const currentPiece = trayPieces[activeDragIndex];
    if (!currentPiece) return;

    const boardRect = boardRef.current.getBoundingClientRect();
    const cellSize = boardRect.width / 8;

    // Calculate snapped grid cell for the piece's top-left corner
    // Center of floating piece in board cell units (no rightward bias)
    const pieceCenterColFloat = (currentX - boardRect.left) / cellSize;
    const pieceCenterRowFloat = (currentY - boardRect.top) / cellSize;

    const targetCol = Math.round(pieceCenterColFloat - currentPiece.width / 2);
    const targetRow = Math.round(pieceCenterRowFloat - currentPiece.height / 2);

    let bestRow = targetRow;
    let bestCol = targetCol;
    let isValid = canPlacePiece(board, currentPiece, targetRow, targetCol);

    // Magnetic Proximity Snapping:
    // If the exact coordinate isn't valid, check adjacent positions within ~1.35 cell radius
    // for a valid placement closest to the hover position, preventing stubborn snapping fails.
    if (!isValid) {
      let minDistance = 1.35;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          const nr = targetRow + dr;
          const nc = targetCol + dc;
          if (canPlacePiece(board, currentPiece, nr, nc)) {
            const centerR = nr + currentPiece.height / 2;
            const centerC = nc + currentPiece.width / 2;
            const dist = Math.hypot(pieceCenterRowFloat - centerR, pieceCenterColFloat - centerC);
            if (dist < minDistance) {
              minDistance = dist;
              bestRow = nr;
              bestCol = nc;
              isValid = true;
            }
          }
        }
      }
    }

    // Calculate lines that would be completed if dropped here
    let previewLines = { rows: [] as number[], cols: [] as number[] };
    if (isValid) {
      const simBoard = board.map((r) => [...r]);
      for (let r = 0; r < currentPiece.height; r++) {
        for (let c = 0; c < currentPiece.width; c++) {
          if (currentPiece.shape[r][c] === 1) {
            simBoard[bestRow + r][bestCol + c] = {
              color: currentPiece.color,
              colorName: currentPiece.colorName,
              id: 'sim',
              placedAt: 0,
            };
          }
        }
      }
      const pRows: number[] = [];
      const pCols: number[] = [];
      for (let r = 0; r < 8; r++) {
        if (simBoard[r].every((cell) => cell !== null)) pRows.push(r);
      }
      for (let c = 0; c < 8; c++) {
        let isColFull = true;
        for (let r = 0; r < 8; r++) {
          if (simBoard[r][c] === null) {
            isColFull = false;
            break;
          }
        }
        if (isColFull) pCols.push(c);
      }
      previewLines = { rows: pRows, cols: pCols };
    }

    setDragGhost({
      row: bestRow,
      col: bestCol,
      isValid,
      previewLines,
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (activeDragIndex === null) return;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }

    const currentPiece = trayPieces[activeDragIndex];
    if (currentPiece && dragGhost && dragGhost.isValid) {
      // Place piece onto board!
      playPlaceSound();
      const updatedBoard = board.map((r) => [...r]);
      let placedCellsCount = 0;

      for (let r = 0; r < currentPiece.height; r++) {
        for (let c = 0; c < currentPiece.width; c++) {
          if (currentPiece.shape[r][c] === 1) {
            const bRow = dragGhost.row + r;
            const bCol = dragGhost.col + c;
            updatedBoard[bRow][bCol] = {
              color: currentPiece.color,
              colorName: currentPiece.colorName,
              id: `cell_${Date.now()}_${r}_${c}`,
              placedAt: Date.now(),
            };
            placedCellsCount++;
          }
        }
      }

      // Remove piece from tray
      setTrayPieces((prev) => {
        const next = [...prev];
        next[activeDragIndex] = null;
        return next;
      });

      // Evaluate lines, scores, and board completion
      evaluateBoardAfterPlacement(updatedBoard, placedCellsCount);
    }

    // Reset drag state
    setActiveDragIndex(null);
    setDragPointerPos(null);
    setDragGhost(null);
  };

  return (
    <div
      id="game-board-container"
      className="relative flex flex-col justify-between items-center w-full min-h-[100dvh] px-3 sm:px-4 pt-1.5 pb-6 sm:pb-8 max-w-md mx-auto select-none overflow-hidden touch-none"
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {/* Background soft dot decoration */}
      <div className="absolute top-2 right-3 grid grid-cols-4 gap-2 opacity-30 pointer-events-none">
        {Array.from({ length: 16 }).map((_, i) => (
          <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#E5D5C5]" />
        ))}
      </div>
      <div className="absolute bottom-4 left-3 grid grid-cols-4 gap-2 opacity-30 pointer-events-none">
        {Array.from({ length: 16 }).map((_, i) => (
          <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#E5D5C5]" />
        ))}
      </div>

      {/* TOP HEADER (Section 17 & UI Reference exact layout) */}
      <header className="flex items-center justify-between w-full pt-1 px-2">
        {/* Pause button: circular icon button on left */}
        <button
          id="btn-pause"
          onClick={() => setIsPaused(true)}
          className="w-11 h-11 rounded-full bg-white border border-[#E8DFC8] shadow-xs flex items-center justify-center text-[#2D2A26] hover:bg-[#F5EDE3] active:scale-95 transition-all cursor-pointer"
          aria-label="Pause game"
        >
          <Pause className="w-5 h-5 fill-current text-[#2D2A26]" />
        </button>

        {/* Center: SCORE */}
        <div className="flex flex-col items-center">
          <span className="text-[11px] font-bold tracking-widest text-[#8C7A6B] uppercase font-display">
            SCORE
          </span>
          <span className="text-3xl sm:text-4xl font-extrabold text-[#2D2A26] tracking-tight font-display leading-tight">
            {score.toLocaleString()}
          </span>
        </div>

        {/* Right: BEST with crown */}
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-1">
            <Crown className="w-3.5 h-3.5 text-[#F43F5E]" />
            <span className="text-[11px] font-bold tracking-widest text-[#8C7A6B] uppercase font-display">
              BEST
            </span>
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold text-[#F43F5E] tracking-tight font-display leading-tight">
            {bestScore.toLocaleString()}
          </span>
        </div>
      </header>

      {/* REWARD NOTIFICATION POPUP (Sections 23, 24, 30) */}
      {/* Appears ONLY when earned after clearing the entire board. Never permanently visible! */}
      <AnimatePresence>
        {rewardPopupAvailable && (
          <motion.div
            id="reward-notification-banner"
            initial={{ y: -30, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -20, opacity: 0, scale: 0.9 }}
            className="w-full my-2 p-3 bg-gradient-to-r from-[#FFF5EB] to-[#FFF0F5] border border-[#FBCFE8] rounded-2xl shadow-lg flex items-center justify-between z-30"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#F43F5E] text-white flex items-center justify-center shadow-xs">
                <Gift className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-[#2D2A26] font-display">
                  You earned a little reward!
                </div>
                <div className="text-[10px] text-[#8C7A6B]">
                  For completely clearing the board
                </div>
              </div>
            </div>

            <button
              id="btn-open-reward"
              onClick={handleOpenReward}
              className="py-1.5 px-3.5 bg-[#2D2A26] hover:bg-[#1A1816] text-white text-xs font-bold rounded-xl shadow-xs active:scale-95 transition-all font-display uppercase tracking-wider cursor-pointer"
            >
              OPEN REWARD
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN PLAY AREA (Board + Floating Pieces directly below) */}
      <div className="flex-1 flex flex-col items-center justify-center w-full my-auto gap-2.5 sm:gap-4">
        {/* Outer warm bezel container */}
        <div
          id="game-board-bezel"
          className="relative w-full aspect-square max-w-[370px] sm:max-w-[400px] p-2 sm:p-2.5 rounded-2xl sm:rounded-3xl bg-[#FAF5EE] shadow-[0_10px_35px_rgba(0,0,0,0.08)] border border-[#E9DFD2]"
        >
          {/* Inner 8x8 Game Grid Container */}
          <div
            ref={boardRef}
            id="game-board-grid"
            className="relative w-full h-full rounded-xl sm:rounded-2xl overflow-hidden"
          >
            {/* 1. PHOTO LAYER UNDERNEATH GRID (Continuous photo with softened filter ensuring white grid prominence) */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <img
                src={photoSrc}
                alt="Personal memory background"
                className="w-full h-full object-cover pointer-events-none select-none"
                style={{
                  filter: 'contrast(0.86) brightness(0.97) saturate(0.88)',
                }}
                referrerPolicy="no-referrer"
              />
              {/* Subtle tone stabilizer so white grid lines stay strikingly prominent across all photo types */}
              <div className="absolute inset-0 bg-stone-900/10 pointer-events-none mix-blend-multiply" />
            </div>

            {/* 2. STRAIGHT GRIDLINES LAYER */}
            <div className="absolute inset-0 z-10 pointer-events-none">
              {/* Vertical lines */}
              <div className="absolute inset-0 flex justify-evenly">
                {[...Array(7)].map((_, i) => (
                  <div key={`v-${i}`} className="w-[1px] h-full bg-white/20" />
                ))}
              </div>
              {/* Horizontal lines */}
              <div className="absolute inset-0 flex flex-col justify-evenly">
                {[...Array(7)].map((_, i) => (
                  <div key={`h-${i}`} className="h-[1px] w-full bg-white/20" />
                ))}
              </div>
              {/* Outer boundary */}
              <div className="absolute inset-0 border border-white/20" />
            </div>

            {/* 3. 8x8 INTERACTIVE & PLACED BLOCKS LAYER */}
            <div className="relative z-20 grid grid-cols-8 grid-rows-8 w-full h-full">
              {board.map((row, rIdx) =>
                row.map((cell, cIdx) => {
                  // Check if this cell is part of clearing lines
                  const isClearing =
                    clearingLines.rows.includes(rIdx) || clearingLines.cols.includes(cIdx);

                  // Check if this cell is highlighted by ghost drag
                  const isGhost =
                    dragGhost &&
                    dragGhost.isValid &&
                    activeDragIndex !== null &&
                    trayPieces[activeDragIndex] &&
                    rIdx >= dragGhost.row &&
                    rIdx < dragGhost.row + trayPieces[activeDragIndex]!.height &&
                    cIdx >= dragGhost.col &&
                    cIdx < dragGhost.col + trayPieces[activeDragIndex]!.width &&
                    trayPieces[activeDragIndex]!.shape[rIdx - dragGhost.row][cIdx - dragGhost.col] === 1;

                  // Check if this cell is in preview line that would clear
                  const isPreviewClear =
                    dragGhost &&
                    dragGhost.isValid &&
                    (dragGhost.previewLines.rows.includes(rIdx) ||
                      dragGhost.previewLines.cols.includes(cIdx));

                  const ghostPiece = activeDragIndex !== null ? trayPieces[activeDragIndex] : null;

                  return (
                    <div
                      key={`${rIdx}-${cIdx}`}
                      id={`cell-${rIdx}-${cIdx}`}
                      className="relative w-full h-full flex items-center justify-center pointer-events-none"
                    >
                      {/* Placed candy block tile */}
                      {cell !== null && (
                        <div
                          className={`block-tile w-full h-full transition-all duration-100 flex items-center justify-center
                            ${
                              isClearing
                                ? 'scale-110 brightness-150 transition-transform duration-200 shadow-xl z-20'
                                : 'z-10'
                            }
                          `}
                          style={{
                            background:
                              PIECE_COLORS[cell.colorName as keyof typeof PIECE_COLORS]?.gradient ||
                              cell.color,
                          }}
                        />
                      )}

                      {/* Ghost preview placement on empty cells */}
                      {isGhost && ghostPiece && cell === null && (
                        <div
                          className="w-full h-full opacity-75 animate-pulse-subtle block-tile-ghost z-10"
                          style={{
                            background:
                              PIECE_COLORS[ghostPiece.colorName as keyof typeof PIECE_COLORS]?.gradient ||
                              ghostPiece.color,
                          }}
                        />
                      )}

                      {/* Preview flash for lines that will complete */}
                      {isPreviewClear && (
                        <div className="absolute inset-[1px] bg-white/45 animate-pulse pointer-events-none" />
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Floating Score Popups */}
            <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
              {scorePopups.map((popup) => (
                <motion.div
                  key={popup.id}
                  initial={{ opacity: 1, scale: 0.7, y: 0 }}
                  animate={{ opacity: 0, scale: 1.25, y: -45 }}
                  transition={{ duration: 0.9, ease: 'easeOut' }}
                  style={{ left: popup.x - 60, top: popup.y - 20 }}
                  className={`absolute w-32 text-center font-black font-display text-lg sm:text-xl drop-shadow-md
                    ${popup.type === 'combo' ? 'text-[#F59E0B]' : popup.type === 'board-clear' ? 'text-[#E11D48]' : 'text-white'}
                  `}
                >
                  {popup.text}
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* DRAGGABLE PIECES (Moved closer to board, no enclosing box) */}
        <div
          ref={trayRef}
          id="piece-tray"
          className="w-full max-w-[370px] sm:max-w-[400px] h-24 sm:h-28 grid grid-cols-3 gap-2 px-1 select-none touch-none"
        >
          {trayPieces.map((piece, pIdx) => {
            if (!piece) {
              return (
                <div
                  key={`empty-slot-${pIdx}`}
                  className="w-full h-full flex items-center justify-center opacity-0 pointer-events-none"
                />
              );
            }

            // If this piece is currently being dragged, keep slot empty or dimmed
            const isDragging = activeDragIndex === pIdx;

            return (
              <div
                key={piece.id}
                id={`tray-piece-${pIdx}`}
                onPointerDown={(e) => handlePiecePointerDown(e, piece, pIdx)}
                className={`relative w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing transition-all duration-150 select-none touch-none
                  ${isDragging ? 'opacity-20' : 'opacity-100 hover:scale-105 active:scale-95'}
                `}
                style={{
                  touchAction: 'none',
                }}
              >
                {/* Piece shape grid representation */}
                <div
                  className="grid gap-0 pointer-events-none"
                  style={{
                    gridTemplateRows: `repeat(${piece.height}, minmax(0, 1fr))`,
                    gridTemplateColumns: `repeat(${piece.width}, minmax(0, 1fr))`,
                  }}
                >
                  {piece.shape.map((row, r) =>
                    row.map((val, c) => (
                      <div
                        key={`${r}-${c}`}
                        className={`w-5 h-5 sm:w-6 sm:h-6 ${
                          val === 1 ? 'block-tile' : 'opacity-0'
                        }`}
                        style={{
                          background:
                            val === 1
                              ? PIECE_COLORS[piece.colorName as keyof typeof PIECE_COLORS]?.gradient || piece.color
                              : 'transparent',
                        }}
                      />
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* FLOATING DRAGGED PIECE FOLLOWING POINTER (Mobile Touch Smooth UX & Progressive Reach) */}
      {activeDragIndex !== null && trayPieces[activeDragIndex] && dragPointerPos && (
        <div
          className="fixed pointer-events-none z-50 transform -translate-x-1/2 -translate-y-1/2"
          style={{
            left: `${dragPointerPos.x}px`,
            top: `${dragPointerPos.y}px`,
          }}
        >
          {(() => {
            const piece = trayPieces[activeDragIndex]!;
            const cellSize = boardRef.current
              ? (boardRef.current.getBoundingClientRect().width / 8) - 2
              : 38;
            return (
              <div
                className="grid gap-0 drop-shadow-[0_12px_28px_rgba(0,0,0,0.38)] w-max flex-shrink-0"
                style={{
                  gridTemplateRows: `repeat(${piece.height}, ${cellSize}px)`,
                  gridTemplateColumns: `repeat(${piece.width}, ${cellSize}px)`,
                }}
              >
                {piece.shape.map((row, r) =>
                  row.map((val, c) => (
                    <div
                      key={`drag-${r}-${c}`}
                      className={`${
                        val === 1 ? 'block-tile' : 'opacity-0'
                      }`}
                      style={{
                        width: `${cellSize}px`,
                        height: `${cellSize}px`,
                        background:
                          val === 1
                            ? PIECE_COLORS[piece.colorName as keyof typeof PIECE_COLORS]?.gradient || piece.color
                            : 'transparent',
                      }}
                    />
                  ))
                )}
              </div>
            );
          })()}
        </div>
      )}

      {/* PAUSE MODAL */}
      <PauseModal
        isOpen={isPaused}
        onResume={() => setIsPaused(false)}
        onRestart={() => {
          setIsPaused(false);
          startNewGame();
        }}
        onChangeMemory={() => {
          setIsPaused(false);
          onChangeMemory();
        }}
        onClose={() => setIsPaused(false)}
      />

      {/* GAME OVER MODAL */}
      <GameOverModal
        isOpen={isGameOver}
        score={score}
        bestScore={bestScore}
        isNewBest={isNewBest}
        onPlayAgain={startNewGame}
      />

      {/* REWARD CARD MODAL */}
      <RewardModal
        isOpen={isRewardModalOpen}
        reward={currentReward}
        audience={audience}
        onClose={() => setIsRewardModalOpen(false)}
      />
    </div>
  );
};
