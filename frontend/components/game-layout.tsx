"use client";

import { ReactNode, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, Pause, Play, RotateCcw, Trophy } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface GameLayoutProps {
  children: ReactNode;
  gameTitle: string;
  currentScore: number;
  isPaused: boolean;
  onPause: () => void;
  onResume: () => void;
  onRestart: () => void;
  gameOver?: boolean;
  finalScore?: number;
  highScore?: number;
}

export default function GameLayout({
  children,
  gameTitle,
  currentScore,
  isPaused,
  onPause,
  onResume,
  onRestart,
  gameOver = false,
  finalScore,
  highScore
}: GameLayoutProps) {
  const router = useRouter();
  const [showControls, setShowControls] = useState(true);

  const handleExit = () => {
    const confirmed = window.confirm('Are you sure you want to exit? Your progress will be lost.');
    if (confirmed) {
      router.push('/');
    }
  };

  const handlePlayAgain = () => {
    onRestart();
  };

  const isNewHighScore = finalScore && highScore && finalScore > highScore;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
      {/* Game Controls Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-black/50 backdrop-blur-sm">
        <div className="container px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-white">{gameTitle}</h1>
            <div className="text-2xl font-bold text-purple-400">
              Score: {currentScore}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {!gameOver && (
              <>
                <Button
                  onClick={isPaused ? onResume : onPause}
                  variant="outline"
                  size="sm"
                  className="bg-white/10 hover:bg-white/20 text-white border-white/20"
                >
                  {isPaused ? <Play className="w-4 h-4 mr-2" /> : <Pause className="w-4 h-4 mr-2" />}
                  {isPaused ? 'Resume' : 'Pause'}
                </Button>
                <Button
                  onClick={onRestart}
                  variant="outline"
                  size="sm"
                  className="bg-white/10 hover:bg-white/20 text-white border-white/20"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Restart
                </Button>
              </>
            )}
            <Button
              onClick={handleExit}
              variant="outline"
              size="sm"
              className="bg-white/10 hover:bg-white/20 text-white border-white/20"
            >
              <Home className="w-4 h-4 mr-2" />
              Exit
            </Button>
          </div>
        </div>
      </div>

      {/* Game Content */}
      <div className="relative w-full h-screen pt-16">
        {children}
      </div>

      {/* Pause Overlay */}
      {isPaused && !gameOver && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl">Game Paused</CardTitle>
              <CardDescription>Take a break, then come back!</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <Button onClick={onResume} size="lg" className="w-full">
                <Play className="w-5 h-5 mr-2" />
                Resume Game
              </Button>
              <Button onClick={onRestart} variant="outline" size="lg" className="w-full">
                <RotateCcw className="w-5 h-5 mr-2" />
                Restart
              </Button>
              <Button onClick={handleExit} variant="outline" size="lg" className="w-full">
                <Home className="w-5 h-5 mr-2" />
                Exit to Menu
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Game Over Overlay */}
      {gameOver && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              {isNewHighScore ? (
                <>
                  <div className="mx-auto w-20 h-20 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mb-4 animate-bounce">
                    <Trophy className="w-10 h-10 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <CardTitle className="text-3xl text-yellow-600 dark:text-yellow-400">
                    New High Score! 🎉
                  </CardTitle>
                </>
              ) : (
                <CardTitle className="text-3xl">Game Over</CardTitle>
              )}
              <CardDescription>
                {isNewHighScore ? 'Congratulations on beating your record!' : 'Nice try! Want to play again?'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center space-y-2">
                <div>
                  <p className="text-sm text-muted-foreground">Your Score</p>
                  <p className="text-4xl font-bold text-purple-600 dark:text-purple-400">
                    {finalScore}
                  </p>
                </div>
                {highScore !== undefined && !isNewHighScore && (
                  <div>
                    <p className="text-sm text-muted-foreground">High Score</p>
                    <p className="text-2xl font-bold">{highScore}</p>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-3">
                <Button onClick={handlePlayAgain} size="lg" className="w-full">
                  <Play className="w-5 h-5 mr-2" />
                  Play Again
                </Button>
                <Button onClick={handleExit} variant="outline" size="lg" className="w-full">
                  <Home className="w-5 h-5 mr-2" />
                  Back to Games
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
