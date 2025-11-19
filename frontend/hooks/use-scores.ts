"use client";

import { useState, useEffect } from 'react';
import { Score } from '@/lib/types';
import { getScores, saveScore, deleteAllScores as deleteAllScoresStorage, getHighScore } from '@/lib/storage';

export function useScores(gameId?: string) {
  const [scores, setScores] = useState<Score[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadScores();
  }, [gameId]);

  const loadScores = () => {
    const allScores = getScores();
    const filteredScores = gameId 
      ? allScores.filter(s => s.game_id === gameId)
      : allScores;
    
    // Sort by score value descending
    filteredScores.sort((a, b) => b.score_value - a.score_value);
    
    setScores(filteredScores);
    setLoading(false);
  };

  const addScore = (gameId: string, scoreValue: number, gameDuration: number = 0) => {
    const highScore = getHighScore(gameId);
    const isHighScore = scoreValue > highScore;

    const newScore: Score = {
      score_id: `score_${Date.now()}_${Math.random()}`,
      game_id: gameId,
      score_value: scoreValue,
      timestamp: new Date().toISOString(),
      game_duration: gameDuration,
      is_high_score: isHighScore
    };

    saveScore(newScore);
    loadScores();
    return newScore;
  };

  const deleteAllScores = () => {
    deleteAllScoresStorage();
    loadScores();
  };

  const getGameHighScore = (gameId: string): number => {
    return getHighScore(gameId);
  };

  return {
    scores,
    loading,
    addScore,
    deleteAllScores,
    getGameHighScore
  };
}
