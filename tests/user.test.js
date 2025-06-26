const request = require('supertest');
const app = require('../src/app');
const sequelize = require('../src/config/database');
const User = require('../src/models/user');
const jwt = require('jsonwebtoken');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe("Tests sur les routes utilisateurs", () => {
  const userData = {
    id: 1,
    name: "Alias",
    password: "root"
  };

  const updatedData = {
    name: "AliasUpdated",
    password: "newpassword"
  };
  

  describe("POST /users", () => {
    it("crée un utilisateur (201)", async () => {
      const res = await request(app).post('/users/register').send(userData);
      expect(res.statusCode).toBe(201);
      expect(res.body).toEqual(expect.objectContaining({
        id: userData.id,
        name: userData.name
      }));
      expect(res.body.password).toBeUndefined(); // mot de passe caché
    });

    it("échoue en cas de doublon (409)", async () => {
      const res = await request(app).post('/users/register').send(userData);
      expect(res.statusCode).toBe(409);
      expect(res.body.error).toMatch(/existe déjà/i);
    });
  });

  describe("GET /users", () => {
    it("récupère tous les utilisateurs (200)", async () => {
      const res = await request(app).get('/users');
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body[0]).toEqual(expect.objectContaining({
        id: userData.id,
        name: userData.name
      }));
      expect(res.body[0].password).toBeUndefined();
    });
  });

  describe("PUT /users/:id", () => {
    it("met à jour l'utilisateur (200)", async () => {
      const res = await request(app).put(`/users/${userData.id}`).send(updatedData);
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(expect.objectContaining({
        id: userData.id,
        name: updatedData.name
      }));
      expect(res.body.password).toBeUndefined();
    });

    it("échoue si l'utilisateur n'existe pas (404)", async () => {
      const res = await request(app).put('/users/999').send({ name: "DoesNotExist" });
      expect(res.statusCode).toBe(404);
      expect(res.body.error).toMatch(/non trouvé/i);
    });
  });

  describe('Tests de connexion (login)', () => {
    let cookie;
    it('réussit la connexion avec un nom et mot de passe valides (200)', async () => {
      const res = await request(app).post('/users/login').send({
        name: 'AliasUpdated',
        password: 'newpassword'
      });

      expect(res.statusCode).toBe(200);
      expect(res.body.accessToken).toBeDefined();
      expect(typeof res.body.accessToken).toBe('string');

      expect(res.headers['set-cookie']).toBeDefined();

      accessToken = res.body.accessToken;
      cookie = res.headers['set-cookie'].find(c => c.startsWith('refreshToken='));
      expect(cookie).toBeDefined();
    });

    it('échoue si le nom est inconnu (401)', async () => {
      const res = await request(app).post('/users/login').send({
        name: 'Inexistant',
        password: 'root'
      });

      expect(res.statusCode).toBe(401);
      expect(res.body.error).toMatch(/introuvable/i);
    });

    it('échoue si le mot de passe est incorrect (401)', async () => {
      const res = await request(app).post('/users/login').send({
        name: 'AliasUpdated',
        password: 'mauvaismotdepasse'
      });

      expect(res.statusCode).toBe(401);
      expect(res.body.error).toMatch(/incorrect/i);
    });
    it('le token contient l\'id et le nom de l\'utilisateur connecté', async () => {
      const loginResponse = await request(app).post('/users/login').send({
        name: 'AliasUpdated',
        password: 'newpassword'
      });

      expect(loginResponse.statusCode).toBe(200);
      const token = loginResponse.body.accessToken;
      expect(token).toBeDefined();

      // Vérifie que le token peut être décodé avec la clé secrète
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      expect(decoded).toHaveProperty('id');
      expect(decoded).toHaveProperty('name', 'AliasUpdated');
      expect(typeof decoded.id).toBe('number');
      expect(typeof decoded.name).toBe('string');
      expect(decoded.exp).toBeGreaterThan(decoded.iat);
    });
  });
  describe('Test sur le refresh et logout ', () => {
    let cookie;
    let OldAccessToken;
    beforeEach(async() =>{
      const res = await request(app).post('/users/login').send({
        name: 'AliasUpdated',
        password: 'newpassword'
      });
      OldAccessToken = res.body.accessToken;
      cookie = res.headers['set-cookie'].find(c => c.startsWith('refreshToken='));
     });
    it('fournit un nouveau accessToken', async () => {
      const res = await request(app)
        .post('/users/refresh')
        .set('Cookie', cookie);

      expect(res.statusCode).toBe(200);
      expect(res.body.accessToken).toBeDefined();
      expect(res.body.accessToken).not.toBe(OldAccessToken);
    });
     it('supprime le refreshToken (cookie vidé)', async () => {
      const res = await request(app)
        .post('/users/logout')
        .set('Cookie', cookie);

      expect(res.statusCode).toBe(204);
      expect(res.headers['set-cookie'][0]).toMatch(/refreshToken=;/);
    });
  }); 
});
