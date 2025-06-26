const { test, expect } = require('@playwright/test');

// Fonction utilitaire pour générer une immatriculation unique pour les tests
function generateUniqueRegistration() {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000); 
  return `TEST${timestamp.toString().slice(-5)}${random}`;
}

// Définir une variable globale pour l'immatriculation du véhicule de test
let testVehicleRegistration;
let createdVehicleData;

test.describe('Page d\'accueil des véhicules - Toutes les fonctionnalités', () => {

  // Ce bloc s'exécute avant chaque test pour s'assurer que l'utilisateur est connecté
  test.beforeEach(async ({ page }) => {
    // 1. Aller à la page de connexion
    await page.goto('/login.html');

    // 2. Remplir les champs de connexion avec un utilisateur de test
    const name = 'Suzy'; // Assurez-vous que cet utilisateur existe dans votre BDD
    const password = 'suzy';

    await page.fill('#name', name);
    await page.fill('#password', password);

    // 3. Soumettre le formulaire de connexion
    await page.click('input[type="submit"]');

    // 4. Attendre la redirection vers home.html après la connexion réussie
    await page.waitForURL('**/home.html', { timeout: 10000 });

    // Vérifier que le nom d'utilisateur est affiché
    await expect(page.locator('#user-name')).toHaveText(name);
  });

  test('01. Afficher tous les véhicules avec "GET ALL"', async ({ page }) => {
    await test.step('Cliquer sur le bouton "GET ALL" et vérifier l\'affichage du tableau', async () => {
      await page.click('#GET_ALL');
      await expect(page.locator('#title-request')).toHaveText('Requête : Listes des vehicules disponibles.');
      await expect(page.locator('#result-container table.vehicle-table')).toBeVisible();
      // Optionnel: Vérifier que le tableau contient des en-têtes spécifiques
      await expect(page.locator('.vehicle-table th:nth-child(1)')).toHaveText('Registration');
      await expect(page.locator('.vehicle-table th:nth-child(2)')).toHaveText('Model');
    });
  });

  test('02. Rechercher un véhicule spécifique avec "GET" (par immatriculation)', async ({ page }) => {
    // Pour ce test, assurez-vous qu'un véhicule avec cette immatriculation existe dans votre BDD de test.
    const knownRegistration = 'AA123BB'; // REMPLACEZ PAR UNE IMMATRICULATION EXISTANTE DANS VOTRE BD
    
    await test.step(`Ouvrir la modale GET, rechercher '${knownRegistration}' et vérifier les résultats`, async () => {
      await page.click('button.method-btn:has-text("GET")'); 
      await expect(page.locator('.modal-container')).toHaveClass(/active/);
      await expect(page.locator('#modal-form h3')).toHaveText('GET');

      await page.fill('#modal-form input[name="registration"]', knownRegistration);
      await page.click('#modal-form button[type="submit"]:has-text("GET")');

      await expect(page.locator('.modal-container')).not.toHaveClass(/active/);
      await expect(page.locator('#title-request')).toHaveText(`Requête : Véhicule avec immatriculation ${knownRegistration}.`);
      await expect(page.locator('#result-container table.vehicle-table')).toBeVisible();
      await expect(page.locator('.vehicle-table tbody tr td:nth-child(1)')).toHaveText(knownRegistration);
    });
  });
  test('03. Rechercher des véhicules par prix avec "GET BY PRICE"', async ({ page }) => {
    // Se rassurer que ces prix sont inscrit dans la BD
    const minPrice = 40;
    const maxPrice = 1200;

    await test.step(`Ouvrir la modale GET BY PRICE, rechercher entre ${minPrice}€ et ${maxPrice}€`, async () => {
      await page.click('button.method-btn:has-text("GET BY PRICE")');
      await expect(page.locator('.modal-container')).toHaveClass(/active/);
      await expect(page.locator('#modal-form h3')).toHaveText('GET BY PRICE');

      await page.fill('#modal-form input[name="min"]', String(minPrice));
      await page.fill('#modal-form input[name="max"]', String(maxPrice));
      await page.click('#modal-form button[type="submit"]:has-text("GET BY PRICE")');

      await expect(page.locator('.modal-container')).not.toHaveClass(/active/);
      await expect(page.locator('#title-request')).toHaveText(`Requête : Véhicules entre ${minPrice}€ et ${maxPrice}€.`);
      await expect(page.locator('#result-container table.vehicle-table')).toBeVisible();
      // Optionnel: Ajouter des assertions plus spécifiques sur le contenu si des données de test sont garanties dans cette fourchette.
    });
  });

  test('04. Ajouter un nouveau véhicule avec "POST"', async ({ page }) => {
    testVehicleRegistration = generateUniqueRegistration(); // Initialisation de l'immatriculation unique
    
    // Définir les données complètes du véhicule qui sera créé
    const vehicleDataToCreate = {
      registration: testVehicleRegistration,
      make: 'Toyota', 
      model: 'Corolla', 
      year: 2023,
      rentalPrice: 2500,
    };

    await test.step(`Ouvrir la modale POST, ajouter le véhicule '${testVehicleRegistration}'`, async () => {
      await page.click('button.method-btn:has-text("POST")');
      await expect(page.locator('.modal-container')).toHaveClass(/active/);
      await expect(page.locator('#modal-form h3')).toHaveText('POST');

      // Remplir tous les champs nécessaires pour le POST
      await page.fill('#modal-form input[name="registration"]', vehicleDataToCreate.registration);
      await page.fill('#modal-form input[name="make"]', vehicleDataToCreate.make);
      await page.fill('#modal-form input[name="model"]', vehicleDataToCreate.model);
      await page.fill('#modal-form input[name="year"]', String(vehicleDataToCreate.year));
      await page.fill('#modal-form input[name="rentalPrice"]', String(vehicleDataToCreate.rentalPrice));

      await page.click('#modal-form button[type="submit"]:has-text("POST")');

      await expect(page.locator('.modal-container')).not.toHaveClass(/active/);
      await expect(page.locator('#title-request')).toHaveText('Requête : Ajout d\'un nouveau véhicule.');
      await expect(page.locator('#result-container')).toContainText('Véhicule ajouté avec succès.');
      await expect(page.locator('#result-container table.vehicle-table')).toBeVisible();
      await expect(page.locator('.vehicle-table tbody tr td:nth-child(1)')).toHaveText(testVehicleRegistration);

      // Stocker les données complètes du véhicule créé pour les tests suivants (PUT, DELETE)
      createdVehicleData = vehicleDataToCreate;
    });
  });

  

  test('05. Mettre à jour un véhicule existant avec "PUT"', async ({ page }) => {
    // Vérifier que le véhicule a été créé par le test POST précédent
    if (!createdVehicleData || !createdVehicleData.registration) {
      // Si le test POST a échoué ou n'a pas créé le véhicule, ce test échouera ici
      test.skip('Le véhicule à mettre à jour n\'a pas été créé par le test POST précédent.');
      return;
    }
    const updatedMake = 'Ferrari';
    const updatedDate = 2025;
    const updatedModel = 'Voiture';
    const updatedPrice = 3500; 

    await test.step(`Ouvrir la modale PUT, mettre à jour le véhicule '${createdVehicleData.registration}'`, async () => {
      await page.click('button.method-btn:has-text("PUT")');
      await expect(page.locator('.modal-container')).toHaveClass(/active/);
      await expect(page.locator('#modal-form h3')).toHaveText('PUT');

      // Remplir tous les champs nécessaires pour le PUT, en utilisant les données originales
      // et en modifiant ceux que nous voulons tester
      await page.fill('#modal-form input[name="registration"]', createdVehicleData.registration);
      await page.fill('#modal-form input[name="make"]', updatedMake); 
      await page.fill('#modal-form input[name="model"]', updatedModel);
      await page.fill('#modal-form input[name="year"]',String(updatedDate)); 
      await page.fill('#modal-form input[name="rentalPrice"]', String(updatedPrice)); 

      await page.click('#modal-form button[type="submit"]:has-text("PUT")');

      await expect(page.locator('.modal-container')).not.toHaveClass(/active/);
      await expect(page.locator('#title-request')).toHaveText(`Requête : Mise à jour du véhicule ${createdVehicleData.registration}`);
      await expect(page.locator('#result-container')).toContainText('Véhicule mis à jour avec succès.');
      await expect(page.locator('#result-container table.vehicle-table')).toBeVisible();
      await expect(page.locator('.vehicle-table tbody tr td:nth-child(2)')).toHaveText(updatedModel);
      await expect(page.locator('.vehicle-table tbody tr td:nth-child(3)')).toHaveText(updatedMake);
      await expect(page.locator('.vehicle-table tbody tr td:nth-child(4)')).toHaveText(`${updatedDate}`);
      await expect(page.locator('.vehicle-table tbody tr td:nth-child(5)')).toHaveText(`${updatedPrice} €`); 
    });
  });

  test('06. Supprimer un véhicule avec "DELETE"', async ({ page }) => {
    // Vérifier que le véhicule existe pour la suppression
    if (!createdVehicleData || !createdVehicleData.registration) {
      test.skip('Le véhicule à supprimer n\'a pas été créé par les tests précédents.');
      return;
    }

    await test.step(`Ouvrir la modale DELETE, supprimer le véhicule '${createdVehicleData.registration}'`, async () => {
      await page.click('button.method-btn:has-text("DELETE")');
      await expect(page.locator('.modal-container')).toHaveClass(/active/);
      await expect(page.locator('#modal-form h3')).toHaveText('DELETE');

      // Le champ pour DELETE est 'id' dans le formulaire généré, mais c'est l'immatriculation
      await page.fill('#modal-form input[name="id"]', createdVehicleData.registration);
      await page.click('#modal-form button[type="submit"]:has-text("DELETE")');

      await expect(page.locator('.modal-container')).not.toHaveClass(/active/);
      await expect(page.locator('#title-request')).toHaveText(`Requête : Suppression du véhicule ${createdVehicleData.registration}`);
      await expect(page.locator('#result-container')).toContainText('Véhicule supprimé avec succès.');

      // Optionnel: Vérifier qu'il n'est plus présent dans la liste GET ALL
      await page.click('#GET_ALL');
      await expect(page.locator('#result-container table.vehicle-table')).toBeVisible();
      const rows = await page.locator('.vehicle-table tbody tr').allTextContents();
      const isStillPresent = rows.some(row => row.includes(createdVehicleData.registration));
      expect(isStillPresent).toBeFalsy(); // Devrait être faux, le véhicule ne devrait plus être là
    });
  });


  test('07. Se déconnecter', async ({ page }) => {
    await test.step('Cliquer sur le bouton de déconnexion et vérifier la redirection vers la page de login', async () => {
      await page.click('#logout-btn');
      await page.waitForURL('**/login.html');
      await expect(page.locator('h2')).toHaveText('Connexion🔐');
    });
  });

});