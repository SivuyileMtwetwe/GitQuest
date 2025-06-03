import React, { useState } from 'react';
import { Search, AlertCircle, CheckCircle, Copy } from 'lucide-react';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';

const ErrorSolver: React.FC = () => {
  const [errorInput, setErrorInput] = useState('');
  const [solution, setSolution] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Comprehensive error solutions database
  const errorSolutions: { [key: string]: string } = {
    // Git repository errors
    'fatal: not a git repository': 'Run `git init` to initialize a new Git repository in this directory.',
    'fatal: destination path already exists': 'The directory already exists. Use `git clone <url> <new-name>` or remove the existing directory first.',
    'fatal: repository not found': 'Check the repository URL is correct. Verify you have access permissions or use HTTPS instead of SSH.',
    'fatal: could not read from remote repository': 'Verify your SSH key is added to your Git provider or use HTTPS: `git remote set-url origin https://github.com/user/repo.git`',
    'fatal: authentication failed': 'Check your credentials. For GitHub, use a personal access token instead of password: `git config --global credential.helper store`',
    
    // Git remote and branch errors
    'fatal: remote origin already exists': 'Remove the existing remote with `git remote rm origin` then add the new one with `git remote add origin <url>`',
    'fatal: refusing to merge unrelated histories': 'Use `git pull origin main --allow-unrelated-histories` to force the merge, then resolve conflicts.',
    'error: failed to push some refs': 'Pull the latest changes first with `git pull origin main --rebase` then push again with `git push origin main`',
    'error: src refspec main does not exist': 'Create and switch to main branch: `git checkout -b main` or push current branch: `git push -u origin HEAD`',
    'fatal: branch already exists': 'Switch to existing branch with `git checkout branch-name` or force create with `git checkout -B branch-name`',
    
    // Git merge and rebase errors
    'merge conflict': 'Open conflicted files, resolve conflicts manually (remove <<<<, ====, >>>> markers), then run `git add .` and `git commit`',
    'error: cannot pull with rebase': 'Resolve conflicts first, then continue with `git rebase --continue` or abort with `git rebase --abort`',
    'fatal: you have diverged branches': 'Use `git pull --rebase origin main` to rebase your changes, or `git merge origin/main` to merge.',
    'automatic merge failed': 'Resolve conflicts in the listed files, then `git add .` and `git commit` to complete the merge.',
    
    // Node.js errors
    'error: enoent no such file': 'File or directory is missing. Check path and ensure file exists. Run `npm install` to restore dependencies.',
    'error: cannot find module': 'Module not found. Run `npm install <package-name>` or check import path spelling.',
    'error: port already in use': 'Port is occupied. Find process: `lsof -i :PORT` and kill it, or use different port.',
    'error: digital envelope routines::unsupported': 'Node.js version conflict. Use `export NODE_OPTIONS=--openssl-legacy-provider` or update Node version.',
    'npm err! code elifecycle': 'NPM lifecycle script failed. Clear NPM cache with `npm cache clean --force` and reinstall dependencies.',
    
    // Vue.js errors
    'component name "app" has already been used': 'Rename your component to be unique. Component names must be unique within their scope.',
    '[vue warn]: failed to mount app': 'Check if mounting element exists in HTML and Vue app is properly initialized.',
    '[vue warn]: property or method is not defined': 'Property not found in component data/methods. Define it in the component options.',
    '[vue warn]: duplicate keys detected': 'Each v-for item needs a unique key. Use :key with unique values.',
    'uncaught typeerror: cannot read property of undefined': 'Data property accessed before initialization. Use v-if to wait for data or provide default value.',
    
    // Package manager errors
    'npm err! code eacces': 'Permission error. Fix with: `sudo chown -R $(whoami) ~/.npm` or use `sudo npm install -g`',
    'npm err! code eresolve': 'Dependency conflict. Try `npm install --legacy-peer-deps` or update conflicting packages.',
    'yarn error an unexpected error occurred': 'Clear Yarn cache with `yarn cache clean` and try again.',
    'npm err! code eintegrity': 'Package integrity check failed. Delete package-lock.json and node_modules, then run `npm install`',
    
    // Build errors
    'error: failed to compile': 'Check build logs for syntax errors or missing dependencies.',
    'error: chunk loading failed': 'Dynamic import failed. Check network connectivity and import path.',
    'error: maximum call stack size exceeded': 'Infinite recursion in code. Check for circular dependencies or infinite loops.',
    'error: unexpected token': 'Syntax error in code. Check for missing brackets, quotes, or semicolons.',
    
    // Vue Router errors
    'uncaught error: missing param': 'Required route parameter is missing. Check route definition and navigation.',
    'navigation duplicated': 'Attempting to navigate to current route. Add catch handler or check navigation guard.',
    'route not found': 'Route path not defined in router configuration. Add route or check path spelling.',
    
    // Vuex errors
    'vuex unknown action type': 'Action not defined in Vuex store. Register action in store configuration.',
    'vuex unknown mutation type': 'Mutation not defined in Vuex store. Register mutation in store configuration.',
    '[vuex] unknown getter': 'Getter not defined in Vuex store. Register getter in store configuration.',
    
    // Generic fallbacks
    'error': 'Check the error message details. Try running with verbose flags (-v, --verbose) for more information.',
    'failed': 'Operation failed. Check logs, verify syntax, and ensure all dependencies are installed.',
    'timeout': 'Operation timed out. Check network connection, increase timeout values, or try again later.',
  };

  const findSolution = (error: string) => {
    const lowercaseError = error.toLowerCase();
    
    // First, try exact matches
    for (const [errorPattern, solution] of Object.entries(errorSolutions)) {
      if (lowercaseError.includes(errorPattern.toLowerCase())) {
        return solution;
      }
    }
    
    // If no match found, provide general guidance
    return 'No specific solution found in our database. Try these general steps:\n\n1. Read the error message carefully for specific details\n2. Check spelling and syntax\n3. Verify file/directory paths exist\n4. Ensure proper permissions\n5. Check if services are running\n6. Search for the exact error message online\n7. Check official documentation\n8. Try running with verbose/debug flags for more information';
  };

  const handleAnalyze = () => {
    if (!errorInput.trim()) return;
    
    setIsAnalyzing(true);
    
    // Simulate analysis delay
    setTimeout(() => {
      const foundSolution = findSolution(errorInput);
      setSolution(foundSolution);
      setIsAnalyzing(false);
    }, 1000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Terminal Error Solver</h2>
        <p className="text-gray-600">Paste your terminal error and get instant solutions</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Paste your terminal error message:
          </label>
          <Textarea
            value={errorInput}
            onChange={(e) => setErrorInput(e.target.value)}
            placeholder="Example: fatal: not a git repository (or any of the parent directories)"
            className="min-h-[100px] font-mono text-sm"
          />
        </div>

        <Button
          onClick={handleAnalyze}
          disabled={!errorInput.trim() || isAnalyzing}
          className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
        >
          {isAnalyzing ? (
            <>
              <Search className="w-4 h-4 mr-2 animate-spin" />
              Analyzing Error...
            </>
          ) : (
            <>
              <Search className="w-4 h-4 mr-2" />
              Get Solution
            </>
          )}
        </Button>
      </div>

      {solution && (
        <div className="bg-white/30 backdrop-blur-md rounded-xl p-6 border border-white/50">
          <div className="flex items-center mb-3">
            <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
            <h3 className="font-semibold text-green-800">Solution Found</h3>
          </div>
          
          <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm text-white relative">
            <div className="absolute top-2 right-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(solution)}
                className="text-gray-400 hover:text-white h-6 w-6 p-0"
              >
                <Copy className="w-3 h-3" />
              </Button>
            </div>
            <pre className="pr-8 whitespace-pre-wrap">{solution}</pre>
          </div>

          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center mb-2">
              <AlertCircle className="w-4 h-4 text-blue-600 mr-2" />
              <span className="text-sm font-medium text-blue-800">Pro Tips</span>
            </div>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Always backup your work before trying solutions</li>
              <li>• Read error messages carefully for specific details</li>
              <li>• Use verbose flags (-v, --verbose) for more information</li>
              <li>• Check official documentation when in doubt</li>
            </ul>
          </div>
        </div>
      )}

      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-800 mb-2">Error Categories We Cover:</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
          <div>
            <strong>Git & GitHub:</strong>
            <ul className="ml-2">
              <li>• Repository errors</li>
              <li>• Merge conflicts</li>
              <li>• Authentication issues</li>
              <li>• Branch problems</li>
            </ul>
          </div>
          <div>
            <strong>Node.js & NPM:</strong>
            <ul className="ml-2">
              <li>• Module errors</li>
              <li>• Build failures</li>
              <li>• Dependency issues</li>
              <li>• Version conflicts</li>
            </ul>
          </div>
          <div>
            <strong>Vue.js:</strong>
            <ul className="ml-2">
              <li>• Component errors</li>
              <li>• Router issues</li>
              <li>• Vuex problems</li>
              <li>• Build failures</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorSolver;