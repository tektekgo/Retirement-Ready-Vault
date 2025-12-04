# Version History & Recovery Guide

## Current Version System

The application uses an auto-incrementing version system: **v1.0.X**

- **Major version (1)**: Set manually in `src/config/version.ts`
- **Minor version (0)**: Set manually in `src/config/version.ts`
- **Patch (X)**: Auto-increments with each git commit

The version number is displayed in the footer of all pages.

## Baseline Version - v1.0

A baseline version has been tagged as **v1.0-baseline** for safe reference.

### How to Return to Baseline Version

If you need to return to the baseline version (for beginners or to start fresh):

```bash
# View all available tags
git tag -l

# Return to baseline version
git checkout v1.0-baseline

# To create a new branch from baseline
git checkout -b my-new-branch v1.0-baseline

# To return to the latest version
git checkout master
```

## Changing Major/Minor Version

When you're ready to increment the major or minor version:

1. Edit `src/config/version.ts`
2. Update `VERSION_MAJOR` and/or `VERSION_MINOR`
3. Commit your changes
4. The patch number will continue to auto-increment

Example:
```typescript
// In src/config/version.ts
export const VERSION_MAJOR = 2;  // Changed from 1
export const VERSION_MINOR = 0;  // Stays the same
// This will show as v2.0.X where X = commit count
```

## How It Works

The version system uses git commit count as the patch number:
- Vite build process runs `git rev-list --count HEAD` during build
- This count is injected as `VITE_GIT_COMMIT_COUNT` environment variable
- The `getVersion()` function in `src/config/version.ts` combines major.minor.patch

## Version Display

The version is displayed in the footer of:
- Landing Page
- Retirement Dashboard
- Wizard Container

All pages automatically show the current version at the bottom of the page.
