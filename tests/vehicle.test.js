const request = require('supertest');
const app = require('../src/app');
const { sequelize } = require('../src/models/vehicle.js');
const Vehicle = require('../src/models/vehicle');
const User = require('../src/models/user');

let token;

beforeAll(async () => {
  await sequelize.sync({ force: true });

  // Crée un utilisateur pour les tests
  await request(app).post('/users/register').send({
    id: 1,
    name: 'admin',
    password: 'admin123'
  });

  // Récupère un token JWT
  const res = await request(app).post('/users/login').send({
    name: 'admin',
    password: 'admin123'
  });


  token = res.body.accessToken;
  expect(token).toBeDefined();
}, 20000);

describe("Tests complets de l'API des véhicules avec authentification", () => {
  const baseVehicle = {
    registration: 'CAR123',
    make: 'Peugeot',
    model: '208',
    year: 2020,
    rentalPrice: 50.0
  };

  describe('GET /vehicules (liste vide)', () => {
    it('retourne un tableau vide', async () => {
      const res = await request(app).get('/vehicules');
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual([]);
    });
  });

  describe('POST /vehicules', () => {
    it('crée un véhicule (201)', async () => {
      const res = await request(app)
        .post('/vehicules')
        .set('Authorization', `Bearer ${token}`)
        .send(baseVehicle);
      expect(res.statusCode).toBe(201);
      expect(res.body.registration).toBe(baseVehicle.registration);
    });

    it('échoue avec un doublon (409)', async () => {
      const res = await request(app)
        .post('/vehicules')
        .set('Authorization', `Bearer ${token}`)
        .send(baseVehicle);
      expect(res.statusCode).toBe(409);
      expect(res.body.error).toMatch(/existe déjà/);
    });
  });

  describe('GET /vehicules/:registration', () => {
    it('retourne un véhicule existant (200)', async () => {
      const res = await request(app).get(`/vehicules/${baseVehicle.registration}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.registration).toBe(baseVehicle.registration);
    });

    it('retourne 404 pour un véhicule inexistant', async () => {
      const res = await request(app).get('/vehicules/INEXISTANT');
      expect(res.statusCode).toBe(404);
    });
  });

  describe('PUT /vehicules/:registration', () => {
    it('met à jour un véhicule existant', async () => {
      const res = await request(app)
        .put(`/vehicules/${baseVehicle.registration}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ rentalPrice: 60.0 });
      expect(res.statusCode).toBe(200);
      expect(res.body.rentalPrice).toBe(60.0);
    });

    it("retourne 404 pour une mise à jour d'un véhicule inexistant", async () => {
      const res = await request(app)
        .put('/vehicules/INEXISTANT')
        .set('Authorization', `Bearer ${token}`)
        .send({ rentalPrice: 100 });
      expect(res.statusCode).toBe(404);
    });
  });

  describe('GET /vehicules/prix?min=&max=', () => {
    beforeAll(async () => {
      await Vehicle.create({
        registration: 'CAR999',
        make: 'Renault',
        model: 'Clio',
        year: 2021,
        rentalPrice: 40.0
      });
    });

    it('retourne les véhicules dans une tranche de prix', async () => {
      const res = await request(app).get('/vehicules/prix?min=30&max=60');
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe('DELETE /vehicules/:registration', () => {
    it('supprime un véhicule existant', async () => {
      const res = await request(app)
        .delete(`/vehicules/${baseVehicle.registration}`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toBe(204);
    });

    it('retourne 404 pour un véhicule inexistant', async () => {
      const res = await request(app)
        .delete('/vehicules/INEXISTANT')
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toBe(404);
    });
  });
});

afterAll(async () => {
  await sequelize.close();
});
