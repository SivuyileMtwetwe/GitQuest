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
      title: "Git Fundamentals",
      description: "Learn the core concepts of Git version control",
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
          explanation: "Git is a distributed version control system that tracks changes in source code during software development."
        },
        {
          id: 2,
          type: "quiz",
          question: "What are the three states of Git?",
          options: [
            "Modified, Staged, Committed",
            "Created, Updated, Deleted",
            "Local, Remote, Origin",
            "Push, Pull, Merge"
          ],
          correctAnswer: 0,
          explanation: "Files in Git can be in three states: Modified (changes made), Staged (marked for next commit), and Committed (safely stored)."
        }
      ]
    },
    {
      id: 2,
      title: "Working Directory & Staging",
      description: "Master the Git workflow and staging area",
      isCompleted: false,
      challenges: [
        {
          id: 3,
          type: "terminal",
          question: "Stage all modified files for commit",
          content: "Use the appropriate Git command to add all changed files to the staging area.",
          correctAnswer: "git add .",
          explanation: "git add . adds all modified and untracked files in the current directory to the staging area."
        },
        {
          id: 4,
          type: "quiz",
          question: "What is the staging area in Git?",
          options: [
            "A temporary storage for changes before committing",
            "The final repository location",
            "A backup system",
            "The remote server"
          ],
          correctAnswer: 0,
          explanation: "The staging area is an intermediate area where changes are prepared before committing."
        }
      ]
    },
    {
      id: 3,
      title: "Commits & History",
      description: "Learn about commits and viewing history",
      isCompleted: false,
      challenges: [
        {
          id: 5,
          type: "terminal",
          question: "Create a commit with a message",
          content: "Commit your staged changes with the message 'Initial commit'",
          correctAnswer: "git commit -m \"Initial commit\"",
          explanation: "This command creates a new commit with the specified message."
        },
        {
          id: 6,
          type: "quiz",
          question: "What command shows the commit history?",
          options: [
            "git log",
            "git history",
            "git show",
            "git list"
          ],
          correctAnswer: 0,
          explanation: "git log shows the commit history, including commit messages, authors, and timestamps."
        }
      ]
    },
    {
      id: 4,
      title: "Branching Basics",
      description: "Work with branches and merging",
      isCompleted: false,
      challenges: [
        {
          id: 7,
          type: "terminal",
          question: "Create and switch to a new branch",
          content: "Create a new branch named 'feature' and switch to it",
          correctAnswer: "git checkout -b feature",
          explanation: "git checkout -b creates a new branch and switches to it in one command."
        },
        {
          id: 8,
          type: "quiz",
          question: "What does HEAD represent in Git?",
          options: [
            "The current branch or commit",
            "The first commit in history",
            "The remote repository",
            "The main branch"
          ],
          correctAnswer: 0,
          explanation: "HEAD is a pointer that represents the current branch or commit you're working on."
        }
      ]
    },
    {
      id: 5,
      title: "Remote Operations",
      description: "Work with remote repositories",
      isCompleted: false,
      challenges: [
        {
          id: 9,
          type: "terminal",
          question: "Add a remote repository",
          content: "Add a remote named 'origin' with URL 'https://github.com/user/repo.git'",
          correctAnswer: "git remote add origin https://github.com/user/repo.git",
          explanation: "This command adds a new remote repository with the specified URL."
        },
        {
          id: 10,
          type: "quiz",
          question: "What's the difference between git fetch and git pull?",
          options: [
            "fetch downloads changes without merging, pull downloads and merges",
            "fetch only works with branches, pull works with all files",
            "fetch is for remote repos, pull is for local only",
            "There is no difference"
          ],
          correctAnswer: 0,
          explanation: "git fetch downloads changes but doesn't merge them, while git pull downloads and automatically merges changes."
        }
      ]
    },
    {
      id: 6,
      title: "Merge Conflicts",
      description: "Handle and resolve merge conflicts",
      isCompleted: false,
      challenges: [
        {
          id: 11,
          type: "quiz",
          question: "When do merge conflicts occur?",
          options: [
            "When two branches modify the same file differently",
            "When creating a new branch",
            "When pushing to remote",
            "When using git status"
          ],
          correctAnswer: 0,
          explanation: "Merge conflicts occur when Git can't automatically merge changes because two branches modified the same part of a file differently."
        }
      ]
    },
    {
      id: 7,
      title: "Git Flow",
      description: "Learn the Git Flow branching model",
      isCompleted: false,
      challenges: [
        {
          id: 12,
          type: "quiz",
          question: "What are the two main branches in Git Flow?",
          options: [
            "master/main and develop",
            "staging and production",
            "test and live",
            "feature and bugfix"
          ],
          correctAnswer: 0,
          explanation: "Git Flow uses master/main for production code and develop as the integration branch for features."
        }
      ]
    },
    {
      id: 8,
      title: "Advanced Git",
      description: "Master advanced Git operations",
      isCompleted: false,
      challenges: [
        {
          id: 13,
          type: "quiz",
          question: "What does git rebase do?",
          options: [
            "Rewrite commit history to create a linear history",
            "Delete all commits",
            "Create a new repository",
            "Push to remote"
          ],
          correctAnswer: 0,
          explanation: "git rebase rewrites commit history by moving or combining commits, creating a linear project history."
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