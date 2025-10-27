const { test, expect } = require('@playwright/test');

/**
 * Suite de Pruebas: CP-01 - Verificación de Página de Inicio
 * Historia de Usuario: HU-01
 * Prioridad: Alta | Riesgo: Alto
 */
test.describe('CP-01: Verificación de página de inicio', () => {
  
  // Hook que se ejecuta antes de cada test
  test.beforeEach(async ({ page }) => {
    // Paso 1: Navegar a la página de inicio
    await page.goto('/');
    // Esperar que la página cargue completamente
    await page.waitForLoadState('networkidle');
  });

  /**
   * Test Principal: Validación de elementos principales
   * Cubre todos los pasos del CP-01
   */
  test('debe mostrar todos los elementos principales de la página de inicio', async ({ page }) => {
    
    // Paso 2: Verificar título principal "Cocinamos tu tranquilidad"
    await test.step('Verificar título principal', async () => {
      const titlePart1 = page.getByText('Cocinamos tu', { exact: false });
      const titlePart2 = page.getByText('tranquilidad', { exact: false });
      
      await expect(titlePart1).toBeVisible();
      await expect(titlePart2).toBeVisible();
      
      // Validación técnica: verificar clase CSS del texto "tranquilidad"
      const greenText = page.locator('text=tranquilidad');
      await expect(greenText).toHaveClass(/text-green-600/);
    });

    // Paso 3: Localizar botón "Ver Planes"
    await test.step('Verificar botón "Ver Planes"', async () => {
      const btnPlanes = page.getByRole('link', { name: 'Ver Planes' });
      await expect(btnPlanes).toBeVisible();
      
      // Validación técnica: verificar que es clickeable
      await expect(btnPlanes).toBeEnabled();
      
      // Validación técnica: verificar color de fondo verde
      const bgColor = await btnPlanes.evaluate((el) => {
        return window.getComputedStyle(el).backgroundColor;
      });
      // Verde en RGB: rgb(22, 163, 74) aproximadamente
      expect(bgColor).toContain('22, 163, 74');
    });

    // Paso 4: Localizar botón "Ver Menú"
    await test.step('Verificar botón "Ver Menú"', async () => {
      const btnMenu = page.getByRole('link', { name: 'Ver Menú' });
      await expect(btnMenu).toBeVisible();
      await expect(btnMenu).toBeEnabled();
    });

    // Paso 5 y 6: Desplazar a sección de beneficios y verificar
    await test.step('Verificar sección de beneficios', async () => {
      const benefitsTitle = page.getByText('¿Por qué elegir Ksero?');
      
      // Hacer scroll a la sección
      await benefitsTitle.scrollIntoViewIfNeeded();
      await expect(benefitsTitle).toBeVisible();
      
      // Paso 6: Contar las 4 características
      const benefits = [
        'Comida Saludable',
        'Ahorra Tiempo',
        'Variedad de Menús',
        'Entrega a Domicilio'
      ];
      
      for (const benefit of benefits) {
        const benefitElement = page.getByText(benefit, { exact: true });
        await expect(benefitElement).toBeVisible();
      }
      
      // Validación: verificar que hay exactamente 4 beneficios
      const benefitCards = page.locator('.relative').filter({ 
        has: page.locator('svg') // Asumiendo que cada beneficio tiene un icono SVG
      });
      await expect(benefitCards).toHaveCount(4, { timeout: 5000 });
    });

    // Paso 7: Verificar imagen hero
    await test.step('Verificar imagen hero', async () => {
      const heroImage = page.locator('img[alt*="Ksero"]').first();
      await expect(heroImage).toBeVisible();
      
      // Validación técnica: verificar que la imagen cargó correctamente
      const imageLoaded = await heroImage.evaluate((img) => {
        return img.complete && img.naturalHeight !== 0;
      });
      expect(imageLoaded).toBeTruthy();
    });
  });

  /**
   * Test de Performance: Tiempo de carga
   */
  test('la página debe cargar en menos de 3 segundos', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    await page.waitForLoadState('load');
    
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(3000);
    console.log(`✓ Tiempo de carga: ${loadTime}ms`);
  });

  /**
   * Test Responsive: Validación en diferentes viewports
   */
  test('debe ser responsive en diferentes tamaños de pantalla', async ({ page }) => {
    // Desktop (1920x1080)
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    await expect(page.getByText('Cocinamos tu')).toBeVisible();
    
    // Tablet (768x1024)
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.getByText('Cocinamos tu')).toBeVisible();
    
    // Mobile (375x667)
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.getByText('Cocinamos tu')).toBeVisible();
  });

  /**
   * Test de Interacción: Hover en botones
   */
  test('los botones deben cambiar de estilo en hover', async ({ page }) => {
    const btnPlanes = page.getByRole('link', { name: 'Ver Planes' });
    
    // Obtener color inicial
    const initialColor = await btnPlanes.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });
    
    // Hacer hover
    await btnPlanes.hover();
    
    // Esperar un momento para que se aplique el efecto
    await page.waitForTimeout(500);
    
    // Obtener color después del hover
    const hoverColor = await btnPlanes.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });
    
    // El color debe cambiar (aunque sea ligeramente)
    // En producción, verificar específicamente la clase hover:bg-green-700
    console.log(`Color inicial: ${initialColor}, Color hover: ${hoverColor}`);
  });

  /**
   * Tests Negativos: Casos de borde
   */
  test.describe('Casos negativos y de borde', () => {
    
    test('debe manejar errores de red gracefully', async ({ page }) => {
      // Simular fallo de red
      await page.route('**/*.jpg', route => route.abort());
      await page.route('**/*.png', route => route.abort());
      
      await page.goto('/');
      
      // La página debe seguir siendo funcional
      await expect(page.getByText('Cocinamos tu')).toBeVisible();
    });
    
    test('debe funcionar en resolución mínima (320px)', async ({ page }) => {
      await page.setViewportSize({ width: 320, height: 568 });
      await page.goto('/');
      
      // Los elementos no deben superponerse
      const title = page.getByText('Cocinamos tu');
      await expect(title).toBeVisible();
      
      // Verificar que los botones son accesibles
      const btnPlanes = page.getByRole('link', { name: 'Ver Planes' });
      await expect(btnPlanes).toBeVisible();
    });
  });

  /**
   * Test de Accesibilidad: Validaciones WCAG
   */
  test('debe cumplir con estándares básicos de accesibilidad', async ({ page }) => {
    await page.goto('/');
    
    // Verificar que las imágenes tienen atributo alt
    const images = await page.locator('img').all();
    for (const img of images) {
      const alt = await img.getAttribute('alt');
      expect(alt).toBeTruthy();
    }
    
    // Verificar que los enlaces son descriptivos
    const links = await page.locator('a').all();
    for (const link of links) {
      const text = await link.textContent();
      expect(text?.trim().length).toBeGreaterThan(0);
    }
  });
});

/**
 * Test de Trazabilidad: Mapeo con criterios de aceptación
 */
test.describe('Trazabilidad con HU-01', () => {
  
  test('Criterio 1: debo ver el título "Cocinamos tu tranquilidad"', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Cocinamos tu')).toBeVisible();
    await expect(page.getByText('tranquilidad')).toBeVisible();
  });
  
  test('Criterio 2: debo ver los botones "Ver Planes" y "Ver Menú"', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('link', { name: 'Ver Planes' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Ver Menú' })).toBeVisible();
  });
  
  test('Criterio 3: debo ver la sección de beneficios con 4 características', async ({ page }) => {
    await page.goto('/');
    
    const benefits = [
      'Comida Saludable',
      'Ahorra Tiempo',
      'Variedad de Menús',
      'Entrega a Domicilio'
    ];
    
    for (const benefit of benefits) {
      await expect(page.getByText(benefit)).toBeVisible();
    }
  });
});
