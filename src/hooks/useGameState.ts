import { useState, useEffect, useCallback } from 'react';
import { GameState, Position, Direction, Ghost } from '../types/game';
import { convertMazeData, LEVEL_CONFIGS, MAZE_WIDTH, MAZE_HEIGHT } from '../data/maze';

export const useGameState = () => {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [maze, setMaze] = useState(convertMazeData(LEVEL_CONFIGS[0].maze));
  const [gameState, setGameState] = useState<GameState>({
    pacman: LEVEL_CONFIGS[0].pacmanStartPos,
    ghosts: LEVEL_CONFIGS[0].ghostStartPositions,
    score: 0,
    lives: 3,
    level: 1,
    powerMode: false,
    powerModeTimer: 0,
    gameOver: false,
    gameWon: false,
    levelComplete: false
  });

  const [ghosts, setGhosts] = useState<Ghost[]>(
    LEVEL_CONFIGS[0].ghostStartPositions.slice(0, LEVEL_CONFIGS[0].ghostCount).map((pos, index) => ({
      id: index,
      position: pos,
      direction: 'up' as Direction,
      isVulnerable: false
    }))
  );

  const isValidMove = useCallback((position: Position): boolean => {
    if (position.x < 0 || position.x >= MAZE_WIDTH || 
        position.y < 0 || position.y >= MAZE_HEIGHT) {
      return false;
    }
    return maze[position.y][position.x] !== 'wall';
  }, [maze]);

  const wrapPosition = useCallback((position: Position): Position => {
    let newX = position.x;
    let newY = position.y;

    if (newX < 0) newX = MAZE_WIDTH - 1;
    if (newX >= MAZE_WIDTH) newX = 0;
    
    return { x: newX, y: newY };
  }, []);

  const nextLevel = useCallback(() => {
    if (currentLevel < LEVEL_CONFIGS.length - 1) {
      const nextLevelIndex = currentLevel + 1;
      const levelConfig = LEVEL_CONFIGS[nextLevelIndex];
      
      setCurrentLevel(nextLevelIndex);
      setMaze(convertMazeData(levelConfig.maze));
      
      setGameState(prevState => ({
        ...prevState,
        level: nextLevelIndex + 1,
        pacman: levelConfig.pacmanStartPos,
        powerMode: false,
        powerModeTimer: 0,
        levelComplete: false
      }));

      setGhosts(levelConfig.ghostStartPositions.slice(0, levelConfig.ghostCount).map((pos, index) => ({
        id: index,
        position: pos,
        direction: 'up' as Direction,
        isVulnerable: false
      })));
    } else {
      // All levels completed
      setGameState(prevState => ({
        ...prevState,
        gameWon: true
      }));
    }
  }, [currentLevel]);

  const movePacman = useCallback((direction: Direction) => {
    if (gameState.gameOver || gameState.gameWon || gameState.levelComplete) return;

    setGameState(prevState => {
      const { x, y } = prevState.pacman;
      let newPosition: Position = { x, y };

      switch (direction) {
        case 'up':
          newPosition = { x, y: y - 1 };
          break;
        case 'down':
          newPosition = { x, y: y + 1 };
          break;
        case 'left':
          newPosition = { x: x - 1, y };
          break;
        case 'right':
          newPosition = { x: x + 1, y };
          break;
      }

      newPosition = wrapPosition(newPosition);

      if (!isValidMove(newPosition)) {
        return prevState;
      }

      let newScore = prevState.score;
      let newPowerMode = prevState.powerMode;
      let newPowerModeTimer = prevState.powerModeTimer;

      const cellType = maze[newPosition.y][newPosition.x];
      const levelConfig = LEVEL_CONFIGS[currentLevel];
      
      if (cellType === 'pellet') {
        newScore += 10;
        setMaze(prevMaze => {
          const newMaze = [...prevMaze];
          newMaze[newPosition.y] = [...newMaze[newPosition.y]];
          newMaze[newPosition.y][newPosition.x] = 'path';
          return newMaze;
        });
      } else if (cellType === 'power') {
        newScore += 50;
        newPowerMode = true;
        newPowerModeTimer = levelConfig.powerModeTime;
        setMaze(prevMaze => {
          const newMaze = [...prevMaze];
          newMaze[newPosition.y] = [...newMaze[newPosition.y]];
          newMaze[newPosition.y][newPosition.x] = 'path';
          return newMaze;
        });
      }

      return {
        ...prevState,
        pacman: newPosition,
        score: newScore,
        powerMode: newPowerMode,
        powerModeTimer: newPowerModeTimer
      };
    });
  }, [gameState.gameOver, gameState.gameWon, gameState.levelComplete, isValidMove, wrapPosition, maze, currentLevel]);

  const moveGhosts = useCallback(() => {
    if (gameState.gameOver || gameState.gameWon || gameState.levelComplete) return;

    setGhosts(prevGhosts => 
      prevGhosts.map(ghost => {
        const directions: Direction[] = ['up', 'down', 'left', 'right'];
        const possibleMoves = directions.filter(dir => {
          const { x, y } = ghost.position;
          let newPos: Position = { x, y };

          switch (dir) {
            case 'up': newPos = { x, y: y - 1 }; break;
            case 'down': newPos = { x, y: y + 1 }; break;
            case 'left': newPos = { x: x - 1, y }; break;
            case 'right': newPos = { x: x + 1, y }; break;
          }

          newPos = wrapPosition(newPos);
          return isValidMove(newPos);
        });

        if (possibleMoves.length === 0) return ghost;

        const randomDirection = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
        const { x, y } = ghost.position;
        let newPosition: Position = { x, y };

        switch (randomDirection) {
          case 'up': newPosition = { x, y: y - 1 }; break;
          case 'down': newPosition = { x, y: y + 1 }; break;
          case 'left': newPosition = { x: x - 1, y }; break;
          case 'right': newPosition = { x: x + 1, y }; break;
        }

        newPosition = wrapPosition(newPosition);

        return {
          ...ghost,
          position: newPosition,
          direction: randomDirection,
          isVulnerable: gameState.powerMode
        };
      })
    );
  }, [gameState.gameOver, gameState.gameWon, gameState.levelComplete, gameState.powerMode, isValidMove, wrapPosition]);

  const checkCollisions = useCallback(() => {
    if (gameState.gameOver || gameState.gameWon || gameState.levelComplete) return;

    const pacmanPos = gameState.pacman;
    const levelConfig = LEVEL_CONFIGS[currentLevel];
    
    ghosts.forEach(ghost => {
      if (ghost.position.x === pacmanPos.x && ghost.position.y === pacmanPos.y) {
        if (gameState.powerMode && ghost.isVulnerable) {
          // Pac-Man eats the ghost - add points and reset ghost position
          setGameState(prevState => ({
            ...prevState,
            score: prevState.score + 200
          }));
          
          setGhosts(prevGhosts => 
            prevGhosts.map(g => 
              g.id === ghost.id 
                ? { ...g, position: levelConfig.ghostStartPositions[g.id] }
                : g
            )
          );
        } else {
          // Ghost catches Pac-Man - GAME OVER! Start from level 1
          setGameState(prevState => ({
            ...prevState,
            gameOver: true
          }));
        }
      }
    });
  }, [gameState, ghosts, currentLevel]);

  const checkLevelComplete = useCallback(() => {
    const hasRemainingPellets = maze.some(row => 
      row.some(cell => cell === 'pellet' || cell === 'power')
    );
    
    if (!hasRemainingPellets && !gameState.levelComplete) {
      setGameState(prevState => ({ ...prevState, levelComplete: true }));
      
      // Auto-advance to next level after a delay
      setTimeout(() => {
        nextLevel();
      }, 2000);
    }
  }, [maze, gameState.levelComplete, nextLevel]);

  const resetGame = useCallback(() => {
    setCurrentLevel(0);
    const levelConfig = LEVEL_CONFIGS[0];
    setMaze(convertMazeData(levelConfig.maze));
    setGameState({
      pacman: levelConfig.pacmanStartPos,
      ghosts: levelConfig.ghostStartPositions,
      score: 0,
      lives: 3,
      level: 1,
      powerMode: false,
      powerModeTimer: 0,
      gameOver: false,
      gameWon: false,
      levelComplete: false
    });
    setGhosts(levelConfig.ghostStartPositions.slice(0, levelConfig.ghostCount).map((pos, index) => ({
      id: index,
      position: pos,
      direction: 'up' as Direction,
      isVulnerable: false
    })));
  }, []);

  // Game loop
  useEffect(() => {
    const levelConfig = LEVEL_CONFIGS[currentLevel];
    const gameLoop = setInterval(() => {
      if (!gameState.gameOver && !gameState.gameWon && !gameState.levelComplete) {
        moveGhosts();
        checkCollisions();
        checkLevelComplete();
        
        if (gameState.powerMode && gameState.powerModeTimer > 0) {
          setGameState(prevState => {
            const newTimer = prevState.powerModeTimer - 1;
            return {
              ...prevState,
              powerModeTimer: newTimer,
              powerMode: newTimer > 0
            };
          });
        }
      }
    }, levelConfig.ghostSpeed);

    return () => clearInterval(gameLoop);
  }, [gameState, currentLevel, moveGhosts, checkCollisions, checkLevelComplete]);

  return {
    maze,
    gameState,
    ghosts,
    movePacman,
    resetGame,
    currentLevel
  };
};
