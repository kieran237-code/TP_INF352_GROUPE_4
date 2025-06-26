const { test, expect } = require('@playwright/test');

test.describe('Inscription utilisateur', () => {

  test('Inscription réussie et redirection vers la page de connexion', async ({ page }) => {
    // Aller à la page d'inscription
    await page.goto('http://localhost:3000/register.html');

    // Vérifier que la page est bien chargée
    await expect(page.locator('h2')).toHaveText('Inscription👤');

    // Remplir les champs
    const name = 'Suzy';
    const password = 'suzy';

    await page.fill('#name', name);
    await page.fill('#password', password);

    // Soumettre le formulaire
    await page.click('input[type="submit"]');

    // Attendre l'affichage du message de succès
    const message = page.locator('#message');
    await expect(message).toHaveText('Inscription réussie ! Vous pouvez maintenant vous connecter.', {
      timeout: 7000,
    });

    // Vérifier la couleur du message (optionnel)
    await expect(message).toHaveCSS('color', 'rgb(0, 128, 0)');

    // Vérifier la redirection vers login.html (après 3 secondes)
    await page.waitForURL('**/login.html', { timeout: 10000 }); 
    await expect(page.locator('h2')).toHaveText('Connexion🔐');
  });

});
