import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { execSync } from 'child_process'

function getGitCommitCount(): string {
  try {
    return execSync('git rev-list --count HEAD').toString().trim();
  } catch (error) {
    return '0';
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
