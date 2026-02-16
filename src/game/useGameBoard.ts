import { useState, useCallback, useRef, useEffect } from "react";
import { PIECE_IMAGES, LEVELS } from "./levels";

export interface Cell {
  type: number;
  id: string;
  matched: boolean;
  isNew: boolean;
  fallDistance: number;
}

type Board = Cell[][];

let idCounter = 0;
const newId = () => `cell-${idCounter++}`;

const randomType = () => Math.floor(Math.random() * PIECE_IMAGES.length);

function createCell(type?: number, fallDistance = 0): Cell {
  return {
    type: type ?? randomType(),
    id: newId(),
    matched: false,
    isNew: true,
    fallDistance,
  };
}

function createBoard(size: number): Board {
  const board: Board = [];
  for (let r = 0; r < size; r++) {
    const row: Cell[] = [];
    for (let c = 0; c < size; c++) {
      let cell = createCell();
      while (
        (c >= 2 && row[c - 1].type === cell.type && row[c - 2].type === cell.type) ||
        (r >= 2 && board[r - 1][c].type === cell.type && board[r - 2][c].type === cell.type)
      ) {
        cell = createCell();
      }
      row.push(cell);
    }
    board.push(row);
  }
  return board;
}

function findMatches(board: Board): [number, number][] {
  const size = board.length;
  const matched = new Set<string>();

  for (let r = 0; r < size; r++) {
    for (let c = 0; c <= size - 3; c++) {
      const t = board[r][c].type;
      let len = 1;
      while (c + len < size && board[r][c + len].type === t) len++;
      if (len >= 3) {
        for (let i = 0; i < len; i++) matched.add(`${r},${c + i}`);
      }
    }
  }

  for (let c = 0; c < size; c++) {
    for (let r = 0; r <= size - 3; r++) {
      const t = board[r][c].type;
      let len = 1;
      while (r + len < size && board[r + len][c].type === t) len++;
      if (len >= 3) {
        for (let i = 0; i < len; i++) matched.add(`${r + i},${c}`);
      }
    }
  }

  return [...matched].map((s) => {
    const [r, c] = s.split(",").map(Number);
    return [r, c] as [number, number];
  });
}

function wouldMatch(board: Board, r1: number, c1: number, r2: number, c2: number): boolean {
  const size = board.length;
  const clone: number[][] = board.map((row) => row.map((cell) => cell.type));
  [clone[r1][c1], clone[r2][c2]] = [clone[r2][c2], clone[r1][c1]];

  const positions = [[r1, c1], [r2, c2]];
  for (const [r, c] of positions) {
    const t = clone[r][c];
    let left = c;
    while (left > 0 && clone[r][left - 1] === t) left--;
    let right = c;
    while (right < size - 1 && clone[r][right + 1] === t) right++;
    if (right - left + 1 >= 3) return true;
    let top = r;
    while (top > 0 && clone[top - 1][c] === t) top--;
    let bottom = r;
    while (bottom < size - 1 && clone[bottom + 1][c] === t) bottom++;
    if (bottom - top + 1 >= 3) return true;
  }
  return false;
}

function findValidMoves(board: Board): [number, number, number, number][] {
  const size = board.length;
  const moves: [number, number, number, number][] = [];
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (c + 1 < size && wouldMatch(board, r, c, r, c + 1)) {
        moves.push([r, c, r, c + 1]);
      }
      if (r + 1 < size && wouldMatch(board, r, c, r + 1, c)) {
        moves.push([r, c, r + 1, c]);
      }
    }
  }
  return moves;
}

function calculateMatchScore(matchCount: number): number {
  if (matchCount >= 5) return 50;
  if (matchCount >= 4) return 25;
  return 10;
}

