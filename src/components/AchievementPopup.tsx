
import React, { useEffect } from 'react';
import { Award } from 'lucide-react';

interface AchievementPopupProps {
  achievement: string;
  onClose: () => void;
}

const AchievementPopup: React.FC<AchievementPopupProps> = ({ achievement, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-white/50 shadow-2xl p-8 text-center animate-scale-in max-w-md mx-4">
        <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
          <Award className="w-8 h-8 text-white" />
        </div>
        
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
          Achievement Unlocked!
        </h2>
        
        <p className="text-gray-700 text-lg font-medium mb-4">
          {achievement}
        </p>
        
        <div className="text-sm text-gray-600">
          Keep up the great work! 🎉
        </div>
        
        <button
          onClick={onClose}
          className="mt-6 px-6 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg font-medium hover:scale-105 transition-transform"
        >
          Continue Learning
        </button>
      </div>
    </div>
  );
};

export default AchievementPopup;
