import { defineConfig, devices, type Project } from '@playwright/test';

const sites = [
  { name: 'njuskalo', baseURL: 'https://www.njuskalo.hr' },
  { name: 'bolha',    baseURL: 'https://www.bolha.com'  },
] as const;

const browsers: Project[] = [
  { name: 'Desktop Chrome', use: { browserName: 'chromium', channel: 'chrome', headless: false } },
  { name: 'Desktop Firefox', use: { browserName: 'firefox' } },
  { name: 'Desktop Safari', use: { browserName: 'webkit' } },
];

const projects: Project[] = sites.flatMap((site) =>
  browsers.map((browser) => ({
    name: `${site.name}-${browser.name}`,
    use: {
      ...browser.use,
      baseURL: site.baseURL,
      viewport: { width: 1920, height: 1080 },
    },
  }))
);

export default defineConfig({
  testDir: './src',
  timeout: 15_000,
  expect: { timeout: 10_000 },
  workers: 2,
  reporter: [['html', { outputFolder: 'reports/html' }]],
  projects,
  retries: 1,
  use: {
    storageState: { cookies: [], origins: [] },
    headless: true,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
});