import { execSync } from 'child_process';

/**
 * Gets the total number of git commits in the repository
 * Falls back to 0 if git is not available or not in a git repo
 */
function getGitCommitCount() {
  try {
    // Get the total commit count
    const count = execSync('git rev-list --count HEAD', { encoding: 'utf-8' }).trim();
    return parseInt(count, 10) || 0;
  } catch (error) {
    console.warn('Warning: Could not get git commit count. Using 0 as fallback.');
    return 0;
  }
}

export default getGitCommitCount;

