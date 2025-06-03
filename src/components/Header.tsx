import React from 'react';
import { Star, Award, TrendingUp, Menu, LogIn, LogOut } from 'lucide-react';
import { GameState } from '../pages/Index';
import { Button } from './ui/button';
import { ThemeToggle } from './ThemeToggle';
import { supabase } from '@/lib/supabase';

interface HeaderProps {
  gameState: GameState;
  onMenuClick: () => void;
  onAuthClick: () => void;
  user: any;
}

const Header: React.FC<HeaderProps> = ({ gameState, onMenuClick, onAuthClick, user }) => {
  const progressToNextLevel = (gameState.points % 100) / 100;
  const nextLevelPoints = 100 - (gameState.points % 100);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <header className="h-20 bg-card backdrop-blur-md border-b">
      <div className="h-full px-4 md:px-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={onMenuClick}
          >
            <Menu className="h-6 w-6" />
          </Button>
          <h1 className="text-lg md:text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            GitHub Learning Quest
          </h1>
        </div>
        
        <div className="flex items-center space-x-2 md:space-x-8">
          {/* Level Display - Always visible */}
          <div className="flex items-center space-x-1 md:space-x-2">
            <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-purple-600" />
            <span className="text-sm md:text-base font-semibold">Level {gameState.currentLevel}</span>
          </div>

          {/* Points Display - Always visible */}
          <div className="flex items-center space-x-1 md:space-x-2">
            <Star className="w-4 h-4 md:w-5 md:h-5 text-yellow-500" />
            <span className="text-sm md:text-base font-semibold">{gameState.points}</span>
          </div>

          {/* Achievements - Hidden on mobile */}
          <div className="hidden md:flex items-center space-x-2">
            <Award className="w-5 h-5 text-blue-600" />
            <span className="font-semibold">{gameState.achievements.length} badges</span>
          </div>

          {/* Progress Bar - Hidden on mobile */}
          <div className="hidden md:flex flex-col items-end">
            <div className="text-xs text-muted-foreground mb-1">
              {nextLevelPoints} pts to next level
            </div>
            <div className="w-32 h-2 bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-300 ease-out"
                style={{ width: `${progressToNextLevel * 100}%` }}
              />
            </div>
          </div>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Auth Button */}
          {user ? (
            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden md:inline">Sign Out</span>
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={onAuthClick}
              className="flex items-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span className="hidden md:inline">Sign In</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;