"use client";

import { useEffect, useState, useCallback } from 'react';
import GameLayout from '@/components/game-layout';
import { useScores } from '@/hooks/use-scores';
import { toast } from 'sonner';

const GRID_SIZE = 4;

type Grid = number[][];

export default function Game2048() {
  const [grid, setGrid] = useState<Grid>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [startTime, setStartTime] = useState<number>(0);
  const [scoreSubmitted, setScoreSubmitted] = useState(false);

  const { addScore, getGameHighScore } = useScores();

  useEffect(() => {
    const savedHighScore = getGameHighScore('2048');
    setHighScore(savedHighScore);
  }, [getGameHighScore]);

  useEffect(() => {
    if (gameStarted && startTime === 0) {
      setStartTime(Date.now());
    }
  }, [gameStarted, startTime]);

  useEffect(() => {
    if (gameOver && !scoreSubmitted && score > 0) {
      const duration = Math.floor((Date.now() - startTime) / 1000);
      const newScore = addScore('2048', score, duration);
      setScoreSubmitted(true);
      
      if (newScore.is_high_score) {
        toast.success('🎉 New high score!', {
          description: `You scored ${score} points!`
        });
      }
    }
  }, [gameOver, score, scoreSubmitted, startTime, addScore]);

  const createEmptyGrid = (): Grid => {
    return Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(0));
  };

  const addRandomTile = useCallback((currentGrid: Grid): Grid => {
    const newGrid = currentGrid.map(row => [...row]);
    const emptyCells: { row: number; col: number }[] = [];
    
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        if (newGrid[row][col] === 0) {
          emptyCells.push({ row, col });
        }
      }
    }
    
    if (emptyCells.length > 0) {
      const { row, col } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      newGrid[row][col] = Math.random() < 0.9 ? 2 : 4;
    }
    
    return newGrid;
  }, []);

  const initializeGame = useCallback(() => {
    let newGrid = createEmptyGrid();
    newGrid = addRandomTile(newGrid);
    newGrid = addRandomTile(newGrid);
    setGrid(newGrid);
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    setGameStarted(false);
    setStartTime(0);
    setScoreSubmitted(false);
  }, [addRandomTile]);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  const canMove = useCallback((currentGrid: Grid): boolean => {
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        if (currentGrid[row][col] === 0) return true;
      }
    }
    
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        const current = currentGrid[row][col];
        if (col < GRID_SIZE - 1 && current === currentGrid[row][col + 1]) return true;
        if (row < GRID_SIZE - 1 && current === currentGrid[row + 1][col]) return true;
      }
    }
    
    return false;
  }, []);

  const moveLeft = useCallback((currentGrid: Grid): { grid: Grid; score: number; moved: boolean } => {
    const newGrid = createEmptyGrid();
    let newScore = 0;
    let moved = false;

    for (let row = 0; row < GRID_SIZE; row++) {
      let col = 0;
      for (let i = 0; i < GRID_SIZE; i++) {
        if (currentGrid[row][i] !== 0) {
          if (col > 0 && newGrid[row][col - 1] === currentGrid[row][i]) {
            newGrid[row][col - 1] *= 2;
            newScore += newGrid[row][col - 1];
            moved = true;
          } else {
            newGrid[row][col] = currentGrid[row][i];
            if (col !== i) moved = true;
            col++;
          }
        }
      }
    }

    return { grid: newGrid, score: newScore, moved };
  }, []);

  const rotateGrid = (currentGrid: Grid): Grid => {
    const newGrid = createEmptyGrid();
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        newGrid[col][GRID_SIZE - 1 - row] = currentGrid[row][col];
      }
    }
    return newGrid;
  };

  const move = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    if (gameOver || isPaused) return;

    if (!gameStarted) {
      setGameStarted(true);
    }

    let currentGrid = grid;
    let rotations = 0;

    if (direction === 'up') rotations = 1;
    else if (direction === 'right') rotations = 2;
    else if (direction === 'down') rotations = 3;

    for (let i = 0; i < rotations; i++) {
      currentGrid = rotateGrid(currentGrid);
    }

    const { grid: movedGrid, score: pointsEarned, moved } = moveLeft(currentGrid);

    if (!moved) return;

    for (let i = 0; i < (4 - rotations) % 4; i++) {
      currentGrid = rotateGrid(movedGrid);
    }

    const newGrid = addRandomTile(currentGrid);
    setGrid(newGrid);
    setScore(prev => {
      const newScore = prev + pointsEarned;
      if (newScore > highScore) {
        setHighScore(newScore);
      }
      return newScore;
    });

    if (!canMove(newGrid)) {
      setGameOver(true);
    }
  }, [grid, gameOver, isPaused, gameStarted, addRandomTile, canMove, moveLeft, highScore, rotateGrid]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      
      if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'w', 'a', 's', 'd'].includes(key)) {
        e.preventDefault();
        
        if (key === 'arrowup' || key === 'w') move('up');
        else if (key === 'arrowdown' || key === 's') move('down');
        else if (key === 'arrowleft' || key === 'a') move('left');
        else if (key === 'arrowright' || key === 'd') move('right');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [move]);

  const getTileColor = (value: number): string => {
    const colors: { [key: number]: string } = {
      0: 'bg-gray-700',
      2: 'bg-purple-200 text-gray-800',
      4: 'bg-purple-300 text-gray-800',
      8: 'bg-purple-400 text-white',
      16: 'bg-purple-500 text-white',
      32: 'bg-purple-600 text-white',
      64: 'bg-purple-700 text-white',
      128: 'bg-yellow-400 text-white',
      256: 'bg-yellow-500 text-white',
      512: 'bg-yellow-600 text-white',
      1024: 'bg-orange-500 text-white',
      2048: 'bg-orange-600 text-white',
    };
    return colors[value] || 'bg-red-600 text-white';
  };

  const getTileSize = (value: number): string => {
    if (value >= 1024) return 'text-3xl';
    if (value >= 128) return 'text-4xl';
    return 'text-5xl';
  };

  return (
    <GameLayout
      gameTitle="2048"
      currentScore={score}
      isPaused={isPaused}
      onPause={() => setIsPaused(true)}
      onResume={() => setIsPaused(false)}
      onRestart={initializeGame}
      gameOver={gameOver}
      finalScore={score}
      highScore={highScore}
    >
      <div className="flex items-center justify-center h-full">
        <div className="relative">
          <div className="bg-gray-800 p-4 rounded-xl shadow-2xl">
            <div className="grid grid-cols-4 gap-3" style={{ width: '400px', height: '400px' }}>
              {grid.map((row, rowIndex) =>
                row.map((value, colIndex) => (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className={`${getTileColor(value)} rounded-lg flex items-center justify-center font-bold transition-all duration-150 ${
                      value !== 0 ? 'scale-100' : 'scale-95'
                    }`}
                  >
                    {value !== 0 && (
                      <span className={getTileSize(value)}>{value}</span>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
          
          {!gameStarted && !gameOver && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl">
              <div className="text-center text-white">
                <p className="text-2xl font-bold mb-2">Press Arrow Keys or WASD to Start</p>
                <p className="text-sm opacity-75">Combine tiles to reach 2048!</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </GameLayout>
  );
}

