const { User } = require('../../../models/user');
const admin = require('../../../middlewares/admin');
const auth = require('../../../middlewares/auth');
const mongoose = require('mongoose');

describe('admin middleware', () => {
  it('should return 403 if authenticated user is not admin', () => {
    const user = {
      _id: mongoose.Types.ObjectId().toHexString(),
      isAdmin: false,
    };
    const token = new User(user).generateAuthToken();
    const req = {
      header: jest.fn().mockReturnValue(token),
    };
    req.user = user;

    function Response(code = 200, data = '') {
      this.code = code;
      this.data = data;
    }
    Response.prototype = {
      status: function (code) {
        this.code = code;
        return this;
      },
      send: function (data) {
        this.data = data;
        return this;
      },
    };
    const next = jest.fn();
    const res = new Response();

    admin(req, res, next);
    expect(res.code).toBe(403);
  });

  it('should pass middleware if authenticated & user is admin', () => {
    const user = {
      _id: mongoose.Types.ObjectId().toHexString(),
      isAdmin: true,
    };
    const token = new User(user).generateAuthToken();
    const req = {
      header: jest.fn().mockReturnValue(token),
    };
    const res = {};
    const next = jest.fn();

    auth(req, res, next);
    admin(req, res, next);
    expect(next).toHaveBeenCalled();
  });
});
