import React from 'react';
import { GameState } from '../types/game';

interface ScoreboardProps {
  gameState: GameState;
  onRestart: () => void;
  currentLevel: number;
}

const Scoreboard: React.FC<ScoreboardProps> = ({ gameState, onRestart, currentLevel }) => {
  return (
    <div className="bg-gray-900 text-white p-6 rounded-lg border-4 border-yellow-400 min-w-64 shadow-2xl">
      <h2 className="text-2xl font-bold text-yellow-400 mb-4 text-center animate-pulse">PAC-MAN</h2>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-lg">Level:</span>
          <span className="text-xl font-bold text-green-400">{gameState.level}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-lg">Score:</span>
          <span className="text-xl font-bold text-yellow-400">{gameState.score.toLocaleString()}</span>
        </div>
        
        {gameState.powerMode && (
          <div className="bg-blue-900 p-2 rounded text-center border border-blue-400">
            <span className="text-blue-300 font-bold animate-pulse">
              POWER MODE!
            </span>
            <div className="text-xs text-blue-400 mt-1">
              Timer: {Math.ceil(gameState.powerModeTimer / 5)}s
            </div>
          </div>
        )}
        
        {gameState.levelComplete && !gameState.gameWon && (
          <div className="bg-green-900 p-3 rounded text-center border border-green-400">
            <div className="text-green-300 font-bold text-lg mb-2 animate-bounce">LEVEL COMPLETE!</div>
            <div className="text-green-400 text-sm">Loading next level...</div>
          </div>
        )}
        
        {gameState.gameOver && (
          <div className="bg-red-900 p-4 rounded text-center border border-red-400 animate-pulse">
            <div className="text-red-300 font-bold text-xl mb-2">💀 OOPS! YOU LOST 💀</div>
            <div className="text-red-400 text-sm mb-3">A ghost caught you!</div>
            <div className="text-yellow-300 text-lg mb-3">
              Your Score: {gameState.score.toLocaleString()}
            </div>
            <button
              onClick={onRestart}
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded transition-all transform hover:scale-105 shadow-lg"
            >
              🎮 Play Again
            </button>
            <div className="text-xs text-gray-400 mt-2">Start from Level 1</div>
          </div>
        )}
        
        {gameState.gameWon && (
          <div className="bg-gradient-to-r from-purple-900 to-pink-900 p-4 rounded text-center border-2 border-gold animate-pulse">
            <div className="text-yellow-300 font-bold text-xl mb-2">🎉 YOU WON! 🎉</div>
            <div className="text-green-300 text-sm mb-3">
              Congratulations! You completed all 5 levels!
            </div>
            <div className="text-yellow-400 text-lg font-bold mb-3">
              Final Score: {gameState.score.toLocaleString()}
            </div>
            <button
              onClick={onRestart}
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-bold py-2 px-4 rounded transition-all transform hover:scale-105 shadow-lg"
            >
              Play Again
            </button>
          </div>
        )}
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-700">
        <h3 className="text-yellow-400 font-bold mb-2">Controls:</h3>
        <div className="text-sm text-gray-300 space-y-1">
          <div>↑ ↓ ← → Arrow Keys</div>
          <div className="text-xs text-gray-400">Move Pac-Man</div>
        </div>
        
        <div className="mt-3 pt-3 border-t border-gray-800">
          <h4 className="text-red-400 font-bold text-sm mb-1">⚠️ WARNING:</h4>
          <div className="text-xs text-red-300 mb-2">
            If a ghost catches you, you lose completely!
          </div>
          
          <h4 className="text-green-400 font-bold text-sm mb-1">Game Rules:</h4>
          <div className="text-xs text-gray-400 space-y-1">
            <div>• Eat all pellets to advance levels</div>
            <div>• Power pellets make ghosts vulnerable</div>
            <div>• Touch a ghost = Game Over (unless powered up)</div>
            <div>• Complete all 5 levels to win!</div>
            <div>• Score: Pellets(10) • Power(50) • Ghost(200)</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Scoreboard;
