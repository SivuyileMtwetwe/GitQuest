
import React from 'react';
import { Star, Award, TrendingUp } from 'lucide-react';
import { GameState } from '../pages/Index';

interface HeaderProps {
  gameState: GameState;
}

const Header: React.FC<HeaderProps> = ({ gameState }) => {
  const progressToNextLevel = (gameState.points % 100) / 100;
  const nextLevelPoints = 100 - (gameState.points % 100);

  return (
    <header className="h-20 bg-white/20 backdrop-blur-md border-b border-white/30">
      <div className="h-full px-6 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            GitHub Learning Quest
          </h1>
        </div>
        
        <div className="flex items-center space-x-8">
          {/* Level Display */}
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            <span className="text-gray-700 font-semibold">Level {gameState.currentLevel}</span>
          </div>

          {/* Points Display */}
          <div className="flex items-center space-x-2">
            <Star className="w-5 h-5 text-yellow-500" />
            <span className="text-gray-700 font-semibold">{gameState.points} pts</span>
          </div>

          {/* Achievements */}
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-blue-600" />
            <span className="text-gray-700 font-semibold">{gameState.achievements.length} badges</span>
          </div>

          {/* Progress Bar */}
          <div className="flex flex-col items-end">
            <div className="text-xs text-gray-600 mb-1">
              {nextLevelPoints} pts to next level
            </div>
            <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-300 ease-out"
                style={{ width: `${progressToNextLevel * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
