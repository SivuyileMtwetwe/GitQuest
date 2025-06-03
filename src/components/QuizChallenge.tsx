import React, { useState } from 'react';
import { Check, X, BookOpen } from 'lucide-react';
import { Challenge } from '../pages/Index';

interface QuizChallengeProps {
  challenge: Challenge;
  onComplete: (isCorrect: boolean) => void;
}

const QuizChallenge: React.FC<QuizChallengeProps> = ({ challenge, onComplete }) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleAnswerSelect = (answerIndex: number) => {
    if (hasAnswered) return;
    
    setSelectedAnswer(answerIndex);
    setHasAnswered(true);
    setShowExplanation(true);
    
    const isCorrect = answerIndex === challenge.correctAnswer;
    
    setTimeout(() => {
      onComplete(isCorrect);
      setSelectedAnswer(null);
      setHasAnswered(false);
      setShowExplanation(false);
    }, 3000);
  };

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

      <div className="space-y-3 md:space-y-4">
        {challenge.options?.map((option, index) => {
          const isSelected = selectedAnswer === index;
          const isCorrect = index === challenge.correctAnswer;
          const showResult = hasAnswered;

          let buttonClass = "w-full p-3 md:p-4 text-left rounded-xl border-2 transition-all duration-300 text-sm md:text-base ";
          
          if (!showResult) {
            buttonClass += "border-gray-300 bg-white hover:bg-gray-50 hover:border-gray-400";
          } else if (isSelected && isCorrect) {
            buttonClass += "border-green-500 bg-green-100 text-green-800";
          } else if (isSelected && !isCorrect) {
            buttonClass += "border-red-500 bg-red-100 text-red-800";
          } else if (!isSelected && isCorrect) {
            buttonClass += "border-green-500 bg-green-50 text-green-700";
          } else {
            buttonClass += "border-gray-300 bg-gray-50 text-gray-600";
          }

          return (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              disabled={hasAnswered}
              className={buttonClass}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{option}</span>
                {showResult && (
                  <div className="flex items-center">
                    {isSelected && isCorrect && <Check className="w-4 h-4 md:w-5 md:h-5 text-green-600" />}
                    {isSelected && !isCorrect && <X className="w-4 h-4 md:w-5 md:h-5 text-red-600" />}
                    {!isSelected && isCorrect && <Check className="w-4 h-4 md:w-5 md:h-5 text-green-600" />}
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {showExplanation && (
        <div className="mt-4 md:mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl animate-fade-in">
          <h3 className="font-semibold text-blue-800 mb-2">Explanation:</h3>
          <p className="text-sm md:text-base text-blue-700">{challenge.explanation}</p>
          
          {selectedAnswer === challenge.correctAnswer ? (
            <div className="mt-3 flex items-center text-green-600">
              <Check className="w-4 h-4 md:w-5 md:h-5 mr-2" />
              <span className="font-medium text-sm md:text-base">Correct! +50 points</span>
            </div>
          ) : (
            <div className="mt-3 flex items-center text-red-600">
              <X className="w-4 h-4 md:w-5 md:h-5 mr-2" />
              <span className="font-medium text-sm md:text-base">Incorrect. -25 points</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QuizChallenge;