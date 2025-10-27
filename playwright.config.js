// @ts-check
const { defineConfig, devices } = require('@playwright/test');

/**
 * Configuración de Playwright para pruebas de Ksero
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  // Directorio donde están los tests
  testDir: './tests',
  
  // Timeout máximo por test
  timeout: 30 * 1000,
  
  // Timeout para assertions
  expect: {
    timeout: 5000
  },
  
  // Configuración de reportes
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['list']
  ],
  
  // Reintentos en caso de fallo
  retries: 2,
  
  // Ejecución en paralelo
  workers: 1,
  
  // Configuración global de uso
  use: {
    // URL base de la aplicación
    baseURL: 'http://localhost:5173',
    
    // Mostrar trazas en fallos
    trace: 'on-first-retry',
    
    // Capturas de pantalla en fallos
    screenshot: 'only-on-failure',
    
    // Video solo en primer reintento
    video: 'retain-on-failure',
    
    // Timeout para acciones
    actionTimeout: 10000,
    
    // Viewport por defecto
    viewport: { width: 1280, height: 720 },
  },

  // Proyectos de prueba (navegadores)
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
    // Pruebas móviles (opcional)
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],

  // Servidor web local (si se necesita levantar antes)
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
