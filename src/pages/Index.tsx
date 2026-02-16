import React from "react";
import GameBoard from "@/components/GameBoard";
import LoveBar from "@/components/LoveBar";
import LevelComplete from "@/components/LevelComplete";
import ValentineScreen from "@/components/ValentineScreen";
import { useGameBoard } from "@/game/useGameBoard";

const Index: React.FC = () => {
  const {
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
  } = useGameBoard();

  return (
    <div className="flex flex-col min-h-[100dvh] bg-background items-center justify-start pt-2 pb-4 px-2 overflow-hidden">
      <h1 className="font-display text-2xl text-primary mb-2 drop-shadow-sm">
        Love Match
      </h1>

      <LoveBar score={score} target={levelConfig.targetScore} level={currentLevel + 1} />

      <div className="mt-2 flex-1 flex items-start justify-center w-full">
        <GameBoard
          board={board}
          selected={selected}
          onCellClick={handleCellClick}
          onSwap={handleSwap}
          swapping={swapping}
          invalidSwap={invalidSwap}
          animating={animating}
          hintCells={hintCells}
          boardShaking={boardShaking}
        />
      </div>

      {levelComplete && (
        <LevelComplete
          level={currentLevel + 1}
          message={levelConfig.message || "Отлично!"}
          onNext={nextLevel}
          isLast={currentLevel >= 24}
        />
      )}

      {gameComplete && <ValentineScreen onRestart={restartGame} />}
    </div>
  );
};

export default Index;
