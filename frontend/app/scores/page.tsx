"use client";

import { useState } from 'react';
import Header from '@/components/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trophy, Trash2, Medal, Award } from 'lucide-react';
import { toast } from 'sonner';

export default function ScoresPage() {
  const [gameFilter, setGameFilter] = useState<string>('all');
  const [scores] = useState<any[]>([]);

  const handleClearScores = () => {
    const confirmed = window.confirm('Are you sure you want to clear all your scores? This action cannot be undone.');
    if (confirmed) {
      toast.success('All scores cleared successfully');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      
      <main className="container px-4 py-8">
        <div className="mb-8">
          <h2 className="text-4xl font-bold mb-2">Your Scores</h2>
          <p className="text-muted-foreground mb-6">
            Track your progress and beat your high scores!
          </p>
          
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium">Filter by game:</label>
            <Select value={gameFilter} onValueChange={setGameFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="All games" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All games</SelectItem>
                <SelectItem value="snake">Snake Classic</SelectItem>
                <SelectItem value="memory">Memory Match</SelectItem>
                <SelectItem value="breakout">Breakout</SelectItem>
                <SelectItem value="tetris">Tetris</SelectItem>
                <SelectItem value="2048">2048</SelectItem>
              </SelectContent>
            </Select>
            
            {scores.length > 0 && (
              <Button onClick={handleClearScores} variant="destructive" size="sm">
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All Scores
              </Button>
            )}
          </div>
        </div>

        {scores.length === 0 ? (
          <Card className="max-w-2xl mx-auto">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="w-20 h-20 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mb-4">
                <Trophy className="w-10 h-10 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No Scores Yet</h3>
              <p className="text-muted-foreground text-center mb-6">
                Start playing games to see your scores here!
              </p>
              <Button asChild>
                <a href="/">Browse Games</a>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {scores.map((score, index) => (
              <Card key={score.score_id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {score.is_high_score && (
                        <div className="flex items-center justify-center w-10 h-10 bg-yellow-100 dark:bg-yellow-900 rounded-full">
                          <Award className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                        </div>
                      )}
                      {!score.is_high_score && index < 3 && (
                        <div className="flex items-center justify-center w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full">
                          <Medal className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                        </div>
                      )}
                      <div>
                        <CardTitle>{score.game_title}</CardTitle>
                        <CardDescription>
                          {new Date(score.timestamp).toLocaleDateString()} at{' '}
                          {new Date(score.timestamp).toLocaleTimeString()}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                        {score.score_value}
                      </div>
                      {score.is_high_score && (
                        <span className="text-xs font-medium text-yellow-600 dark:text-yellow-400">
                          HIGH SCORE
                        </span>
                      )}
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
