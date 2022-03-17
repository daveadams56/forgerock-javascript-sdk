import { PlaywrightTestConfig, devices } from '@playwright/test';

const config: PlaywrightTestConfig = {
  forbidOnly: !!process.env.CI,
  globalTeardown: './teardown.ts',
  workers: process.env.CI ? 2 : 2,
  retries: process.env.CI ? 2 : 0,
  testDir: './src/suites',
  webServer: {
    command: 'nx run autoscript-apps:serve',
    port: 8443,
    timeout: 100000,
  },
  use: {
    headless: true,
    navigationTimeout: 50000,
    screenshot: process.env.CI ? 'only-on-failure' : 'off',
    video: process.env.CI ? 'retain-on-failure' : 'off',
    baseURL: 'https://sdkapp.example.com:8443',
    ignoreHTTPSErrors: true,
    geolocation: { latitude: 24.9884, longitude: -87.3459 },
    permissions: [],
    bypassCSP: true,
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
};

export default config;