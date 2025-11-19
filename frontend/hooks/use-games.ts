"use client";

import { useState, useEffect } from 'react';
import { Game } from '@/lib/types';
import { mockGames } from '@/lib/mock-data';
import { updateGamePlayCount, getGamePlayCount } from '@/lib/storage';

export function useGames() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGames();
  }, []);

  const loadGames = () => {
    // Load games and update play counts from localStorage
    const gamesWithCounts = mockGames.map(game => ({
      ...game,
      play_count: getGamePlayCount(game.game_id)
    }));
    
    setGames(gamesWithCounts);
    setLoading(false);
  };

  const incrementPlayCount = (gameId: string) => {
    updateGamePlayCount(gameId);
    loadGames();
  };

  const getGameById = (gameId: string): Game | undefined => {
    return games.find(g => g.game_id === gameId);
  };

  return {
    games,
    loading,
    incrementPlayCount,
    getGameById
  };
}
