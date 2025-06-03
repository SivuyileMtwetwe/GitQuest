
import React, { useState } from 'react';
import { Search, AlertCircle, CheckCircle, Copy } from 'lucide-react';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';

const ErrorSolver: React.FC = () => {
  const [errorInput, setErrorInput] = useState('');
  const [solution, setSolution] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Comprehensive Git/terminal errors and their solutions
  const errorSolutions: { [key: string]: string } = {
    // Git repository errors
    'fatal: not a git repository': 'Run `git init` to initialize a new Git repository in this directory.',
    'fatal: destination path already exists': 'The directory already exists. Use `git clone <url> <new-name>` or remove the existing directory first.',
    'fatal: repository not found': 'Check the repository URL is correct. Verify you have access permissions or use HTTPS instead of SSH.',
    'fatal: could not read from remote repository': 'Verify your SSH key is added to your Git provider or use HTTPS: `git remote set-url origin https://github.com/user/repo.git`',
    'fatal: authentication failed': 'Check your credentials. For GitHub, use a personal access token instead of password: `git config --global credential.helper store`',
    
    // Remote and branch errors
    'fatal: remote origin already exists': 'Remove the existing remote with `git remote rm origin` then add the new one with `git remote add origin <url>`',
    'fatal: refusing to merge unrelated histories': 'Use `git pull origin main --allow-unrelated-histories` to force the merge, then resolve conflicts.',
    'error: failed to push some refs': 'Pull the latest changes first with `git pull origin main --rebase` then push again with `git push origin main`',
    'error: src refspec main does not exist': 'Create and switch to main branch: `git checkout -b main` or push current branch: `git push -u origin HEAD`',
    'fatal: branch already exists': 'Switch to existing branch with `git checkout branch-name` or force create with `git checkout -B branch-name`',
    'error: pathspec did not match any files': 'Check if the file exists with `ls -la`. Verify the correct path and filename spelling.',
    
    // Merge and rebase errors
    'merge conflict': 'Open conflicted files, resolve conflicts manually (remove <<<<, ====, >>>> markers), then run `git add .` and `git commit`',
    'error: cannot pull with rebase': 'Resolve conflicts first, then continue with `git rebase --continue` or abort with `git rebase --abort`',
    'fatal: you have diverged branches': 'Use `git pull --rebase origin main` to rebase your changes, or `git merge origin/main` to merge.',
    'automatic merge failed': 'Resolve conflicts in the listed files, then `git add .` and `git commit` to complete the merge.',
    'error: your local changes would be overwritten': 'Stash your changes with `git stash`, pull updates with `git pull`, then apply stash with `git stash pop`',
    
    // Permission and access errors
    'permission denied': 'Try running the command with `sudo` or check file permissions with `ls -la` and use `chmod` to fix permissions.',
    'permission denied (publickey)': 'Generate SSH key with `ssh-keygen -t ed25519 -C "email@example.com"` and add to your Git provider.',
    'fatal: could not create work tree': 'Check directory permissions and ensure you have write access to the parent directory.',
    'error: insufficient permission': 'Check file/directory permissions with `ls -la` and use `sudo` if necessary.',
    
    // File and directory errors
    'command not found': 'The command is not installed or not in PATH. Install with package manager (apt, brew, yum) or check spelling.',
    'no such file or directory': 'Check if the file/directory exists with `ls -la`. Verify the correct path and spelling.',
    'directory not empty': 'Use `rm -rf directory-name` to remove non-empty directory or `rmdir` for empty directories.',
    'file exists': 'The file already exists. Use `-f` flag to force overwrite or choose a different filename.',
    'disk space': 'Clean up disk space with `df -h` to check usage, `du -sh *` to find large files, and remove unnecessary files.',
    
    // Network and connection errors
    'connection timed out': 'Check internet connection. Try using different DNS (8.8.8.8) or VPN. Increase timeout with `--timeout` flag.',
    'connection refused': 'Service may be down or firewall blocking. Check if service is running and ports are open.',
    'host unreachable': 'Check network connectivity with `ping google.com`. Verify DNS settings and network configuration.',
    'ssl certificate': 'Update certificates or bypass with `-k` flag (curl) or `git config --global http.sslverify false` (temporary).',
    
    // Git state errors
    'detached head state': 'Create a new branch from current state: `git checkout -b new-branch-name` or return to main: `git checkout main`',
    'fatal: cannot lock ref': 'Clean up Git references: `git gc --prune=now` and remove lock files: `rm .git/refs/heads/branch.lock`',
    'fatal: loose object is corrupt': 'Restore from backup or use `git fsck --full` to check integrity and `git gc --aggressive` to clean up.',
    'fatal: bad object': 'Repository corruption. Try `git fsck` to identify issues and `git reflog` to recover lost commits.',
    
    // Package manager errors
    'package not found': 'Update package lists with `apt update` (Ubuntu) or `brew update` (Mac), then install the package.',
    'dependency conflict': 'Use `apt --fix-broken install` (Ubuntu) or reinstall conflicting packages individually.',
    'lock file': 'Another package manager process is running. Wait or remove lock file: `sudo rm /var/lib/apt/lists/lock`',
    'signature verification failed': 'Update package signing keys or use `--allow-unauthenticated` flag (not recommended).',
    
    // Node.js/npm errors
    'module not found': 'Install missing module with `npm install <module-name>` or check import path spelling.',
    'enoent no such file': 'File or directory missing. Check path and ensure file exists. May need `npm install` to restore dependencies.',
    'eacces permission denied': 'Fix npm permissions with `sudo chown -R $(whoami) ~/.npm` or use `sudo npm install -g`',
    'peer dependency': 'Install peer dependencies manually: `npm install <peer-dep>` or use `npm install --legacy-peer-deps`',
    'version conflict': 'Update packages with `npm update` or specify exact versions in package.json.',
    
    // Docker errors
    'docker daemon not running': 'Start Docker service: `sudo systemctl start docker` (Linux) or start Docker Desktop (Mac/Windows).',
    'permission denied docker': 'Add user to docker group: `sudo usermod -aG docker $USER` then logout/login.',
    'image not found': 'Pull the image first: `docker pull <image-name>` or check image name spelling.',
    'port already in use': 'Stop process using port: `lsof -ti:3000 | xargs kill -9` or use different port.',
    'no space left': 'Clean Docker resources: `docker system prune -a` to remove unused images, containers, and networks.',
    
    // SSH errors
    'ssh connection refused': 'Check if SSH service is running: `sudo systemctl status ssh` and ensure port 22 is open.',
    'host key verification failed': 'Remove old host key: `ssh-keygen -R hostname` then try connecting again.',
    'too many authentication failures': 'Use specific key: `ssh -i ~/.ssh/specific_key user@host` or check SSH agent.',
    
    // File system errors
    'read-only file system': 'Remount with write permissions: `sudo mount -o remount,rw /` or check disk health.',
    'operation not permitted': 'Check file permissions and use `sudo` if needed. On Mac, check System Integrity Protection.',
    'no space left on device': 'Free up space: `df -h` to check usage, `ncdu /` to find large directories, remove unnecessary files.',
    'input/output error': 'Hardware issue likely. Check disk health with `fsck /dev/sdX` and consider disk replacement.',
    
    // Process and system errors
    'process already running': 'Find and kill process: `ps aux | grep process-name` then `kill -9 PID`',
    'zombie process': 'Kill parent process or restart system. Use `ps aux | grep Z` to find zombie processes.',
    'segmentation fault': 'Program crashed. Check logs, update software, or report bug. May indicate memory corruption.',
    'killed': 'Process was terminated, likely by OOM killer. Check memory usage with `free -h` and increase swap.',
    
    // Environment and PATH errors
    'command not found bash': 'Command not in PATH. Add to PATH: `export PATH=$PATH:/path/to/command` or install package.',
    'bad interpreter': 'Script shebang is wrong or interpreter not installed. Fix shebang line or install required interpreter.',
    'syntax error': 'Check script syntax. For bash: `bash -n script.sh`. Fix syntax errors in the script.',
    
    // Database errors
    'connection refused database': 'Database server not running. Start with `sudo systemctl start postgresql/mysql` or check connection settings.',
    'access denied database': 'Check database credentials and user permissions. Grant necessary privileges to database user.',
    'table does not exist': 'Run database migrations or create table. Check table name spelling and database schema.',
    
    // Web server errors
    'address already in use': 'Port is occupied. Find process: `lsof -i :PORT` and kill it, or use different port.',
    'connection reset': 'Server closed connection. Check server logs, firewall settings, and network stability.',
    'certificate expired': 'Renew SSL certificate. For Let\'s Encrypt: `certbot renew` or update certificate files.',
    
    // Compilation errors
    'make: command not found': 'Install build tools: `sudo apt install build-essential` (Ubuntu) or `xcode-select --install` (Mac)',
    'gcc: command not found': 'Install compiler: `sudo apt install gcc` (Ubuntu) or install Xcode Command Line Tools (Mac)',
    'undefined reference': 'Missing library during linking. Add library with `-l` flag or install development packages.',
    
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
            <strong>Git & Version Control:</strong>
            <ul className="ml-2">
              <li>• Repository errors</li>
              <li>• Merge conflicts</li>
              <li>• Authentication issues</li>
              <li>• Branch problems</li>
            </ul>
          </div>
          <div>
            <strong>System & Network:</strong>
            <ul className="ml-2">
              <li>• Permission errors</li>
              <li>• File system issues</li>
              <li>• Network problems</li>
              <li>• Process management</li>
            </ul>
          </div>
          <div>
            <strong>Development:</strong>
            <ul className="ml-2">
              <li>• Package managers</li>
              <li>• Docker issues</li>
              <li>• Database errors</li>
              <li>• Compilation problems</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorSolver;
