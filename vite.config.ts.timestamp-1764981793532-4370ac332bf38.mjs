// vite.config.ts
import { defineConfig } from "file:///home/project/node_modules/vite/dist/node/index.js";
import react from "file:///home/project/node_modules/@vitejs/plugin-react/dist/index.js";
import path from "path";
import { execSync } from "child_process";
var __vite_injected_original_dirname = "/home/project";
function getGitCommitCount() {
  try {
    const count = execSync("git rev-list --count HEAD", { encoding: "utf-8" }).trim();
    return parseInt(count, 10) || 0;
  } catch (error) {
    console.warn("Warning: Could not get git commit count. Using 0 as fallback.");
    return 0;
  }
}
var vite_config_default = defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    }
  },
  define: {
    // Inject git commit count as environment variable
    "import.meta.env.VITE_GIT_COMMIT_COUNT": JSON.stringify(getGitCommitCount())
  },
  server: {
    host: "localhost",
    port: 5173,
    strictPort: true,
    hmr: {
      host: "localhost",
      port: 5173,
      clientPort: 5173,
      protocol: "ws"
    },
    // HMR will automatically use the same port as the server
    // This prevents WebSocket errors when Vite switches to a different port
    proxy: {
      // Proxy API routes to Vercel serverless functions
      // For local dev, use: vercel dev (this will handle API routes)
      // Or test on production where API routes work automatically
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        rewrite: (path2) => path2.replace(/^\/api/, "/api")
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9wcm9qZWN0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9wcm9qZWN0L3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL3Byb2plY3Qvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0J1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcbmltcG9ydCB7IGV4ZWNTeW5jIH0gZnJvbSAnY2hpbGRfcHJvY2VzcydcblxuLy8gR2V0IGdpdCBjb21taXQgY291bnQgZm9yIHBhdGNoIHZlcnNpb25cbmZ1bmN0aW9uIGdldEdpdENvbW1pdENvdW50KCk6IG51bWJlciB7XG4gIHRyeSB7XG4gICAgY29uc3QgY291bnQgPSBleGVjU3luYygnZ2l0IHJldi1saXN0IC0tY291bnQgSEVBRCcsIHsgZW5jb2Rpbmc6ICd1dGYtOCcgfSkudHJpbSgpXG4gICAgcmV0dXJuIHBhcnNlSW50KGNvdW50LCAxMCkgfHwgMFxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnNvbGUud2FybignV2FybmluZzogQ291bGQgbm90IGdldCBnaXQgY29tbWl0IGNvdW50LiBVc2luZyAwIGFzIGZhbGxiYWNrLicpXG4gICAgcmV0dXJuIDBcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbcmVhY3QoKV0sXG4gIHJlc29sdmU6IHtcbiAgICBhbGlhczoge1xuICAgICAgJ0AnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMnKSxcbiAgICB9LFxuICB9LFxuICBkZWZpbmU6IHtcbiAgICAvLyBJbmplY3QgZ2l0IGNvbW1pdCBjb3VudCBhcyBlbnZpcm9ubWVudCB2YXJpYWJsZVxuICAgICdpbXBvcnQubWV0YS5lbnYuVklURV9HSVRfQ09NTUlUX0NPVU5UJzogSlNPTi5zdHJpbmdpZnkoZ2V0R2l0Q29tbWl0Q291bnQoKSksXG4gIH0sXG4gIHNlcnZlcjoge1xuICAgIGhvc3Q6ICdsb2NhbGhvc3QnLFxuICAgIHBvcnQ6IDUxNzMsXG4gICAgc3RyaWN0UG9ydDogdHJ1ZSxcbiAgICBobXI6IHtcbiAgICAgIGhvc3Q6ICdsb2NhbGhvc3QnLFxuICAgICAgcG9ydDogNTE3MyxcbiAgICAgIGNsaWVudFBvcnQ6IDUxNzMsXG4gICAgICBwcm90b2NvbDogJ3dzJyxcbiAgICB9LFxuICAgIC8vIEhNUiB3aWxsIGF1dG9tYXRpY2FsbHkgdXNlIHRoZSBzYW1lIHBvcnQgYXMgdGhlIHNlcnZlclxuICAgIC8vIFRoaXMgcHJldmVudHMgV2ViU29ja2V0IGVycm9ycyB3aGVuIFZpdGUgc3dpdGNoZXMgdG8gYSBkaWZmZXJlbnQgcG9ydFxuICAgIHByb3h5OiB7XG4gICAgICAvLyBQcm94eSBBUEkgcm91dGVzIHRvIFZlcmNlbCBzZXJ2ZXJsZXNzIGZ1bmN0aW9uc1xuICAgICAgLy8gRm9yIGxvY2FsIGRldiwgdXNlOiB2ZXJjZWwgZGV2ICh0aGlzIHdpbGwgaGFuZGxlIEFQSSByb3V0ZXMpXG4gICAgICAvLyBPciB0ZXN0IG9uIHByb2R1Y3Rpb24gd2hlcmUgQVBJIHJvdXRlcyB3b3JrIGF1dG9tYXRpY2FsbHlcbiAgICAgICcvYXBpJzoge1xuICAgICAgICB0YXJnZXQ6ICdodHRwOi8vbG9jYWxob3N0OjMwMDAnLFxuICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXG4gICAgICAgIHJld3JpdGU6IChwYXRoKSA9PiBwYXRoLnJlcGxhY2UoL15cXC9hcGkvLCAnL2FwaScpLFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxufSlcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBeU4sU0FBUyxvQkFBb0I7QUFDdFAsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sVUFBVTtBQUNqQixTQUFTLGdCQUFnQjtBQUh6QixJQUFNLG1DQUFtQztBQU16QyxTQUFTLG9CQUE0QjtBQUNuQyxNQUFJO0FBQ0YsVUFBTSxRQUFRLFNBQVMsNkJBQTZCLEVBQUUsVUFBVSxRQUFRLENBQUMsRUFBRSxLQUFLO0FBQ2hGLFdBQU8sU0FBUyxPQUFPLEVBQUUsS0FBSztBQUFBLEVBQ2hDLFNBQVMsT0FBTztBQUNkLFlBQVEsS0FBSywrREFBK0Q7QUFDNUUsV0FBTztBQUFBLEVBQ1Q7QUFDRjtBQUVBLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVMsQ0FBQyxNQUFNLENBQUM7QUFBQSxFQUNqQixTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxLQUFLLEtBQUssUUFBUSxrQ0FBVyxPQUFPO0FBQUEsSUFDdEM7QUFBQSxFQUNGO0FBQUEsRUFDQSxRQUFRO0FBQUE7QUFBQSxJQUVOLHlDQUF5QyxLQUFLLFVBQVUsa0JBQWtCLENBQUM7QUFBQSxFQUM3RTtBQUFBLEVBQ0EsUUFBUTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sWUFBWTtBQUFBLElBQ1osS0FBSztBQUFBLE1BQ0gsTUFBTTtBQUFBLE1BQ04sTUFBTTtBQUFBLE1BQ04sWUFBWTtBQUFBLE1BQ1osVUFBVTtBQUFBLElBQ1o7QUFBQTtBQUFBO0FBQUEsSUFHQSxPQUFPO0FBQUE7QUFBQTtBQUFBO0FBQUEsTUFJTCxRQUFRO0FBQUEsUUFDTixRQUFRO0FBQUEsUUFDUixjQUFjO0FBQUEsUUFDZCxTQUFTLENBQUNBLFVBQVNBLE1BQUssUUFBUSxVQUFVLE1BQU07QUFBQSxNQUNsRDtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFsicGF0aCJdCn0K
