
import React from 'react';
import { Lock, Check, Play, Star } from 'lucide-react';
import { Level } from '../pages/Index';

interface SidebarProps {
  levels: Level[];
  currentLevel: number;
  onSelectLevel: (levelId: number) => void;
  points?: number;
}

const Sidebar: React.FC<SidebarProps> = ({ levels, currentLevel, onSelectLevel, points = 0 }) => {
  // Define minimum points required for each level
  const levelRequirements = {
    1: 0,
    2: 150,
    3: 350,
    4: 600,
    5: 900,
    6: 1250,
    7: 1650,
    8: 2100
  };

  return (
    <div className="w-80 bg-white/20 backdrop-blur-md border-r border-white/30 p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Learning Path</h2>
      
      <div className="space-y-4">
        {levels.map((level) => {
          const isActive = level.id === currentLevel;
          const requiredPoints = levelRequirements[level.id as keyof typeof levelRequirements];
          const isAccessible = points >= requiredPoints;
          const pointsNeeded = Math.max(0, requiredPoints - points);
          
          return (
            <div
              key={level.id}
              onClick={() => isAccessible && onSelectLevel(level.id)}
              className={`
                p-4 rounded-xl border transition-all duration-300 cursor-pointer
                ${isActive 
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white border-transparent shadow-lg scale-105' 
                  : isAccessible
                    ? 'bg-white/30 border-white/50 hover:bg-white/40 hover:scale-102'
                    : 'bg-gray-100/30 border-gray-300/50 cursor-not-allowed opacity-60'
                }
              `}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className={`font-semibold ${isActive ? 'text-white' : 'text-gray-800'}`}>
                  Level {level.id}: {level.title}
                </h3>
                
                <div className="flex items-center">
                  {level.isCompleted ? (
                    <Check className="w-5 h-5 text-green-500" />
                  ) : isActive ? (
                    <Play className="w-5 h-5" />
                  ) : !isAccessible ? (
                    <Lock className="w-5 h-5 text-gray-400" />
                  ) : null}
                </div>
              </div>
              
              <p className={`text-sm ${isActive ? 'text-white/90' : 'text-gray-600'}`}>
                {level.description}
              </p>
              
              {!isAccessible && pointsNeeded > 0 && (
                <div className="mt-2 flex items-center text-xs text-red-600">
                  <Star className="w-3 h-3 mr-1" />
                  <span>Need {pointsNeeded} more points</span>
                </div>
              )}
              
              {isAccessible && (
                <div className="mt-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className={isActive ? 'text-white/80' : 'text-gray-500'}>
                      Progress
                    </span>
                    <span className={isActive ? 'text-white/80' : 'text-gray-500'}>
                      {level.challenges.length} challenges
                    </span>
                  </div>
                  <div className="w-full h-1 bg-gray-200/50 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ${
                        level.isCompleted 
                          ? 'bg-green-400' 
                          : isActive 
                            ? 'bg-white/60' 
                            : 'bg-purple-400'
                      }`}
                      style={{ 
                        width: level.isCompleted ? '100%' : isActive ? '50%' : '0%' 
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      <div className="mt-8 p-4 bg-white/20 rounded-xl border border-white/30">
        <h3 className="font-semibold text-gray-800 mb-2">Scoring System</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Correct answer: +50 points</li>
          <li>• Wrong answer: -25 points</li>
          <li>• Complete levels to unlock next ones</li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
