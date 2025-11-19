"use client";

import { useEffect, useRef, useState, useCallback } from 'react';
import GameLayout from '@/components/game-layout';
import { useScores } from '@/hooks/use-scores';
import { toast } from 'sonner';

const GRID_SIZE = 20;
const CELL_SIZE = 25;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 1, y: 0 };
const GAME_SPEED = 150;

type Position = { x: number; y: number };

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Position>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Position>({ x: 15, y: 15 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [startTime, setStartTime] = useState<number>(0);
  const [scoreSubmitted, setScoreSubmitted] = useState(false);

  const { addScore, getGameHighScore } = useScores();

  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);
  const nextDirectionRef = useRef<Position>(INITIAL_DIRECTION);

  useEffect(() => {
    const savedHighScore = getGameHighScore('snake');
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
      const newScore = addScore('snake', score, duration);
      setScoreSubmitted(true);
      
      if (newScore.is_high_score) {
        toast.success('🎉 New high score!', {
          description: `You scored ${score} points!`
        });
      }
    }
  }, [gameOver, score, scoreSubmitted, startTime, addScore]);

  const generateFood = useCallback((currentSnake: Position[]) => {
    let newFood: Position;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
    } while (currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
  }, []);

  const resetGame = useCallback(() => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    nextDirectionRef.current = INITIAL_DIRECTION;
    setFood(generateFood(INITIAL_SNAKE));
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    setGameStarted(false);
    setStartTime(0);
    setScoreSubmitted(false);
  }, [generateFood]);

  const moveSnake = useCallback(() => {
    if (isPaused || gameOver || !gameStarted) return;

    setSnake(prevSnake => {
      const currentDirection = nextDirectionRef.current;
      const head = prevSnake[0];
      const newHead = {
        x: (head.x + currentDirection.x + GRID_SIZE) % GRID_SIZE,
        y: (head.y + currentDirection.y + GRID_SIZE) % GRID_SIZE
      };

      // Check collision with self
      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check if food is eaten
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(prev => {
          const newScore = prev + 10;
          if (newScore > highScore) {
            setHighScore(newScore);
          }
          return newScore;
        });
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      setDirection(currentDirection);
      return newSnake;
    });
  }, [isPaused, gameOver, gameStarted, food, generateFood, highScore]);

  useEffect(() => {
    if (gameStarted && !isPaused && !gameOver) {
      gameLoopRef.current = setInterval(moveSnake, GAME_SPEED);
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [moveSnake, isPaused, gameOver, gameStarted]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!gameStarted && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd'].includes(e.key)) {
        setGameStarted(true);
      }

      const key = e.key.toLowerCase();
      
      if (key === 'arrowup' || key === 'w') {
        e.preventDefault();
        if (direction.y === 0) {
          nextDirectionRef.current = { x: 0, y: -1 };
        }
      } else if (key === 'arrowdown' || key === 's') {
        e.preventDefault();
        if (direction.y === 0) {
          nextDirectionRef.current = { x: 0, y: 1 };
        }
      } else if (key === 'arrowleft' || key === 'a') {
        e.preventDefault();
        if (direction.x === 0) {
          nextDirectionRef.current = { x: -1, y: 0 };
        }
      } else if (key === 'arrowright' || key === 'd') {
        e.preventDefault();
        if (direction.x === 0) {
          nextDirectionRef.current = { x: 1, y: 0 };
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction, gameStarted]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = '#2a2a2a';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * CELL_SIZE, 0);
      ctx.lineTo(i * CELL_SIZE, GRID_SIZE * CELL_SIZE);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * CELL_SIZE);
      ctx.lineTo(GRID_SIZE * CELL_SIZE, i * CELL_SIZE);
      ctx.stroke();
    }

    // Draw snake
    snake.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? '#8b5cf6' : '#a78bfa';
      ctx.fillRect(
        segment.x * CELL_SIZE + 1,
        segment.y * CELL_SIZE + 1,
        CELL_SIZE - 2,
        CELL_SIZE - 2
      );
    });

    // Draw food
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(
      food.x * CELL_SIZE + CELL_SIZE / 2,
      food.y * CELL_SIZE + CELL_SIZE / 2,
      CELL_SIZE / 2 - 2,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }, [snake, food]);

  return (
    <GameLayout
      gameTitle="Snake Classic"
      currentScore={score}
      isPaused={isPaused}
      onPause={() => setIsPaused(true)}
      onResume={() => setIsPaused(false)}
      onRestart={resetGame}
      gameOver={gameOver}
      finalScore={score}
      highScore={highScore}
    >
      <div className="flex items-center justify-center h-full">
        <div className="relative">
          <canvas
            ref={canvasRef}
            width={GRID_SIZE * CELL_SIZE}
            height={GRID_SIZE * CELL_SIZE}
            className="border-4 border-purple-500 rounded-lg shadow-2xl"
          />
          {!gameStarted && !gameOver && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
              <div className="text-center text-white">
                <p className="text-2xl font-bold mb-2">Press Arrow Keys or WASD to Start</p>
                <p className="text-sm opacity-75">Eat the red food to grow!</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </GameLayout>
  );
}
