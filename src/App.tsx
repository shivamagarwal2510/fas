import React from 'react';
import GameBoard from './components/GameBoard';
import Scoreboard from './components/Scoreboard';
import { useGameState } from './hooks/useGameState';
import { useKeyboard } from './hooks/useKeyboard';

function App() {
  const { maze, gameState, ghosts, movePacman, resetGame, currentLevel } = useGameState();
  
  useKeyboard(movePacman);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black flex items-center justify-center p-4">
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        <GameBoard
          maze={maze}
          pacmanPosition={gameState.pacman}
          ghosts={ghosts}
          powerMode={gameState.powerMode}
        />
        <Scoreboard
          gameState={gameState}
          onRestart={resetGame}
          currentLevel={currentLevel}
        />
      </div>
      
      {/* Game title overlay */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
        <h1 className="text-4xl font-bold text-yellow-400 text-center animate-pulse drop-shadow-lg">
          🟡 PAC-MAN DELUXE 🟡
        </h1>
        <p className="text-center text-white text-sm mt-2 opacity-80">
          5 Levels • Increasing Difficulty • Classic Arcade Fun
        </p>
      </div>
    </div>
  );
}

export default App;
