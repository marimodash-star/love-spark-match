import React, { useRef, useCallback } from "react";
import { Cell } from "@/game/useGameBoard";
import { PIECE_IMAGES } from "@/game/levels";

interface GameBoardProps {
  board: Cell[][];
  selected: [number, number] | null;
  onCellClick: (r: number, c: number) => void;
  onSwap: (r1: number, c1: number, r2: number, c2: number) => void;
  swapping: { from: [number, number]; to: [number, number] } | null;
  invalidSwap: [number, number] | null;
  animating: boolean;
}

const GameBoard: React.FC<GameBoardProps> = ({
  board,
  selected,
  onCellClick,
  onSwap,
  swapping,
  invalidSwap,
  animating,
}) => {
  const size = board.length;
  const touchStart = useRef<{ r: number; c: number; x: number; y: number } | null>(null);

  const cellSize = Math.min(Math.floor((Math.min(window.innerWidth - 32, 500)) / size), 60);

  const handleTouchStart = useCallback((r: number, c: number, e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStart.current = { r, c, x: touch.clientX, y: touch.clientY };
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!touchStart.current) return;
      const touch = e.changedTouches[0];
      const { r, c, x, y } = touchStart.current;
      const dx = touch.clientX - x;
      const dy = touch.clientY - y;
      const minSwipe = 20;

      if (Math.abs(dx) < minSwipe && Math.abs(dy) < minSwipe) {
        onCellClick(r, c);
        touchStart.current = null;
        return;
      }

      let tr = r, tc = c;
      if (Math.abs(dx) > Math.abs(dy)) {
        tc = dx > 0 ? c + 1 : c - 1;
      } else {
        tr = dy > 0 ? r + 1 : r - 1;
      }

      if (tr >= 0 && tr < size && tc >= 0 && tc < size) {
        onSwap(r, c, tr, tc);
      }
      touchStart.current = null;
    },
    [onCellClick, onSwap, size]
  );

  return (
    <div
      className="relative rounded-2xl bg-game-bg p-1.5 shadow-lg border-2 border-cell-border"
      style={{ width: cellSize * size + 12, margin: "0 auto" }}
    >
      <div
        className="grid gap-0.5"
        style={{
          gridTemplateColumns: `repeat(${size}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${size}, ${cellSize}px)`,
        }}
      >
        {board.map((row, r) =>
          row.map((cell, c) => {
            const isSelected = selected && selected[0] === r && selected[1] === c;
            const isInvalid = invalidSwap && invalidSwap[0] === r && invalidSwap[1] === c;

            let transform = "";
            if (swapping) {
              const { from, to } = swapping;
              if (from[0] === r && from[1] === c) {
                const dr = (to[0] - from[0]) * cellSize;
                const dc = (to[1] - from[1]) * cellSize;
                transform = `translate(${dc}px, ${dr}px)`;
              } else if (to[0] === r && to[1] === c) {
                const dr = (from[0] - to[0]) * cellSize;
                const dc = (from[1] - to[1]) * cellSize;
                transform = `translate(${dc}px, ${dr}px)`;
              }
            }

            if (cell.isNew && cell.fallDistance > 0) {
              // Already at position, animate from above
            }

            return (
              <div
                key={cell.id}
                className={`
                  relative rounded-xl bg-cell-bg flex items-center justify-center cursor-pointer
                  transition-all duration-200
                  ${isSelected ? "ring-3 ring-primary animate-pulse-glow scale-110 z-10" : ""}
                  ${isInvalid ? "animate-shake" : ""}
                  ${cell.matched ? "scale-0 opacity-0" : ""}
                `}
                style={{
                  width: cellSize,
                  height: cellSize,
                  transform: transform || undefined,
                  transition: swapping ? "transform 0.25s ease" : cell.matched ? "all 0.3s ease" : "all 0.2s ease",
                  animation: cell.isNew && cell.fallDistance > 0
                    ? `pop-in 0.3s ease-out ${cell.fallDistance * 0.05}s both`
                    : undefined,
                }}
                onTouchStart={(e) => handleTouchStart(r, c, e)}
                onTouchEnd={handleTouchEnd}
                onClick={() => onCellClick(r, c)}
              >
                <img
                  src={PIECE_IMAGES[cell.type]}
                  alt=""
                  className="pointer-events-none select-none"
                  style={{
                    width: cellSize - 6,
                    height: cellSize - 6,
                    borderRadius: "25%",
                    objectFit: "cover",
                  }}
                  draggable={false}
                />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default GameBoard;
