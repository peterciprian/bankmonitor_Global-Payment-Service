import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './src/__tests__',
  fullyParallel: true,
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'retain-on-failure'
  },
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: false,
    timeout: 120_000
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }]
});