export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-steps',
    title: 'First Steps',
    description: 'Complete your first challenge',
    icon: '🎯'
  },
  {
    id: 'perfect-level',
    title: 'Perfect Score',
    description: 'Complete a level without any mistakes',
    icon: '⭐'
  },
  {
    id: 'git-master',
    title: 'Git Master',
    description: 'Complete all basic Git challenges',
    icon: '🏆'
  },
  {
    id: 'problem-solver',
    title: 'Problem Solver',
    description: 'Use the Error Solver 5 times',
    icon: '🔧'
  },
  {
    id: 'quick-learner',
    title: 'Quick Learner',
    description: 'Complete 3 challenges in under 5 minutes',
    icon: '⚡'
  },
  {
    id: 'persistent',
    title: 'Persistent',
    description: 'Try again after getting an answer wrong',
    icon: '💪'
  }
];