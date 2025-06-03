
import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import MainContent from '../components/MainContent';
import Header from '../components/Header';

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
  const [achievements] = useState<any[]>([]);
  const [incorrectAnswers, setIncorrectAnswers] = useState<Set<number>>(new Set());
  
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

  const [levels, setLevels] = useState<Level[]>([
    {
      id: 1,
      title: "VS Code & Git Setup",
      description: "Set up VS Code with Git and create your first repository",
      isCompleted: false,
      challenges: [
        {
          id: 1,
          type: "quiz",
          question: "What do you need to install before using Git in VS Code?",
          content: "Before you can use Git with VS Code, you need to have Git installed on your computer. VS Code has built-in Git support, but it requires the Git software to be installed separately. You can download Git from git-scm.com and VS Code will automatically detect it.",
          options: ["Only VS Code", "Git software and VS Code", "GitHub Desktop", "Node.js and npm"],
          correctAnswer: 1,
          explanation: "You need both Git software installed on your system and VS Code. VS Code has built-in Git integration but requires Git to be installed separately."
        },
        {
          id: 2,
          type: "terminal",
          question: "What command configures your name for Git commits?",
          content: "Before making your first commit, you need to tell Git who you are. This information will be attached to every commit you make. Setting your name and email is a one-time setup that Git will remember for all your projects.",
          correctAnswer: "git config --global user.name",
          explanation: "Use 'git config --global user.name \"Your Name\"' to set your name globally for all Git repositories on your computer."
        },
        {
          id: 3,
          type: "terminal",
          question: "What command configures your email for Git commits?",
          content: "Along with your name, Git needs your email address to identify your commits. This email should match the one you use for your GitHub account if you plan to use GitHub for hosting your repositories.",
          correctAnswer: "git config --global user.email",
          explanation: "Use 'git config --global user.email \"your.email@example.com\"' to set your email globally for all Git repositories."
        },
        {
          id: 4,
          type: "quiz",
          question: "Where can you see Git status and changes in VS Code?",
          content: "VS Code provides a visual interface for Git operations. The Source Control panel shows your repository status, staged and unstaged changes, and allows you to perform Git operations with clicks instead of terminal commands.",
          options: ["File Explorer", "Source Control panel (Git icon)", "Terminal only", "Extensions panel"],
          correctAnswer: 1,
          explanation: "The Source Control panel (Git icon in the sidebar) shows your Git repository status, changes, and provides a visual interface for Git operations."
        }
      ]
    },
    {
      id: 2,
      title: "Creating Your First Repository",
      description: "Learn to create and initialize a Git repository",
      isCompleted: false,
      challenges: [
        {
          id: 5,
          type: "terminal",
          question: "How do you initialize a new Git repository in your project folder?",
          content: "When you start a new project, you need to initialize Git tracking in your project folder. This creates a hidden .git folder that contains all the version control information. You should run this command in your project's root directory.",
          correctAnswer: "git init",
          explanation: "'git init' creates a new Git repository in the current directory, setting up the necessary .git folder structure for version control."
        },
        {
          id: 6,
          type: "quiz",
          question: "What should you create before making your first commit?",
          content: "Before committing code to a repository, especially one that will be shared publicly, you should create a .gitignore file. This file tells Git which files and folders to ignore, such as temporary files, dependencies, and sensitive information.",
          options: ["A README file", "A .gitignore file", "A package.json file", "A license file"],
          correctAnswer: 1,
          explanation: "A .gitignore file is essential to prevent committing unnecessary files like node_modules, temporary files, and sensitive data to your repository."
        },
        {
          id: 7,
          type: "terminal",
          question: "How do you stage all files for your first commit?",
          content: "After initializing your repository and creating necessary files, you need to stage them for commit. Staging tells Git which changes you want to include in your next commit. The dot (.) represents all files in the current directory.",
          correctAnswer: "git add .",
          explanation: "'git add .' stages all new and modified files in the current directory and subdirectories for the next commit."
        },
        {
          id: 8,
          type: "terminal",
          question: "How do you make your first commit with a message?",
          content: "A commit saves your staged changes to the Git history with a descriptive message. Your first commit is often called 'Initial commit' and represents the starting point of your project's version history.",
          correctAnswer: "git commit -m",
          explanation: "'git commit -m \"Initial commit\"' creates your first commit with a descriptive message. The -m flag allows you to add the message inline."
        }
      ]
    },
    {
      id: 3,
      title: "Connecting to GitHub",
      description: "Connect your local repository to GitHub for backup and sharing",
      isCompleted: false,
      challenges: [
        {
          id: 9,
          type: "quiz",
          question: "Why should you connect your local repository to GitHub?",
          content: "GitHub serves as a remote backup of your code and enables collaboration with others. It provides a web interface to view your code, track issues, and manage pull requests. Having your code on GitHub also makes it accessible from anywhere and serves as a portfolio for potential employers.",
          options: ["Only for backup", "Backup, collaboration, and portfolio showcase", "Just for sharing", "Only for open source projects"],
          correctAnswer: 1,
          explanation: "GitHub provides backup, enables collaboration with team members, and serves as a portfolio to showcase your projects to potential employers or collaborators."
        },
        {
          id: 10,
          type: "terminal",
          question: "How do you add a GitHub repository as your remote origin?",
          content: "After creating a repository on GitHub, you need to connect your local repository to it. The 'origin' is the conventional name for your main remote repository. This establishes the connection between your local code and GitHub.",
          correctAnswer: "git remote add origin",
          explanation: "'git remote add origin <repository-url>' connects your local repository to a GitHub repository, where <repository-url> is the URL from your GitHub repo."
        },
        {
          id: 11,
          type: "terminal",
          question: "How do you push your code to GitHub for the first time?",
          content: "After connecting to your GitHub repository, you need to upload your commits. The first push requires special flags to set up the tracking relationship between your local branch and the remote branch.",
          correctAnswer: "git push -u origin main",
          explanation: "'git push -u origin main' uploads your commits to GitHub and sets up tracking so future pushes can be done with just 'git push'."
        },
        {
          id: 12,
          type: "quiz",
          question: "What does the '-u' flag do in 'git push -u origin main'?",
          content: "The '-u' (or '--set-upstream') flag establishes a tracking relationship between your local branch and the remote branch. This means that in the future, you can use just 'git push' or 'git pull' without specifying the remote and branch names.",
          options: ["Makes the push faster", "Sets up branch tracking for easier future pushes", "Makes the push more secure", "Creates a backup"],
          correctAnswer: 1,
          explanation: "The '-u' flag sets up upstream tracking, so future git push and git pull commands know which remote branch to use automatically."
        }
      ]
    },
    {
      id: 4,
      title: "Daily Git Workflow",
      description: "Master the daily workflow of committing and pushing changes",
      isCompleted: false,
      challenges: [
        {
          id: 13,
          type: "quiz",
          question: "What's the recommended workflow for daily coding?",
          content: "A good daily Git workflow involves checking status, staging changes, committing with descriptive messages, and pushing to keep your remote repository up to date. This creates a clear history and ensures your work is backed up regularly.",
          options: ["Code all day, commit once", "Status → Stage → Commit → Push regularly", "Only commit when project is finished", "Push without committing"],
          correctAnswer: 1,
          explanation: "The best practice is to regularly check status, stage changes, commit with clear messages, and push to keep your remote repository current."
        },
        {
          id: 14,
          type: "terminal",
          question: "How do you check what files have been modified?",
          content: "Before staging and committing, it's important to see what changes you've made. This command shows you which files are modified, which are staged, and which are untracked, helping you understand the current state of your project.",
          correctAnswer: "git status",
          explanation: "'git status' shows the current state of your working directory and staging area, displaying modified, staged, and untracked files."
        },
        {
          id: 15,
          type: "terminal",
          question: "How do you see the specific changes in your files?",
          content: "Sometimes you want to see exactly what changes you've made to your files before committing them. This command shows you line-by-line differences between your current files and the last committed version.",
          correctAnswer: "git diff",
          explanation: "'git diff' shows the exact line-by-line changes in your modified files, helping you review what you've changed before committing."
        },
        {
          id: 16,
          type: "terminal",
          question: "After making changes, how do you push them to GitHub?",
          content: "Once you've set up the upstream tracking with your first push, subsequent pushes are simpler. This command uploads all your new commits to GitHub, keeping your remote repository synchronized with your local work.",
          correctAnswer: "git push",
          explanation: "'git push' uploads your new commits to the remote repository (GitHub) after you've set up upstream tracking."
        }
      ]
    },
    {
      id: 5,
      title: "Collaborating with Others",
      description: "Learn to work with team members using Git",
      isCompleted: false,
      challenges: [
        {
          id: 17,
          type: "terminal",
          question: "How do you get the latest changes from your team?",
          content: "When working with others, they'll be pushing their changes to the shared repository. You need to download these changes to stay up to date and avoid conflicts. This command downloads and merges the latest changes into your local branch.",
          correctAnswer: "git pull",
          explanation: "'git pull' downloads the latest changes from the remote repository and merges them into your current local branch."
        },
        {
          id: 18,
          type: "quiz",
          question: "When should you pull changes from the remote repository?",
          content: "Pulling regularly helps prevent large merge conflicts and keeps you working with the most current version of the project. It's especially important before starting new work and before pushing your own changes.",
          options: ["Only when you're done coding", "Before starting work and before pushing", "Once a week", "Only when there are conflicts"],
          correctAnswer: 1,
          explanation: "You should pull before starting new work and before pushing your changes to minimize conflicts and stay current with team updates."
        },
        {
          id: 19,
          type: "quiz",
          question: "What happens if you and a teammate edit the same lines?",
          content: "When multiple people edit the same lines of code, Git cannot automatically decide which version to keep. This creates a merge conflict that requires manual resolution. You'll need to decide which changes to keep or how to combine them.",
          options: ["Git automatically chooses the best version", "A merge conflict occurs requiring manual resolution", "The first person's changes are kept", "Both changes are automatically combined"],
          correctAnswer: 1,
          explanation: "When the same lines are edited by different people, Git creates a merge conflict that requires manual resolution to decide which changes to keep."
        },
        {
          id: 20,
          type: "quiz",
          question: "How should you resolve a merge conflict in VS Code?",
          content: "VS Code provides a user-friendly interface for resolving merge conflicts. It shows you the conflicting sections and provides options to accept incoming changes, accept current changes, or manually edit to combine both versions.",
          options: ["Delete the conflicted file", "Use VS Code's merge conflict interface", "Always keep your version", "Restart the project"],
          correctAnswer: 1,
          explanation: "VS Code's merge conflict interface allows you to visually compare conflicting changes and choose how to resolve them using helpful buttons and highlighting."
        }
      ]
    },
    {
      id: 6,
      title: "Git Flow for Teams",
      description: "Implement Git Flow workflow for organized team development",
      isCompleted: false,
      challenges: [
        {
          id: 21,
          type: "quiz",
          question: "What are the main branches in Git Flow?",
          content: "Git Flow uses a structured branching model with specific purposes for each branch type. The main branches are 'main' (production-ready code) and 'develop' (integration branch for features). This separation allows for stable releases while ongoing development continues.",
          options: ["main and feature", "main and develop", "develop and release", "feature and hotfix"],
          correctAnswer: 1,
          explanation: "Git Flow uses 'main' for production-ready code and 'develop' as the integration branch where features are merged before release."
        },
        {
          id: 22,
          type: "terminal",
          question: "How do you create a new feature branch for your work?",
          content: "In Git Flow, each new feature should be developed in its own branch. Feature branches are created from the develop branch and allow you to work on new functionality without affecting the main development line. The naming convention typically includes 'feature/' prefix.",
          correctAnswer: "git checkout -b feature/",
          explanation: "'git checkout -b feature/your-feature-name' creates and switches to a new feature branch for isolated development work."
        },
        {
          id: 23,
          type: "quiz",
          question: "Where should you merge your feature branch when it's complete?",
          content: "When you finish working on a feature, it should be merged back into the develop branch. This integrates your new feature with other completed features and prepares it for the next release. The main branch is reserved for production-ready releases.",
          options: ["Into main branch", "Into develop branch", "Into another feature branch", "Delete it without merging"],
          correctAnswer: 1,
          explanation: "Feature branches merge into the develop branch to integrate new features with ongoing development work before the next release."
        },
        {
          id: 24,
          type: "quiz",
          question: "What is a Pull Request used for in team collaboration?",
          content: "A Pull Request (PR) is a way to propose merging your feature branch into another branch (usually develop). It allows team members to review your code, suggest improvements, discuss changes, and ensure quality before the merge happens.",
          options: ["To download code", "To request code review before merging", "To delete branches", "To create backups"],
          correctAnswer: 1,
          explanation: "Pull Requests enable code review and discussion before merging, ensuring code quality and knowledge sharing among team members."
        }
      ]
    },
    {
      id: 7,
      title: "Handling Common Issues",
      description: "Learn to troubleshoot and fix common Git problems",
      isCompleted: false,
      challenges: [
        {
          id: 25,
          type: "quiz",
          question: "What should you do if you make a commit with a typo in the message?",
          content: "If you make a typo in your most recent commit message and haven't pushed yet, you can easily fix it. However, if the commit has been pushed and shared with others, it's better to leave it as is to avoid rewriting shared history.",
          options: ["Delete the commit", "Use git commit --amend", "Create a new commit", "Ignore the typo"],
          correctAnswer: 1,
          explanation: "'git commit --amend' allows you to modify the most recent commit message, but only use this before pushing to avoid rewriting shared history."
        },
        {
          id: 26,
          type: "terminal",
          question: "How do you undo changes to a file before committing?",
          content: "Sometimes you make changes to a file but want to discard them and return to the last committed version. This is useful when you've made experimental changes that didn't work out or accidentally modified a file.",
          correctAnswer: "git checkout",
          explanation: "'git checkout -- filename' discards uncommitted changes to a specific file, reverting it to the last committed version."
        },
        {
          id: 27,
          type: "quiz",
          question: "What should you do if 'git push' is rejected?",
          content: "When your push is rejected, it usually means someone else has pushed changes to the remote repository since your last pull. You need to get their changes first before you can push your changes. This prevents losing other people's work.",
          options: ["Force push anyway", "Pull first, then push", "Delete your changes", "Create a new repository"],
          correctAnswer: 1,
          explanation: "When push is rejected, pull the latest changes first to integrate them with your work, then push your combined changes."
        },
        {
          id: 28,
          type: "terminal",
          question: "How do you save your current work temporarily to pull updates?",
          content: "Sometimes you're in the middle of work when you need to pull updates from the team. Git stash temporarily saves your uncommitted changes, allowing you to pull cleanly, then reapply your work-in-progress changes.",
          correctAnswer: "git stash",
          explanation: "'git stash' temporarily saves your uncommitted changes, allowing you to switch branches or pull updates, then restore your work with 'git stash pop'."
        }
      ]
    },
    {
      id: 8,
      title: "VS Code Git Integration",
      description: "Master VS Code's built-in Git features for efficient workflow",
      isCompleted: false,
      challenges: [
        {
          id: 29,
          type: "quiz",
          question: "How can you stage files in VS Code without using terminal?",
          content: "VS Code provides visual Git integration through the Source Control panel. You can stage individual files by clicking the '+' icon next to them, or stage all changes with the '+' icon next to 'Changes'. This makes Git operations more intuitive for beginners.",
          options: ["Only through terminal", "Click + icon in Source Control panel", "Drag and drop files", "Use keyboard shortcuts only"],
          correctAnswer: 1,
          explanation: "In VS Code's Source Control panel, click the '+' icon next to files to stage them individually, or next to 'Changes' to stage all modified files."
        },
        {
          id: 30,
          type: "quiz",
          question: "Where do you write commit messages in VS Code?",
          content: "VS Code provides a text box at the top of the Source Control panel where you can write your commit message. After typing your message, you can commit by clicking the checkmark icon or using Ctrl+Enter (Cmd+Enter on Mac).",
          options: ["In a separate file", "In the message box at top of Source Control panel", "In the terminal only", "In a popup window"],
          correctAnswer: 1,
          explanation: "Write commit messages in the text box at the top of the Source Control panel, then commit with the checkmark icon or Ctrl+Enter."
        },
        {
          id: 31,
          type: "quiz",
          question: "How can you see file changes visually in VS Code?",
          content: "VS Code shows Git changes in multiple ways: modified files have an 'M' marker in the Explorer, you can click on files in the Source Control panel to see a diff view, and there are colored indicators in the editor gutter showing added, modified, and deleted lines.",
          options: ["Only in terminal", "File markers, diff view, and gutter indicators", "Only through external tools", "Changes are not visible"],
          correctAnswer: 1,
          explanation: "VS Code shows changes through file markers in Explorer, diff views when clicking files in Source Control, and colored gutter indicators in the editor."
        },
        {
          id: 32,
          type: "quiz",
          question: "What's the benefit of using VS Code's Git integration vs terminal?",
          content: "VS Code's Git integration provides a visual, user-friendly interface that's especially helpful for beginners. You can see changes side-by-side, stage specific lines, resolve merge conflicts visually, and perform most Git operations with clicks instead of memorizing commands.",
          options: ["Terminal is always better", "Visual interface easier for beginners and daily workflow", "No difference", "VS Code is only for advanced users"],
          correctAnswer: 1,
          explanation: "VS Code's visual Git interface is more beginner-friendly, providing intuitive ways to see changes, stage files, and resolve conflicts without memorizing terminal commands."
        }
      ]
    }
  ]);

  useEffect(() => {
    const storedPoints = localStorage.getItem('gitQuestPoints');
    if (storedPoints) {
      setPoints(parseInt(storedPoints, 10));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('gitQuestPoints', points.toString());
  }, [points]);

  const handleSelectLevel = (levelId: number) => {
    setCurrentLevel(levelId);
    setChallengeIndex(0);
    setIncorrectAnswers(new Set()); // Reset incorrect answers when changing levels
  };

  const handleChallengeComplete = (isCorrect: boolean) => {
    const currentLevelData = levels.find(level => level.id === currentLevel);

    if (currentLevelData) {
      const currentChallenge = currentLevelData.challenges[challengeIndex];
      
      if (isCorrect) {
        // Remove from incorrect answers if it was previously wrong
        setIncorrectAnswers(prev => {
          const newSet = new Set(prev);
          newSet.delete(currentChallenge.id);
          return newSet;
        });
        
        setPoints(prevPoints => prevPoints + 50);
        
        // Check if there are any remaining incorrect answers
        const hasIncorrectAnswers = incorrectAnswers.size > 0 && !incorrectAnswers.has(currentChallenge.id);
        
        if (challengeIndex < currentLevelData.challenges.length - 1) {
          setChallengeIndex(prevIndex => prevIndex + 1);
        } else if (!hasIncorrectAnswers) {
          // Level completed with all correct answers - mark as complete
          setLevels(prevLevels =>
            prevLevels.map(level =>
              level.id === currentLevel
                ? { ...level, isCompleted: true }
                : level
            )
          );

          // Check if user can advance to next level
          const nextLevelId = currentLevel + 1;
          const nextLevelExists = levels.find(level => level.id === nextLevelId);
          
          if (nextLevelExists) {
            const newPoints = points + 50;
            const requiredPointsForNext = levelRequirements[nextLevelId as keyof typeof levelRequirements];
            
            // Auto-advance if user has enough points for the next level
            if (newPoints >= requiredPointsForNext) {
              setTimeout(() => {
                setCurrentLevel(nextLevelId);
                setChallengeIndex(0);
                setIncorrectAnswers(new Set());
              }, 1500);
            }
          }
        } else {
          // Go to first incorrect answer
          const firstIncorrectId = Array.from(incorrectAnswers)[0];
          const incorrectIndex = currentLevelData.challenges.findIndex(c => c.id === firstIncorrectId);
          setChallengeIndex(incorrectIndex);
        }
      } else {
        // Add to incorrect answers
        setIncorrectAnswers(prev => new Set(prev).add(currentChallenge.id));
        setPoints(prevPoints => Math.max(0, prevPoints - 25));
        
        // Move to next challenge
        if (challengeIndex < currentLevelData.challenges.length - 1) {
          setChallengeIndex(prevIndex => prevIndex + 1);
        } else {
          // Go to first incorrect answer if at end
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
      <Header gameState={gameState} />
      <div className="flex flex-1">
        <Sidebar
          levels={levels}
          currentLevel={currentLevel}
          onSelectLevel={handleSelectLevel}
          points={points}
        />
        <MainContent
          level={currentLevelData}
          challenge={currentChallenge}
          challengeIndex={challengeIndex}
          onChallengeComplete={handleChallengeComplete}
          points={points}
        />
      </div>
    </div>
  );
};

export default App;
