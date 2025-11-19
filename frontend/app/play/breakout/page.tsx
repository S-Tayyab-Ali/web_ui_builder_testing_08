"use client";

import { useEffect, useRef, useState, useCallback } from 'react';
import GameLayout from '@/components/game-layout';
import { useScores } from '@/hooks/use-scores';
import { toast } from 'sonner';

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 500;
const PADDLE_WIDTH = 100;
const PADDLE_HEIGHT = 15;
const BALL_RADIUS = 8;
const BRICK_ROWS = 5;
const BRICK_COLS = 8;
const BRICK_WIDTH = 70;
const BRICK_HEIGHT = 20;
const BRICK_PADDING = 5;
const BRICK_OFFSET_TOP = 50;
const BRICK_OFFSET_LEFT = 15;

interface Brick {
  x: number;
  y: number;
  status: number;
}

export default function BreakoutGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [startTime, setStartTime] = useState<number>(0);
  const [scoreSubmitted, setScoreSubmitted] = useState(false);

  const paddleXRef = useRef((CANVAS_WIDTH - PADDLE_WIDTH) / 2);
  const ballRef = useRef({ x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT - 50, dx: 3, dy: -3 });
  const bricksRef = useRef<Brick[][]>([]);
  const requestRef = useRef<number>();

  const { addScore, getGameHighScore } = useScores();

  useEffect(() => {
    const savedHighScore = getGameHighScore('breakout');
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
      const newScore = addScore('breakout', score, duration);
      setScoreSubmitted(true);
      
      if (newScore.is_high_score) {
        toast.success('🎉 New high score!', {
          description: `You scored ${score} points!`
        });
      }
    }
  }, [gameOver, score, scoreSubmitted, startTime, addScore]);

  const initializeBricks = useCallback(() => {
    const bricks: Brick[][] = [];
    for (let row = 0; row < BRICK_ROWS; row++) {
      bricks[row] = [];
      for (let col = 0; col < BRICK_COLS; col++) {
        bricks[row][col] = {
          x: col * (BRICK_WIDTH + BRICK_PADDING) + BRICK_OFFSET_LEFT,
          y: row * (BRICK_HEIGHT + BRICK_PADDING) + BRICK_OFFSET_TOP,
          status: 1
        };
      }
    }
    return bricks;
  }, []);

  const resetGame = useCallback(() => {
    paddleXRef.current = (CANVAS_WIDTH - PADDLE_WIDTH) / 2;
    ballRef.current = { x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT - 50, dx: 3, dy: -3 };
    bricksRef.current = initializeBricks();
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    setGameStarted(false);
    setStartTime(0);
    setScoreSubmitted(false);
  }, [initializeBricks]);

  useEffect(() => {
    resetGame();
  }, [resetGame]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!gameStarted && (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'a' || e.key === 'd' || e.key === ' ')) {
        setGameStarted(true);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const relativeX = e.clientX - rect.left;

      if (relativeX > 0 && relativeX < CANVAS_WIDTH) {
        paddleXRef.current = relativeX - PADDLE_WIDTH / 2;
        
        if (!gameStarted) {
          setGameStarted(true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [gameStarted]);

  const collisionDetection = useCallback(() => {
    let allBricksDestroyed = true;
    
    for (let row = 0; row < BRICK_ROWS; row++) {
      for (let col = 0; col < BRICK_COLS; col++) {
        const brick = bricksRef.current[row][col];
        if (brick.status === 1) {
          allBricksDestroyed = false;
          
          if (
            ballRef.current.x > brick.x &&
            ballRef.current.x < brick.x + BRICK_WIDTH &&
            ballRef.current.y > brick.y &&
            ballRef.current.y < brick.y + BRICK_HEIGHT
          ) {
            ballRef.current.dy = -ballRef.current.dy;
            brick.status = 0;
            setScore(prev => prev + 10);
          }
        }
      }
    }
    
    if (allBricksDestroyed) {
      setGameOver(true);
      toast.success('You won! All bricks destroyed!');
    }
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || isPaused || gameOver || !gameStarted) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw bricks
    for (let row = 0; row < BRICK_ROWS; row++) {
      for (let col = 0; col < BRICK_COLS; col++) {
        const brick = bricksRef.current[row][col];
        if (brick.status === 1) {
          const gradient = ctx.createLinearGradient(brick.x, brick.y, brick.x, brick.y + BRICK_HEIGHT);
          gradient.addColorStop(0, '#8b5cf6');
          gradient.addColorStop(1, '#6d28d9');
          ctx.fillStyle = gradient;
          ctx.fillRect(brick.x, brick.y, BRICK_WIDTH, BRICK_HEIGHT);
          
          ctx.strokeStyle = '#a78bfa';
          ctx.strokeRect(brick.x, brick.y, BRICK_WIDTH, BRICK_HEIGHT);
        }
      }
    }

    // Draw ball
    ctx.beginPath();
    ctx.arc(ballRef.current.x, ballRef.current.y, BALL_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = '#ef4444';
    ctx.fill();
    ctx.closePath();

    // Draw paddle
    const gradient = ctx.createLinearGradient(0, CANVAS_HEIGHT - PADDLE_HEIGHT - 10, 0, CANVAS_HEIGHT - 10);
    gradient.addColorStop(0, '#3b82f6');
    gradient.addColorStop(1, '#1d4ed8');
    ctx.fillStyle = gradient;
    ctx.fillRect(paddleXRef.current, CANVAS_HEIGHT - PADDLE_HEIGHT - 10, PADDLE_WIDTH, PADDLE_HEIGHT);

    // Collision detection
    collisionDetection();

    // Ball movement
    ballRef.current.x += ballRef.current.dx;
    ballRef.current.y += ballRef.current.dy;

    // Wall collision
    if (ballRef.current.x + ballRef.current.dx > CANVAS_WIDTH - BALL_RADIUS || ballRef.current.x + ballRef.current.dx < BALL_RADIUS) {
      ballRef.current.dx = -ballRef.current.dx;
    }
    if (ballRef.current.y + ballRef.current.dy < BALL_RADIUS) {
      ballRef.current.dy = -ballRef.current.dy;
    } else if (ballRef.current.y + ballRef.current.dy > CANVAS_HEIGHT - BALL_RADIUS - PADDLE_HEIGHT - 10) {
      if (ballRef.current.x > paddleXRef.current && ballRef.current.x < paddleXRef.current + PADDLE_WIDTH) {
        ballRef.current.dy = -ballRef.current.dy;
      } else if (ballRef.current.y + ballRef.current.dy > CANVAS_HEIGHT - BALL_RADIUS) {
        setGameOver(true);
      }
    }

    requestRef.current = requestAnimationFrame(draw);
  }, [isPaused, gameOver, gameStarted, collisionDetection]);

  useEffect(() => {
    if (gameStarted && !isPaused && !gameOver) {
      requestRef.current = requestAnimationFrame(draw);
    }
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [draw, isPaused, gameOver, gameStarted]);

  return (
    <GameLayout
      gameTitle="Breakout"
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
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            className="border-4 border-purple-500 rounded-lg shadow-2xl cursor-none"
          />
          {!gameStarted && !gameOver && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
              <div className="text-center text-white">
                <p className="text-2xl font-bold mb-2">Move Mouse or Press Space to Start</p>
                <p className="text-sm opacity-75">Break all the bricks!</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </GameLayout>
  );
}
