import { UserProfile, Score } from './types';

const STORAGE_KEYS = {
  PROFILE: 'gamehub_profile',
  SCORES: 'gamehub_scores',
  GAMES: 'gamehub_games'
};

// Profile Storage
export const saveProfile = (profile: UserProfile): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  }
};

export const getProfile = (): UserProfile | null => {
  if (typeof window === 'undefined') return null;
  
  const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
  return data ? JSON.parse(data) : null;
};

export const deleteProfile = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEYS.PROFILE);
  }
};

// Scores Storage
export const saveScore = (score: Score): void => {
  if (typeof window === 'undefined') return;
  
  const scores = getScores();
  scores.push(score);
  localStorage.setItem(STORAGE_KEYS.SCORES, JSON.stringify(scores));
};

export const getScores = (): Score[] => {
  if (typeof window === 'undefined') return [];
  
  const data = localStorage.getItem(STORAGE_KEYS.SCORES);
  return data ? JSON.parse(data) : [];
};

export const getScoresByGame = (gameId: string): Score[] => {
  return getScores().filter(score => score.game_id === gameId);
};

export const getHighScore = (gameId: string): number => {
  const gameScores = getScoresByGame(gameId);
  if (gameScores.length === 0) return 0;
  return Math.max(...gameScores.map(s => s.score_value));
};

export const deleteAllScores = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEYS.SCORES);
  }
};

// Games Storage (for play counts)
export const updateGamePlayCount = (gameId: string): void => {
  if (typeof window === 'undefined') return;
  
  const games = getGamesData();
  const game = games.find(g => g.game_id === gameId);
  
  if (game) {
    game.play_count++;
  } else {
    games.push({ game_id: gameId, play_count: 1 });
  }
  
  localStorage.setItem(STORAGE_KEYS.GAMES, JSON.stringify(games));
};

export const getGamePlayCount = (gameId: string): number => {
  if (typeof window === 'undefined') return 0;
  
  const games = getGamesData();
  const game = games.find(g => g.game_id === gameId);
  return game ? game.play_count : 0;
};

const getGamesData = (): { game_id: string; play_count: number }[] => {
  if (typeof window === 'undefined') return [];
  
  const data = localStorage.getItem(STORAGE_KEYS.GAMES);
  return data ? JSON.parse(data) : [];
};

// Export all data
export const exportAllData = (): string => {
  if (typeof window === 'undefined') return '';
  
  const data = {
    profile: getProfile(),
    scores: getScores(),
    games: getGamesData(),
    exportedAt: new Date().toISOString()
  };
  
  return JSON.stringify(data, null, 2);
};

// Clear all data
export const clearAllData = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEYS.PROFILE);
    localStorage.removeItem(STORAGE_KEYS.SCORES);
    localStorage.removeItem(STORAGE_KEYS.GAMES);
  }
};


