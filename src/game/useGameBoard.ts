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
      // Avoid initial matches
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

  // Horizontal
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

  // Vertical
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

  // Check around both positions
  const positions = [
    [r1, c1],
    [r2, c2],
  ];
  for (const [r, c] of positions) {
    const t = clone[r][c];
    // Horizontal
    let left = c;
    while (left > 0 && clone[r][left - 1] === t) left--;
    let right = c;
    while (right < size - 1 && clone[r][right + 1] === t) right++;
    if (right - left + 1 >= 3) return true;
    // Vertical
    let top = r;
    while (top > 0 && clone[top - 1][c] === t) top--;
    let bottom = r;
    while (bottom < size - 1 && clone[bottom + 1][c] === t) bottom++;
    if (bottom - top + 1 >= 3) return true;
  }
  return false;
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
  const [swapping, setSwapping] = useState<{from: [number,number], to: [number,number]} | null>(null);
  const [invalidSwap, setInvalidSwap] = useState<[number,number] | null>(null);
  const scoreRef = useRef(score);
  scoreRef.current = score;

  const levelConfig = LEVELS[currentLevel];

  const processBoard = useCallback((b: Board, addScore: number) => {
    const newScore = scoreRef.current + addScore;
    setScore(newScore);

    // Check level completion
    if (newScore >= LEVELS[scoreRef.current === newScore ? 0 : 0].targetScore) {
      // We need the current level's target
    }

    setTimeout(() => {
      // Mark matched cells
      const matches = findMatches(b);
      if (matches.length === 0) {
        // Reset isNew flags
        const cleaned = b.map((row) =>
          row.map((cell) => ({ ...cell, isNew: false, fallDistance: 0 }))
        );
        setBoard(cleaned);
        setAnimating(false);
        return;
      }

      // Count per-group scores
      // Simple: just count total matched and give score proportional
      const matchScore = calculateMatchScore(matches.length);

      const marked = b.map((row) => row.map((cell) => ({ ...cell })));
      for (const [r, c] of matches) {
        marked[r][c].matched = true;
      }
      setBoard(marked);

      // After match animation, apply gravity
      setTimeout(() => {
        const size = b.length;
        const newBoard: Board = marked.map((row) => row.map((cell) => ({ ...cell })));

        // Remove matched, gravity
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
          // Set fall distances for existing cells
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

        // Continue cascade
        setTimeout(() => {
          processBoard(newBoard, matchScore);
        }, 300);
      }, 300);
    }, 50);
  }, []);

  const handleSwap = useCallback(
    (r1: number, c1: number, r2: number, c2: number) => {
      if (animating) return;
      if (Math.abs(r1 - r2) + Math.abs(c1 - c2) !== 1) return;

      if (!wouldMatch(board, r1, c1, r2, c2)) {
        setInvalidSwap([r1, c1]);
        setTimeout(() => setInvalidSwap(null), 400);
        setSelected(null);
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
    [board, animating, processBoard]
  );

  const handleCellClick = useCallback(
    (r: number, c: number) => {
      if (animating) return;
      if (selected) {
        const [sr, sc] = selected;
        if (sr === r && sc === c) {
          setSelected(null);
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
    [selected, animating, handleSwap]
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

  const nextLevel = useCallback(() => {
    const next = currentLevel + 1;
    if (next >= LEVELS.length) {
      setGameComplete(true);
      return;
    }
    setCurrentLevel(next);
    setBoard(createBoard(LEVELS[next].gridSize));
    setScore(0);
    setLevelComplete(false);
    setSelected(null);
    setAnimating(false);
  }, [currentLevel]);

  const restartGame = useCallback(() => {
    setCurrentLevel(0);
    setBoard(createBoard(LEVELS[0].gridSize));
    setScore(0);
    setLevelComplete(false);
    setGameComplete(false);
    setSelected(null);
    setAnimating(false);
  }, []);

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
  };
}
