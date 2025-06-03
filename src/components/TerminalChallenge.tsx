import React, { useState } from 'react';
import { Check, X, BookOpen } from 'lucide-react';
import { Challenge } from '../pages/Index';

interface TerminalChallengeProps {
  challenge: Challenge;
  onComplete: (isCorrect: boolean) => void;
}

const TerminalChallenge: React.FC<TerminalChallengeProps> = ({ challenge, onComplete }) => {
  const [userInput, setUserInput] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (hasSubmitted) return;

    setHasSubmitted(true);
    setShowResult(true);

    const correctAnswer = String(challenge.correctAnswer).toLowerCase();
    const isCorrect = userInput.trim().toLowerCase() === correctAnswer;
    
    setTimeout(() => {
      onComplete(isCorrect);
      setUserInput('');
      setHasSubmitted(false);
      setShowResult(false);
    }, 3000);
  };

  const correctAnswer = String(challenge.correctAnswer).toLowerCase();
  const isCorrect = userInput.trim().toLowerCase() === correctAnswer;

  return (
    <div className="space-y-4 md:space-y-6">
      {challenge.content && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 md:p-6 mb-4 md:mb-6">
          <div className="flex items-center mb-2 md:mb-3">
            <BookOpen className="w-4 h-4 md:w-5 md:h-5 text-blue-600 mr-2" />
            <h3 className="font-semibold text-blue-800">Learn First</h3>
          </div>
          <div className="text-sm md:text-base text-blue-700 leading-relaxed">
            {challenge.content}
          </div>
        </div>
      )}

      <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6">
        {challenge.question}
      </h2>

      <div className="bg-gray-900 rounded-xl p-4 md:p-6 font-mono text-sm md:text-base">
        <div className="text-green-400 mb-4">
          user@github-quest:~$
        </div>
        
        <form onSubmit={handleSubmit} className="flex items-center">
          <span className="text-green-400 mr-2">$</span>
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            disabled={hasSubmitted}
            className="flex-1 bg-transparent text-white outline-none placeholder-gray-500"
            placeholder="Type your Git command here..."
            autoFocus
          />
        </form>

        {showResult && (
          <div className="mt-4 pt-4 border-t border-gray-700">
            {isCorrect ? (
              <div className="text-green-400">
                ✓ Command executed successfully!
              </div>
            ) : (
              <div className="text-red-400">
                ✗ Command not recognized. Try again!
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="text-sm text-gray-600">
          Hint: Use the exact Git command syntax
        </div>
        
        {!hasSubmitted && (
          <button
            onClick={handleSubmit}
            disabled={!userInput.trim()}
            className="w-full md:w-auto px-6 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg font-medium hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            Execute Command
          </button>
        )}
      </div>

      {showResult && (
        <div className="mt-4 md:mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl animate-fade-in">
          <h3 className="font-semibold text-blue-800 mb-2">Explanation:</h3>
          <p className="text-sm md:text-base text-blue-700">{challenge.explanation}</p>
          
          {isCorrect ? (
            <div className="mt-3 flex items-center text-green-600">
              <Check className="w-4 h-4 md:w-5 md:h-5 mr-2" />
              <span className="font-medium text-sm md:text-base">Correct! +50 points</span>
            </div>
          ) : (
            <div className="mt-3 flex items-center text-red-600">
              <X className="w-4 h-4 md:w-5 md:h-5 mr-2" />
              <span className="font-medium text-sm md:text-base">Incorrect. -25 points. The correct command is: {challenge.correctAnswer}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TerminalChallenge;