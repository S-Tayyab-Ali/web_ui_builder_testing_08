import { Game } from './types';

export const mockGames: Game[] = [
  {
    game_id: 'snake',
    title: 'Snake Classic',
    description: 'Guide the snake to eat food and grow longer. Avoid hitting walls and yourself!',
    category: 'arcade',
    thumbnail_url: '🐍',
    difficulty_level: 'easy',
    play_count: 0
  },
  {
    game_id: 'memory',
    title: 'Memory Match',
    description: 'Test your memory by matching pairs of cards. How quickly can you find them all?',
    category: 'puzzle',
    thumbnail_url: '🧠',
    difficulty_level: 'easy',
    play_count: 0
  },
  {
    game_id: 'breakout',
    title: 'Breakout',
    description: 'Classic brick breaker game. Destroy all bricks with your ball and paddle!',
    category: 'arcade',
    thumbnail_url: '🧱',
    difficulty_level: 'medium',
    play_count: 0
  },
  {
    game_id: '2048',
    title: '2048',
    description: 'Slide numbered tiles to combine them and reach 2048. Simple yet addictive!',
    category: 'puzzle',
    thumbnail_url: '🔢',
    difficulty_level: 'medium',
    play_count: 0
  }
];
