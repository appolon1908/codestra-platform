import path from 'node:path'
import { execFileSync } from 'node:child_process'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

// https://vite.dev/config/
let buildSha='0'.repeat(40)
try { buildSha=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim() } catch { /* fail-closed display remains unknown */ }
export default defineConfig({
  define: { __MISSION_CONTROL_BUILD_SHA__: JSON.stringify(buildSha) },
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test-setup.ts'],
  },
})
