import { useState, useEffect } from 'react';
import { Achievement, ACHIEVEMENTS } from '../types/achievements';

export function useAchievements() {
  const [unlockedAchievements, setUnlockedAchievements] = useState<Achievement[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [latestAchievement, setLatestAchievement] = useState<Achievement | null>(null);

  useEffect(() => {
    // Load achievements from localStorage
    const saved = localStorage.getItem('achievements');
    if (saved) {
      setUnlockedAchievements(JSON.parse(saved));
    }
  }, []);

  const unlockAchievement = (achievementId: string) => {
    const achievement = ACHIEVEMENTS.find(a => a.id === achievementId);
    if (!achievement) return;

    const isAlreadyUnlocked = unlockedAchievements.some(a => a.id === achievementId);
    if (isAlreadyUnlocked) return;

    const newAchievement = {
      ...achievement,
      unlockedAt: new Date()
    };

    setUnlockedAchievements(prev => {
      const updated = [...prev, newAchievement];
      localStorage.setItem('achievements', JSON.stringify(updated));
      return updated;
    });

    setLatestAchievement(newAchievement);
    setShowPopup(true);
  };

  const hidePopup = () => {
    setShowPopup(false);
    setLatestAchievement(null);
  };

  return {
    achievements: unlockedAchievements,
    unlockAchievement,
    showPopup,
    latestAchievement,
    hidePopup
  };
}