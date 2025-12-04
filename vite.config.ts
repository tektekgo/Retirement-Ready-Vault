import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { execSync } from 'child_process'

// Get git commit count for patch version
function getGitCommitCount(): number {
  try {
    const count = execSync('git rev-list --count HEAD', { encoding: 'utf-8' }).trim()
    return parseInt(count, 10) || 0
  } catch (error) {
    console.warn('Warning: Could not get git commit count. Using 0 as fallback.')
    return 0
  }
}

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  define: {
    // Inject git commit count as environment variable
    'import.meta.env.VITE_GIT_COMMIT_COUNT': JSON.stringify(getGitCommitCount()),
  },
  server: {
    host: 'localhost',
    port: 5173,
    strictPort: true,
    hmr: {
      host: 'localhost',
      port: 5173,
      clientPort: 5173,
      protocol: 'ws',
    },
    // HMR will automatically use the same port as the server
    // This prevents WebSocket errors when Vite switches to a different port
  },
})
