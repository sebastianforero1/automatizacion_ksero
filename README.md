# Automatización de Pruebas - Ksero

## Descripción
Suite de pruebas automatizadas para la aplicación Ksero usando Playwright.
Cubre el caso de prueba CP-01: Verificación de página de inicio (HU-01).

## Requisitos Previos
- Node.js 18+ instalado
- La aplicación Ksero debe estar corriendo en `http://localhost:5173`

## Instalación

1. Clonar o descargar este proyecto
2. Instalar dependencias:
npm install


3. Instalar navegadores de Playwright:
npx playwright install


## Ejecución de Tests

### Ejecutar todos los tests (headless):
npm test


### Ejecutar con navegador visible:
npm run test:headed


### Ejecutar en modo debug:
npm run test:debug


### Ejecutar con interfaz UI de Playwright:
npm run test:ui


### Ver reporte HTML:
npm run test:report


## Estructura de Tests

- `tests/home.spec.js`: Tests para la página de inicio
  - Test principal: validación de todos los elementos
  - Test de performance
  - Test responsive
  - Tests negativos
  - Tests de accesibilidad
  - Tests de trazabilidad con HU-01

## Reportes Generados

Después de ejecutar los tests, se generan automáticamente:

- **HTML Report**: `playwright-report/index.html`
- **JSON Report**: `test-results/results.json`
- **JUnit XML**: `test-results/junit.xml`

## Evidencias

Las evidencias de ejecución incluyen:
- Capturas de pantalla (solo en fallos)
- Videos (solo en fallos)
- Trazas de ejecución (en primer reintento)

Ubicación: `test-results/` y `playwright-report/`

## Cobertura

Este suite cubre:
- 7 pasos del caso de prueba manual CP-01
- Validaciones técnicas UI/API
- 2 casos negativos
- 100% trazabilidad con criterios de aceptación HU-01

## Navegadores Soportados

- Chromium
- Firefox
- WebKit (Safari)
- Mobile Chrome (opcional)

## Autor
Sebastian Forero
Fecha: 27 de Octubre, 2025
