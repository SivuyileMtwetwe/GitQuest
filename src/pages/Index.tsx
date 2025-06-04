import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import MainContent from '../components/MainContent';
import Header from '../components/Header';
import { AuthModal } from '../components/AuthModal';
import { Leaderboard } from '../components/Leaderboard';
import { supabase, validateConnection } from '../lib/supabase';
import { useAchievements } from '../hooks/useAchievements';
import AchievementPopup from '../components/AchievementPopup';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';

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
  const [gameStarted, setGameStarted] = useState(false);
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
    {
      id: 1,
      title: "Introduction to Git",
      description: "Learn the basics of Git version control",
      isCompleted: false,
      challenges: [
        {
          id: 1,
          type: "quiz",
          question: "What is Git?",
          options: [
            "A distributed version control system",
            "A programming language",
            "A text editor",
            "An operating system"
          ],
          correctAnswer: 0,
          explanation: "Git is a distributed version control system that tracks changes in source code during software development. It allows multiple developers to work together on projects efficiently."
        },
        {
          id: 2,
          type: "terminal",
          question: "Initialize a Git repository",
          content: "Create a new Git repository in the current directory.",
          correctAnswer: "git init",
          explanation: "The 'git init' command creates a new Git repository in the current directory."
        }
      ]
    },
    {
      id: 2,
      title: "Basic Git Commands",
      description: "Master the essential Git commands",
      isCompleted: false,
      challenges: [
        {
          id: 3,
          type: "quiz",
          question: "What command is used to stage changes?",
          options: [
            "git commit",
            "git add",
            "git push",
            "git stage"
          ],
          correctAnswer: 1,
          explanation: "The 'git add' command adds changes to the staging area before committing."
        }
      ]
    },
    {
      id: 3,
      title: "Branching & Merging",
      description: "Learn to work with branches and merging",
      isCompleted: false,
      challenges: [
        {
          id: 4,
          type: "quiz",
          question: "What command creates a new branch?",
          options: [
            "git branch new-branch",
            "git checkout branch",
            "git create branch",
            "git new branch"
          ],
          correctAnswer: 0,
          explanation: "The 'git branch <name>' command creates a new branch with the specified name."
        }
      ]
    },
    {
      id: 4,
      title: "Remote Repositories",
      description: "Work with remote repositories and collaboration",
      isCompleted: false,
      challenges: [
        {
          id: 5,
          type: "quiz",
          question: "What command pushes changes to a remote repository?",
          options: [
            "git remote push",
            "git push origin main",
            "git send",
            "git upload"
          ],
          correctAnswer: 1,
          explanation: "The 'git push origin main' command pushes your local changes to the main branch of the remote repository."
        }
      ]
    },
    {
      id: 5,
      title: "Advanced Git",
      description: "Master advanced Git concepts and operations",
      isCompleted: false,
      challenges: [
        {
          id: 6,
          type: "quiz",
          question: "What is git rebase used for?",
          options: [
            "To delete a branch",
            "To rename a repository",
            "To integrate changes from one branch into another",
            "To create a remote repository"
          ],
          correctAnswer: 2,
          explanation: "Git rebase is used to integrate changes from one branch into another, creating a linear commit history."
        }
      ]
    }
  ]);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await validateConnection();
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
        if (session?.user) {
          await loadUserProgress(session.user.id);
        }
      } catch (err) {
        console.error('Failed to initialize app:', err);
      }
    };

    initializeApp();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        await loadUserProgress(session.user.id);
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

    for (let i = 0; i < retries; i++) {
      try {
        await validateConnection();

        const { error: insertError } = await supabase
          .from('profiles')
          .upsert({ 
            id: userId,
            username: `user_${userId.slice(0, 8)}`,
            created_at: new Date().toISOString()
          }, {
            onConflict: 'id'
          });

        if (insertError) {
          console.error(`Attempt ${i + 1}/${retries} - Error creating profile:`, insertError);
          if (!insertError.message.includes('unique constraint')) {
            await new Promise(resolve => setTimeout(resolve, Math.min(1000 * Math.pow(2, i), 10000)));
            continue;
          }
        }

        const { data, error } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', userId)
          .maybeSingle();

        if (error) {
          console.error(`Attempt ${i + 1}/${retries} - Error checking profile:`, error);
          await new Promise(resolve => setTimeout(resolve, Math.min(1000 * Math.pow(2, i), 10000)));
          continue;
        }

        if (data) {
          return true;
        }

        await new Promise(resolve => setTimeout(resolve, Math.min(1000 * Math.pow(2, i), 10000)));
      } catch (err) {
        console.error(`Attempt ${i + 1}/${retries} - Unexpected error:`, err);
        if (i < retries - 1) {
          await new Promise(resolve => setTimeout(resolve, Math.min(1000 * Math.pow(2, i), 10000)));
          continue;
        }
      }
    }
    
    return false;
  };

  const loadUserProgress = async (userId: string) => {
    if (!userId) {
      console.error('loadUserProgress: No userId provided');
      return;
    }

    try {
      setIsProgressLoaded(false);
      
      const profileExists = await waitForProfile(userId);
      if (!profileExists) {
        console.error('Profile not found after maximum retries');
        return;
      }

      const { data, error } = await supabase
        .from('scores')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          console.log('Initializing new user progress');
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

          setPoints(0);
          setCurrentLevel(1);
          setIsProgressLoaded(true);
          return;
        }
        console.error('Error loading progress:', error);
        return;
      }

      setPoints(data.points);
      setCurrentLevel(data.level);
      setIsProgressLoaded(true);
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
        }, {
          onConflict: 'user_id'
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

  const handleStartGame = () => {
    setGameStarted(true);
    setCurrentLevel(1);
    setChallengeIndex(0);
    setIncorrectAnswers(new Set());
  };

  const currentLevelData = levels.find(level => level.id === currentLevel);
  const currentChallenge = currentLevelData?.challenges[challengeIndex];

  const gameState: GameState = {
    currentLevel,
    points,
    achievements
  };

  if (!gameStarted) {
    return (
      <div className="flex flex-col h-screen bg-gradient-to-br from-gray-100 to-gray-200">
        <Header 
          gameState={gameState}
          onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
          onAuthClick={() => setIsAuthModalOpen(true)}
          user={user}
        />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-8 max-w-2xl mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Welcome to GitHub Learning Quest
            </h1>
            <p className="text-xl text-gray-600">
              Master Git through interactive challenges and level up your version control skills.
            </p>
            <Button
              size="lg"
              onClick={handleStartGame}
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-8 py-6 text-xl rounded-xl transform transition-transform hover:scale-105"
            >
              <Play className="w-6 h-6 mr-2" />
              Start Learning
            </Button>
          </div>
        </div>
      </div>
    );
  }

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