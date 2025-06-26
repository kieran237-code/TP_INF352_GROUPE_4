const { test, expect } = require('@playwright/test');

test.describe('Connexion utilisateur', () => {

  test('Connexion réussie et redirection vers la page d\'accueil', async ({ page }) => {
    // Aller à la page de connexion
    await page.goto('/login.html');

    // Vérifie que le H2 est bien "Connexion🔐"
    await expect(page.locator('h2')).toHaveText('Connexion🔐');

    // Remplir les champs
    const name = 'Suzy';
    const password = 'suzy';

    await page.fill('#name', name);
    await page.fill('#password', password);

    // Soumettre le formulaire
    await page.click('input[type="submit"]');

    // Attendre la redirection vers home.html
    await page.waitForURL('**/home.html', { timeout: 7000 });
  });

});
