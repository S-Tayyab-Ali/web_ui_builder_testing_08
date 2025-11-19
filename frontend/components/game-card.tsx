"use client";

import { Game } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play } from 'lucide-react';

interface GameCardProps {
  game: Game;
  onPlay: (gameId: string) => void;
}

export default function GameCard({ game, onPlay }: GameCardProps) {
  const difficultyColors = {
    easy: 'bg-green-500/10 text-green-700 dark:text-green-400',
    medium: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400',
    hard: 'bg-red-500/10 text-red-700 dark:text-red-400'
  };

  return (
    <Card className="group cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1" onClick={() => onPlay(game.game_id)}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="text-6xl mb-2">{game.thumbnail_url}</div>
          <Badge className={difficultyColors[game.difficulty_level]}>
            {game.difficulty_level}
          </Badge>
        </div>
        <CardTitle className="flex items-center justify-between">
          {game.title}
          <Play className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
        </CardTitle>
        <CardDescription>{game.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span className="capitalize">{game.category}</span>
          <span>{game.play_count} plays</span>
        </div>
      </CardContent>
    </Card>
  );
}
