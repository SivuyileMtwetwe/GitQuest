import React, { useState } from 'react';
import QuizChallenge from './QuizChallenge';
import TerminalChallenge from './TerminalChallenge';
import ErrorSolver from './ErrorSolver';
import { Level, Challenge } from '../pages/Index';
import { Button } from './ui/button';
import { Bug, BookOpen, Play } from 'lucide-react';

interface MainContentProps {
  level?: Level;
  challenge?: Challenge;
  challengeIndex: number;
  onChallengeComplete: (isCorrect: boolean) => void;
  points?: number;
}

const MainContent: React.FC<MainContentProps> = ({ 
  level, 
  challenge, 
  challengeIndex, 
  onChallengeComplete,
  points = 0
}) => {
  const [showErrorSolver, setShowErrorSolver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  if (!level) {
    return (
      <div className="flex-1 p-4 md:p-8 flex items-center justify-center">
        <div className="text-center space-y-6 w-full max-w-md mx-auto">
          {!gameStarted ? (
            <div className="bg-white/30 backdrop-blur-md rounded-xl p-8 border border-white/50 shadow-lg">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
                Welcome to GitHub Learning Quest!
              </h2>
              <p className="text-gray-600 mb-8">
                Master Git through interactive challenges and level up your version control skills.
              </p>
              <Button
                size="lg"
                onClick={() => setGameStarted(true)}
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-lg"
              >
                <Play className="w-5 h-5 mr-2" />
                Start Learning
              </Button>
            </div>
          ) : (
            <>
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
                  Select a level from the menu to begin!
                </h2>
                <p className="text-gray-600">Choose your starting point and begin your Git journey.</p>
              </div>
              
              <div className="bg-white/30 backdrop-blur-md rounded-xl p-4 md:p-6 border border-white/50">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Need Help with Terminal Errors?</h3>
                <p className="text-gray-600 mb-4">
                  Having trouble with Git commands? Use our error solver to get instant solutions.
                </p>
                <Button
                  onClick={() => setShowErrorSolver(true)}
                  className="w-full md:w-auto bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600"
                >
                  <Bug className="w-4 h-4 mr-2" />
                  Open Error Solver
                </Button>
              </div>

              {showErrorSolver && (
                <div className="max-w-4xl mx-auto">
                  <div className="mb-4">
                    <Button
                      variant="outline"
                      onClick={() => setShowErrorSolver(false)}
                      className="mb-4"
                    >
                      ← Back to Welcome
                    </Button>
                  </div>
                  <div className="bg-white/30 backdrop-blur-md rounded-xl p-4 md:p-8 border border-white/50 shadow-lg">
                    <ErrorSolver />
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  }

  if (!challenge) {
    const levelRequirements = { 1: 0, 2: 150, 3: 350, 4: 600, 5: 900, 6: 1250, 7: 1650, 8: 2100 };
    const requiredPoints = levelRequirements[level.id as keyof typeof levelRequirements];
    
    if (points < requiredPoints) {
      return (
        <div className="flex-1 p-4 md:p-8 flex items-center justify-center">
          <div className="text-center bg-white/30 backdrop-blur-md rounded-xl p-6 md:p-8 border border-white/50">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">Level Locked</h2>
            <p className="text-gray-600 mb-4">
              You need {requiredPoints - points} more points to unlock {level.title}.
            </p>
            <p className="text-sm text-gray-500">
              Complete previous challenges to earn more points!
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="flex-1 p-4 md:p-8 flex items-center justify-center">
        <div className="text-center bg-white/30 backdrop-blur-md rounded-xl p-6 md:p-8 border border-white/50">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">🎉 Level Complete!</h2>
          <p className="text-gray-600">
            Congratulations! You've completed all challenges in {level.title}.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 md:p-8 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              {level.title}
            </h1>
            <div className="flex items-center justify-between md:justify-end gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowErrorSolver(!showErrorSolver)}
                className="text-sm"
              >
                <Bug className="w-4 h-4 mr-1" />
                Error Solver
              </Button>
              <div className="text-sm text-gray-600">
                Challenge {challengeIndex + 1} of {level.challenges.length}
              </div>
            </div>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-500"
              style={{ width: `${((challengeIndex) / level.challenges.length) * 100}%` }}
            />
          </div>
        </div>

        {showErrorSolver ? (
          <div className="bg-white/30 backdrop-blur-md rounded-xl p-4 md:p-8 border border-white/50 shadow-lg">
            <ErrorSolver />
          </div>
        ) : (
          <div className="bg-white/30 backdrop-blur-md rounded-xl p-4 md:p-8 border border-white/50 shadow-lg">
            {challenge.type === 'quiz' ? (
              <QuizChallenge challenge={challenge} onComplete={onChallengeComplete} />
            ) : (
              <TerminalChallenge challenge={challenge} onComplete={onChallengeComplete} />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MainContent;