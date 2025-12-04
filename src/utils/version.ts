import { VERSION_MAJOR, VERSION_MINOR } from '../config/version';

/**
 * Gets the full version string in format v{Major}.{Minor}.{Patch}
 * Patch is auto-incremented from git commit count
 */
export function getVersion(): string {
  // Get git commit count from environment variable injected at build time
  const patch = import.meta.env.VITE_GIT_COMMIT_COUNT 
    ? parseInt(import.meta.env.VITE_GIT_COMMIT_COUNT as string, 10) 
    : 0;
  
  return `v${VERSION_MAJOR}.${VERSION_MINOR}.${patch}`;
}

