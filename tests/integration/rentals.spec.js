const request = require('supertest');
const { Rental } = require('../../models/rental');
const { User } = require('../../models/user');
const { Movie } = require('../../models/movie');
const { Customer } = require('../../models/customer');
const mongoose = require('mongoose');

describe('/api/rentals', () => {
  let server;
  let customerId;
  let movieId;
  const rentalObj = {
    customer: {
      _id: customerId,
      name: '12345',
      phone: '12345',
    },
    movie: {
      _id: movieId,
      title: '12345',
      dailyRentalRate: 2,
    },
  };

  beforeEach(() => {
    server = require('../../index');
    customerId = mongoose.Types.ObjectId();
    movieId = mongoose.Types.ObjectId();
  });
  afterEach(async () => {
    server.close();
    await Rental.deleteMany({});
  });

  describe('GET /', () => {
    it('should return all rentals', async () => {
      await Rental.insertMany([rentalObj]);
      const res = await request(server).get('/api/rentals');
      expect(res.body.length).toBe(1);
    });
  });

  describe('GET /:id', () => {
    it('should return 404 if proper mongoose object id is not provided', async () => {
      const res = await request(server).get('/api/rentals/abcd');
      expect(res.status).toBe(404);
    });

    it('should return 404 if invalid id is provided', async () => {
      const id = mongoose.Types.ObjectId();
      const res = await request(server).get(`/api/rentals/${id}`);
      expect(res.status).toBe(404);
    });

    it('should return a single rental if proper id is given', async () => {
      const rental = await Rental.create(rentalObj);
      const res = await request(server).get('/api/rentals/' + rental._id);
      expect(res.body).toHaveProperty('_id');
      expect(res.body).toHaveProperty('customer');
      expect(res.body).toHaveProperty('movie');
      expect(res.body).toHaveProperty('dateOut');
    });
  });

  describe('POST /', () => {
    let token;

    const exec = async () => {
      return await request(server)
        .post('/api/rentals')
        .set('x-auth-token', token)
        .send({ movieId, customerId });
    };

    beforeEach(() => {
      token = new User().generateAuthToken();
    });

    afterEach(async () => {
      await Customer.deleteMany({});
      await Movie.deleteMany({});
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

    test('should return 400 if invalid customer or movie id provided', async () => {
      const res = await exec();
      expect(res.status).toBe(400);
    });
  });
});
