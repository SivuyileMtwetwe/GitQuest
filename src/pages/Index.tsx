import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import MainContent from '../components/MainContent';
import Header from '../components/Header';
import { AuthModal } from '../components/AuthModal';
import { Leaderboard } from '../components/Leaderboard';
import { supabase } from '../lib/supabase';
import { useAchievements } from '../hooks/useAchievements';
import AchievementPopup from '../components/AchievementPopup';

export interface Challenge {
  id: number;
  type: 'quiz' | 'terminal';
  question: string;
  content?: string;
  options?: string[];
  correctAnswer: string | number;
  explanation: string;
}

export interface Level {
  id: number;
  title: string;
  description: string;
  isCompleted: boolean;
  challenges: Challenge[];
}

export interface GameState {
  currentLevel: number;
  points: number;
  achievements: any[];
}

const App: React.FC = () => {
  const [currentLevel, setCurrentLevel] = useState<number>(1);
  const [challengeIndex, setChallengeIndex] = useState<number>(0);
  const [points, setPoints] = useState<number>(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState<Set<number>>(new Set());
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isProgressLoaded, setIsProgressLoaded] = useState(false);
  const { achievements, unlockAchievement, showPopup, latestAchievement, hidePopup } = useAchievements();

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

  const [levels, setLevels] = useState<Level[]>([
    // ... (keep all the existing levels data exactly as in the original)
  ]);

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadUserProgress(session.user.id);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadUserProgress(session.user.id);
      } else {
        setIsProgressLoaded(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const waitForProfile = async (userId: string, retries = 5): Promise<boolean> => {
    if (!userId) {
      console.error('waitForProfile: No userId provided');
      return false;
    }

    console.log('Checking profile for user:', userId);

    for (let i = 0; i < retries; i++) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', userId)
          .maybeSingle();

        if (error) {
          console.error(`Attempt ${i + 1}/${retries} - Error checking profile:`, error);
          // Wait longer between retries as attempts increase
          await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
          continue;
        }

        if (data) {
          console.log('Profile found:', data);
          return true;
        }

        console.log(`Attempt ${i + 1}/${retries} - Profile not found, retrying...`);
        // Wait for 1 second before retrying
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (err) {
        console.error(`Attempt ${i + 1}/${retries} - Unexpected error:`, err);
        // Wait longer between retries as attempts increase
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
      }
    }
    
    console.error('Profile not found after maximum retries');
    return false;
  };

  const loadUserProgress = async (userId: string) => {
    if (!userId) {
      console.error('loadUserProgress: No userId provided');
      return;
    }

    try {
      console.log('Loading user progress for:', userId);
      setIsProgressLoaded(false);
      
      // Wait for profile to be created before proceeding
      const profileExists = await waitForProfile(userId);
      if (!profileExists) {
        console.error('Profile not found after maximum retries');
        return;
      }

      const { data, error } = await supabase
        .from('scores')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error loading progress:', error);
        return;
      }

      if (data) {
        // User has existing progress
        console.log('Loaded existing progress:', data);
        setPoints(data.points);
        setCurrentLevel(data.level);
        setIsProgressLoaded(true);
      } else {
        console.log('Initializing new user progress');
        // Initialize new user progress
        const { error: insertError } = await supabase
          .from('scores')
          .insert([
            {
              user_id: userId,
              points: 0,
              level: 1,
              achievements: '[]'
            }
          ]);

        if (insertError) {
          console.error('Error initializing user progress:', insertError);
          return;
        }

        // Set initial state
        setPoints(0);
        setCurrentLevel(1);
        setIsProgressLoaded(true);
      }
    } catch (err) {
      console.error('Unexpected error loading progress:', err);
    }
  };

  const saveProgress = async () => {
    if (!user || !isProgressLoaded) return;

    try {
      const { error } = await supabase
        .from('scores')
        .upsert({
          user_id: user.id,
          points,
          level: currentLevel,
          achievements: JSON.stringify(achievements)
        });

      if (error) {
        console.error('Error saving progress:', error);
      }
    } catch (err) {
      console.error('Unexpected error saving progress:', err);
    }
  };

  useEffect(() => {
    if (user && isProgressLoaded) {
      saveProgress();
    }
  }, [points, currentLevel, user, isProgressLoaded]);

  const handleSelectLevel = (levelId: number) => {
    setCurrentLevel(levelId);
    setChallengeIndex(0);
    setIncorrectAnswers(new Set());
    setIsSidebarOpen(false);
  };

  const handleChallengeComplete = (isCorrect: boolean) => {
    const currentLevelData = levels.find(level => level.id === currentLevel);

    if (currentLevelData) {
      const currentChallenge = currentLevelData.challenges[challengeIndex];
      
      if (isCorrect) {
        setIncorrectAnswers(prev => {
          const newSet = new Set(prev);
          newSet.delete(currentChallenge.id);
          return newSet;
        });
        
        setPoints(prevPoints => prevPoints + 50);
        
        const hasIncorrectAnswers = incorrectAnswers.size > 0 && !incorrectAnswers.has(currentChallenge.id);
        
        if (challengeIndex < currentLevelData.challenges.length - 1) {
          setChallengeIndex(prevIndex => prevIndex + 1);
        } else if (!hasIncorrectAnswers) {
          setLevels(prevLevels =>
            prevLevels.map(level =>
              level.id === currentLevel
                ? { ...level, isCompleted: true }
                : level
            )
          );

          const nextLevelId = currentLevel + 1;
          const nextLevelExists = levels.find(level => level.id === nextLevelId);
          
          if (nextLevelExists) {
            const newPoints = points + 50;
            const requiredPointsForNext = levelRequirements[nextLevelId as keyof typeof levelRequirements];
            
            if (newPoints >= requiredPointsForNext) {
              setTimeout(() => {
                setCurrentLevel(nextLevelId);
                setChallengeIndex(0);
                setIncorrectAnswers(new Set());
              }, 1500);
            }
          }
        } else {
          const firstIncorrectId = Array.from(incorrectAnswers)[0];
          const incorrectIndex = currentLevelData.challenges.findIndex(c => c.id === firstIncorrectId);
          setChallengeIndex(incorrectIndex);
        }
      } else {
        setIncorrectAnswers(prev => new Set(prev).add(currentChallenge.id));
        setPoints(prevPoints => Math.max(0, prevPoints - 25));
        
        if (challengeIndex < currentLevelData.challenges.length - 1) {
          setChallengeIndex(prevIndex => prevIndex + 1);
        } else {
          const firstIncorrectId = Array.from(incorrectAnswers)[0] || currentChallenge.id;
          const incorrectIndex = currentLevelData.challenges.findIndex(c => c.id === firstIncorrectId);
          setChallengeIndex(incorrectIndex);
        }
      }
    }
  };

  const currentLevelData = levels.find(level => level.id === currentLevel);
  const currentChallenge = currentLevelData?.challenges[challengeIndex];

  const gameState: GameState = {
    currentLevel,
    points,
    achievements
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <Header 
        gameState={gameState}
        onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
        onAuthClick={() => setIsAuthModalOpen(true)}
        user={user}
      />
      <div className="flex flex-1 relative">
        <Sidebar
          levels={levels}
          currentLevel={currentLevel}
          onSelectLevel={handleSelectLevel}
          points={points}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        <div className="flex-1 flex flex-col md:flex-row gap-6 p-4 overflow-y-auto">
          <div className="flex-1">
            <MainContent
              level={currentLevelData}
              challenge={currentChallenge}
              challengeIndex={challengeIndex}
              onChallengeComplete={handleChallengeComplete}
              points={points}
            />
          </div>
          {user && (
            <div className="md:w-80">
              <Leaderboard />
            </div>
          )}
        </div>
      </div>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />

      {showPopup && latestAchievement && (
        <AchievementPopup 
          achievement={latestAchievement}
          onClose={hidePopup}
        />
      )}
    </div>
  );
};

export default App;