export function useGameBoard() {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [board, setBoard] = useState<Board>(() => createBoard(LEVELS[0].gridSize));
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<[number, number] | null>(null);
  const [animating, setAnimating] = useState(false);
  const [levelComplete, setLevelComplete] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [swapping, setSwapping] = useState<{ from: [number, number]; to: [number, number] } | null>(null);
  const [invalidSwap, setInvalidSwap] = useState<[number, number] | null>(null);
  const [hintCells, setHintCells] = useState<[number, number, number, number] | null>(null);
  const [boardShaking, setBoardShaking] = useState(false);
  const scoreRef = useRef(score);
  scoreRef.current = score;
  const lastActionTime = useRef(Date.now());
  const hintTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const levelConfig = LEVELS[currentLevel];

  // Reset hint on any action
  const resetHintTimer = useCallback(() => {
    lastActionTime.current = Date.now();
    setHintCells(null);
    if (hintTimer.current) clearTimeout(hintTimer.current);
  }, []);

  // Start hint timer after board settles
  const startHintTimer = useCallback((b: Board) => {
    if (hintTimer.current) clearTimeout(hintTimer.current);
    hintTimer.current = setTimeout(() => {
      const moves = findValidMoves(b);
      if (moves.length > 0) {
        const move = moves[Math.floor(Math.random() * moves.length)];
        setHintCells(move);
      }
    }, 3000);
  }, []);

  // Check for valid moves and reshuffle if needed
  const checkAndReshuffle = useCallback((b: Board): Board => {
    const moves = findValidMoves(b);
    if (moves.length > 0) return b;

    // No valid moves - shake and reshuffle
    setBoardShaking(true);
    setTimeout(() => {
      setBoardShaking(false);
    }, 600);

    // Reshuffle by creating a new board
    const size = b.length;
    return createBoard(size);
  }, []);

  const processBoard = useCallback((b: Board, addScore: number) => {
    const newScore = scoreRef.current + addScore;
    setScore(newScore);

    setTimeout(() => {
      const matches = findMatches(b);
      if (matches.length === 0) {
        const cleaned = b.map((row) =>
          row.map((cell) => ({ ...cell, isNew: false, fallDistance: 0 }))
        );
        const finalBoard = checkAndReshuffle(cleaned);
        setBoard(finalBoard);
        setAnimating(false);
        startHintTimer(finalBoard);
        return;
      }

      const matchScore = calculateMatchScore(matches.length);
      const marked = b.map((row) => row.map((cell) => ({ ...cell })));
      for (const [r, c] of matches) {
        marked[r][c].matched = true;
      }
      setBoard(marked);

      setTimeout(() => {
        const size = b.length;
        const newBoard: Board = marked.map((row) => row.map((cell) => ({ ...cell })));

        for (let c = 0; c < size; c++) {
          const col: Cell[] = [];
          for (let r = size - 1; r >= 0; r--) {
            if (!newBoard[r][c].matched) {
              col.push({ ...newBoard[r][c], isNew: false, fallDistance: 0 });
            }
          }
          const missing = size - col.length;
          for (let i = 0; i < missing; i++) {
            col.push(createCell(undefined, missing - i));
          }
          col.reverse();
          for (let r = 0; r < size; r++) {
            const originalR = marked.findIndex(
              (row, ri) => ri >= r && row[c].id === col[r].id && !row[c].matched
            );
            if (!col[r].isNew && originalR >= 0) {
              col[r].fallDistance = r - originalR > 0 ? r - originalR : 0;
            }
            newBoard[r][c] = col[r];
          }
        }

        setBoard(newBoard);

        setTimeout(() => {
          processBoard(newBoard, matchScore);
        }, 300);
      }, 300);
    }, 50);
  }, [checkAndReshuffle, startHintTimer]);

  const handleSwap = useCallback(
    (r1: number, c1: number, r2: number, c2: number) => {
      if (animating) return;
      if (Math.abs(r1 - r2) + Math.abs(c1 - c2) !== 1) return;

      resetHintTimer();

      if (!wouldMatch(board, r1, c1, r2, c2)) {
        setInvalidSwap([r1, c1]);
        setTimeout(() => setInvalidSwap(null), 400);
        setSelected(null);
        startHintTimer(board);
        return;
      }

      setAnimating(true);
      setSelected(null);
      setSwapping({ from: [r1, c1], to: [r2, c2] });

      setTimeout(() => {
        const newBoard = board.map((row) => row.map((cell) => ({ ...cell, isNew: false, fallDistance: 0 })));
        const temp = { ...newBoard[r1][c1] };
        newBoard[r1][c1] = { ...newBoard[r2][c2] };
        newBoard[r2][c2] = temp;
        setBoard(newBoard);
        setSwapping(null);
        processBoard(newBoard, 0);
      }, 250);
    },
    [board, animating, processBoard, resetHintTimer, startHintTimer]
  );

  const handleCellClick = useCallback(
    (r: number, c: number) => {
      if (animating) return;
      resetHintTimer();
      if (selected) {
        const [sr, sc] = selected;
        if (sr === r && sc === c) {
          setSelected(null);
          startHintTimer(board);
          return;
        }
        if (Math.abs(sr - r) + Math.abs(sc - c) === 1) {
          handleSwap(sr, sc, r, c);
        } else {
          setSelected([r, c]);
        }
      } else {
        setSelected([r, c]);
      }
    },
    [selected, animating, handleSwap, resetHintTimer, startHintTimer, board]
  );

  // Check level completion
  useEffect(() => {
    if (!animating && score >= levelConfig.targetScore && !levelComplete && !gameComplete) {
      if (currentLevel >= LEVELS.length - 1) {
        setGameComplete(true);
      } else {
        setLevelComplete(true);
      }
    }
  }, [score, animating, levelConfig.targetScore, levelComplete, currentLevel, gameComplete]);

  // Start hint timer on initial load and level changes
  useEffect(() => {
    if (!animating && !levelComplete && !gameComplete) {
      startHintTimer(board);
    }
    return () => {
      if (hintTimer.current) clearTimeout(hintTimer.current);
    };
  }, [currentLevel]);

  const nextLevel = useCallback(() => {
    const next = currentLevel + 1;
    if (next >= LEVELS.length) {
      setGameComplete(true);
      return;
    }
    resetHintTimer();
    setCurrentLevel(next);
    setBoard(createBoard(LEVELS[next].gridSize));
    setScore(0);
    setLevelComplete(false);
    setSelected(null);
    setAnimating(false);
  }, [currentLevel, resetHintTimer]);

  const restartGame = useCallback(() => {
    resetHintTimer();
    setCurrentLevel(0);
    setBoard(createBoard(LEVELS[0].gridSize));
    setScore(0);
    setLevelComplete(false);
    setGameComplete(false);
    setSelected(null);
    setAnimating(false);
  }, [resetHintTimer]);

  return {
    board,
    score,
    selected,
    animating,
    levelComplete,
    gameComplete,
    levelConfig,
    currentLevel,
    handleCellClick,
    handleSwap,
    nextLevel,
    restartGame,
    swapping,
    invalidSwap,
    hintCells,
    boardShaking,
  };
}
