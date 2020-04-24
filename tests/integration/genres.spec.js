const request = require('supertest');
const { Genre } = require('../../models/genre');
const { User } = require('../../models/user');
let server;

describe('/api/genres', () => {
  beforeEach(() => {
    server = require('../../index');
  });
  afterEach(async () => {
    server.close();
    await Genre.remove({});
  });

  describe('GET /', () => {
    it('should return all genres', async () => {
      const genres = await Genre.insertMany([
        { name: 'genre1' },
        { name: 'genre2' },
      ]);
      const res = await request(server).get('/api/genres');
      expect(res.status).toBe(200);
      expect(genres.some((genre) => genre.name === 'genre1')).toBeTruthy();
      expect(genres.some((genre) => genre.name === 'genre2')).toBeTruthy();
    });
  });

  describe('GET /:id', () => {
    test('should return a genre by ID', async () => {
      const genre = await Genre.create({
        name: 'genre1',
      });
      const res = await request(server).get(`/api/genres/${genre.id}`);
      expect(res.status).toBe(200);
      expect(res.body.name).toEqual(genre.name);
      expect(res.body).toHaveProperty('name', genre.name);
    });
    test('should return 404 if invalid ID is passed', async () => {
      const res = await request(server).get('/api/genres/1');
      expect(res.status).toBe(404);
    });
  });

  describe('POST /', () => {
    let name;
    let token;

    const exec = async () => {
      return await request(server)
        .post('/api/genres')
        .set('x-auth-token', token)
        .send({ name });
    };

    beforeEach(() => {
      token = new User().generateAuthToken();
      name = 'genre1';
    });

    test('should return 401 if not logged in', async () => {
      token = '';
      const res = await exec();
      expect(res.status).toBe(401);
    });

    test('should return 400 if invalid auth token provided', async () => {
      token = 'invalidtoken';
      const res = await exec();
      expect(res.status).toBe(400);
    });

    test('should return 400 if genre name length is less than 3', async () => {
      name = 'ge';
      const res = await exec();
      expect(res.status).toBe(400);
    });

    test('should return 400 if genre name length is greater than 50', async () => {
      name = new Array(52).join('a');
      const res = await exec();
      expect(res.status).toBe(400);
    });

    test('should create a new genre into DB', async () => {
      const res = await exec();
      expect(res.body).toHaveProperty('_id');
      expect(res.body).toHaveProperty('name', 'genre1');
    });
  });
});
