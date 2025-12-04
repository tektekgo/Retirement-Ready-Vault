export const VERSION_MAJOR = 1;
export const VERSION_MINOR = 0;

export function getVersion(): string {
  const patch = import.meta.env.VITE_GIT_COMMIT_COUNT || '0';
  return `v${VERSION_MAJOR}.${VERSION_MINOR}.${patch}`;
}
