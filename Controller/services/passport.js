const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const lib = require('../database');
require('dotenv').config();

module.exports = {
  strategy: new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_KEY,
    },
    (async (payload, next) => {
      const query = 'SELECT iduser, username FROM redundit.user WHERE username = ?';
      const params = [payload.username];
      try {
        const db = await lib.connect();
        const rows = db.execute(query, params);
        if (rows.length > 0) {
          user = rows[0][0];
          next(null, user);
        } else {
          next(null, false);
        }
      } catch (err) {
        next(null, false);
      }
    }),
  ),
  serialize(user, done) {
    done(null, user.username);
  },
  async deserialize(username, done) {
    const query = 'SELECT * FROM redundit.user WHERE username = ?';
    const params = [username];
    try {
      const db = await lib.connect();
      const rows = db.execute(query, params);
      if (rows.length > 0) {
        const user = rows[0][0];
        done(null, user);
      } else {
        done('No user', null);
      }
    } catch (err) {
      done(err, null);
    }
  },
};
