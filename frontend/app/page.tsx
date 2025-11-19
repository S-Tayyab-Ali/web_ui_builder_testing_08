"use client";

import { useState } from 'react';
import GameCard from '@/components/game-card';
import Header from '@/components/header';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRouter } from 'next/navigation';
import { useGames } from '@/hooks/use-games';

export default function Home() {
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const router = useRouter();
  const { games, incrementPlayCount } = useGames();

  const filteredGames = categoryFilter === 'all' 
    ? games 
    : games.filter(game => game.category === categoryFilter);

  const handlePlayGame = (gameId: string) => {
    incrementPlayCount(gameId);
    router.push(`/play/${gameId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      
      <main className="container px-4 py-8">
        <div className="mb-8">
          <h2 className="text-4xl font-bold mb-2">Play Games Online for free</h2>
          <p className="text-muted-foreground mb-6">
            Choose from our collection of instant browser games. No downloads required!
          </p>
          
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium">Filter by category:</label>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                <SelectItem value="arcade">Arcade</SelectItem>
                <SelectItem value="puzzle">Puzzle</SelectItem>
                <SelectItem value="strategy">Strategy</SelectItem>
                <SelectItem value="action">Action</SelectItem>
                <SelectItem value="casual">Casual</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">
              {filteredGames.length} {filteredGames.length === 1 ? 'game' : 'games'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGames.map(game => (
            <GameCard key={game.game_id} game={game} onPlay={handlePlayGame} />
          ))}
        </div>

        {filteredGames.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">No games found in this category.</p>
          </div>
        )}
      </main>
    </div>
  );
}


