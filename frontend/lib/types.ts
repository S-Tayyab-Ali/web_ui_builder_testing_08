export type GameCategory = 'arcade' | 'puzzle' | 'strategy' | 'action' | 'casual';

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface Game {
  game_id: string;
  title: string;
  description: string;
  category: GameCategory;
  thumbnail_url: string;
  difficulty_level: DifficultyLevel;
  play_count: number;
}

export interface Score {
  score_id: string;
  game_id: string;
  profile_id?: string;
  score_value: number;
  timestamp: string;
  game_duration: number;
  is_high_score: boolean;
}

export interface UserProfile {
  profile_id: string;
  username: string;
  created_date: string;
  last_active: string;
  theme_preference?: 'light' | 'dark' | 'system';
  sound_enabled: boolean;
}

export interface GameSession {
  session_id: string;
  game_id: string;
  start_time: string;
  current_score: number;
  game_state: Record<string, unknown>;
  is_paused: boolean;
}
