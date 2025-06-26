// playwright.config.js
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  use: {
    baseURL: 'http://localhost:3000', // URL de ton serveur Express
    headless: true, // Affiche le navigateur pendant les tests
  },
});