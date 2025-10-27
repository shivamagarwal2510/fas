export interface Position {
  x: number;
  y: number;
}

export interface GameState {
  pacman: Position;
  ghosts: Position[];
  score: number;
  lives: number;
  level: number;
  powerMode: boolean;
  powerModeTimer: number;
  gameOver: boolean;
  gameWon: boolean;
  levelComplete: boolean;
}

export type CellType = 'wall' | 'path' | 'pellet' | 'power' | 'empty';

export interface Ghost {
  id: number;
  position: Position;
  direction: Direction;
  isVulnerable: boolean;
}

export type Direction = 'up' | 'down' | 'left' | 'right';

export interface LevelConfig {
  maze: number[][];
  ghostCount: number;
  ghostSpeed: number;
  powerModeTime: number;
  pacmanStartPos: Position;
  ghostStartPositions: Position[];
}
