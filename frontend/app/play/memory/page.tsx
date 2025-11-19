"use client";

import { useEffect, useState, useCallback } from 'react';
import GameLayout from '@/components/game-layout';

const EMOJIS = ['🎮', '🎯', '🎨', '🎭', '🎪', '🎸', '🎺', '🎹'];

interface Card {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export default function MemoryGame() {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  const initializeGame = useCallback(() => {
    const shuffled = [...EMOJIS, ...EMOJIS]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false
      }));
    
    setCards(shuffled);
    setFlippedCards([]);
    setScore(1000);
    setMoves(0);
    setGameOver(false);
    setIsPaused(false);
    setGameStarted(false);
  }, []);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  const handleCardClick = useCallback((cardId: number) => {
    if (!gameStarted) {
      setGameStarted(true);
    }

    if (isPaused || gameOver) return;

    const card = cards.find(c => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched || flippedCards.length === 2) return;

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    setCards(prev =>
      prev.map(c => (c.id === cardId ? { ...c, isFlipped: true } : c))
    );

    if (newFlippedCards.length === 2) {
      setMoves(prev => prev + 1);
      setScore(prev => Math.max(0, prev - 10));

      const [firstId, secondId] = newFlippedCards;
      const firstCard = cards.find(c => c.id === firstId);
      const secondCard = cards.find(c => c.id === secondId);

      if (firstCard && secondCard && firstCard.emoji === secondCard.emoji) {
        setTimeout(() => {
          setCards(prev =>
            prev.map(c =>
              c.id === firstId || c.id === secondId
                ? { ...c, isMatched: true }
                : c
            )
          );
          setFlippedCards([]);

          const matchedCount = cards.filter(c => c.isMatched).length + 2;
          if (matchedCount === cards.length) {
            const finalScore = Math.max(0, 1000 - moves * 10);
            setScore(finalScore);
            if (finalScore > highScore) {
              setHighScore(finalScore);
            }
            setTimeout(() => setGameOver(true), 500);
          }
        }, 500);
      } else {
        setTimeout(() => {
          setCards(prev =>
            prev.map(c =>
              c.id === firstId || c.id === secondId
                ? { ...c, isFlipped: false }
                : c
            )
          );
          setFlippedCards([]);
        }, 1000);
      }
    }
  }, [cards, flippedCards, isPaused, gameOver, gameStarted, moves, highScore]);

  return (
    <GameLayout
      gameTitle="Memory Match"
      currentScore={score}
      isPaused={isPaused}
      onPause={() => setIsPaused(true)}
      onResume={() => setIsPaused(false)}
      onRestart={initializeGame}
      gameOver={gameOver}
      finalScore={score}
      highScore={highScore}
    >
      <div className="flex items-center justify-center h-full">
        <div className="relative">
          <div className="mb-4 text-center text-white">
            <p className="text-xl font-bold">Moves: {moves}</p>
          </div>
          
          <div className="grid grid-cols-4 gap-4 p-6 bg-gray-800 rounded-xl shadow-2xl">
            {cards.map(card => (
              <button
                key={card.id}
                onClick={() => handleCardClick(card.id)}
                disabled={card.isMatched || card.isFlipped || flippedCards.length === 2}
                className={`w-24 h-24 rounded-lg font-bold text-4xl transition-all duration-300 transform ${
                  card.isFlipped || card.isMatched
                    ? 'bg-white text-gray-800 scale-100'
                    : 'bg-purple-600 hover:bg-purple-700 scale-95 hover:scale-100'
                } ${card.isMatched ? 'opacity-50' : ''}`}
              >
                {card.isFlipped || card.isMatched ? card.emoji : '?'}
              </button>
            ))}
          </div>

          {!gameStarted && !gameOver && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl">
              <div className="text-center text-white">
                <p className="text-2xl font-bold mb-2">Click Any Card to Start</p>
                <p className="text-sm opacity-75">Match all pairs to win!</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </GameLayout>
  );
}
