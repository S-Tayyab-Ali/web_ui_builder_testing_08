"use client";

import { User, Trophy, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="text-3xl">🎮</div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Game Hub
          </h1>
        </Link>

        <nav className="flex items-center gap-2">
          <Button 
            variant={pathname === '/' ? 'default' : 'ghost'} 
            size="sm" 
            asChild
          >
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              Games
            </Link>
          </Button>
          <Button 
            variant={pathname === '/scores' ? 'default' : 'ghost'} 
            size="sm" 
            asChild
          >
            <Link href="/scores">
              <Trophy className="w-4 h-4 mr-2" />
              Scores
            </Link>
          </Button>
          <Button 
            variant={pathname === '/profile' ? 'default' : 'ghost'} 
            size="sm" 
            asChild
          >
            <Link href="/profile">
              <User className="w-4 h-4 mr-2" />
              Profile
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
