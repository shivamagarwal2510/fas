import React from 'react';
import { CellType, Position, Ghost } from '../types/game';

interface GameBoardProps {
  maze: CellType[][];
  pacmanPosition: Position;
  ghosts: Ghost[];
  powerMode: boolean;
}

const GameBoard: React.FC<GameBoardProps> = ({ 
  maze, 
  pacmanPosition, 
  ghosts, 
  powerMode 
}) => {
  const getCellContent = (x: number, y: number) => {
    // Check if Pac-Man is at this position
    if (pacmanPosition.x === x && pacmanPosition.y === y) {
      return (
        <div className="w-full h-full relative flex items-center justify-center">
          {/* Pac-Man with animation */}
          <div className="w-5 h-5 bg-yellow-400 rounded-full relative pacman-animation border border-yellow-500">
            {/* Pac-Man mouth */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-0 h-0 border-solid"
                   style={{
                     borderTop: '4px solid transparent',
                     borderBottom: '4px solid transparent',
                     borderLeft: '6px solid black'
                   }}>
              </div>
            </div>
            {/* Eye */}
            <div className="absolute top-1 left-1 w-1 h-1 bg-black rounded-full"></div>
          </div>
        </div>
      );
    }

    // Check if any ghost is at this position
    const ghostAtPosition = ghosts.find(ghost => ghost.position.x === x && ghost.position.y === y);
    if (ghostAtPosition) {
      const ghostColor = ghostAtPosition.isVulnerable && powerMode 
        ? 'bg-blue-400 border-blue-600' 
        : 'bg-red-500 border-red-700';
      
      return (
        <div className={`w-full h-full ${ghostColor} rounded-t-full border-2 flex items-center justify-center transition-all duration-200 relative`}>
          {/* Ghost eyes */}
          <div className="flex space-x-1 absolute top-1">
            <div className="w-1 h-1 bg-white rounded-full"></div>
            <div className="w-1 h-1 bg-white rounded-full"></div>
          </div>
          {/* Ghost bottom wavy edge */}
          <div className="absolute bottom-0 left-0 right-0 h-1">
            <div className={`w-full h-1 ${ghostAtPosition.isVulnerable && powerMode ? 'bg-blue-400' : 'bg-red-500'}`}
                 style={{
                   clipPath: 'polygon(0% 0%, 20% 100%, 40% 0%, 60% 100%, 80% 0%, 100% 100%, 100% 0%, 0% 0%)'
                 }}>
            </div>
          </div>
        </div>
      );
    }

    // Render maze content
    const cellType = maze[y][x];
    switch (cellType) {
      case 'wall':
        return <div className="w-full h-full bg-blue-900 border border-blue-700 rounded-sm"></div>;
      case 'pellet':
        return (
          <div className="w-full h-full bg-black flex items-center justify-center">
            <div className="w-1 h-1 bg-yellow-300 rounded-full shadow-sm shadow-yellow-400"></div>
          </div>
        );
      case 'power':
        return (
          <div className="w-full h-full bg-black flex items-center justify-center">
            <div className="w-3 h-3 bg-yellow-300 rounded-full animate-pulse shadow-lg shadow-yellow-400"></div>
          </div>
        );
      case 'path':
      case 'empty':
      default:
        return <div className="w-full h-full bg-black"></div>;
    }
  };

  return (
    <div className="bg-black p-4 rounded-lg border-4 border-blue-900 shadow-2xl">
      <div 
        className="grid gap-0 shadow-inner"
        style={{ 
          gridTemplateColumns: `repeat(${maze[0].length}, 1fr)`,
          gridTemplateRows: `repeat(${maze.length}, 1fr)`
        }}
      >
        {maze.map((row, y) =>
          row.map((_, x) => (
            <div
              key={`${x}-${y}`}
              className="w-6 h-6 relative"
            >
              {getCellContent(x, y)}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default GameBoard;
