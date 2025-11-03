import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import dotenv from "dotenv";
import { pool } from "../config/db.js";
dotenv.config();

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      const [user] = await pool.query(
        "SELECT id, nombre, email FROM usuarios WHERE id = ?",
        [jwt_payload.sub]
      );

      if (!user.length) return done(null, false);
      return done(null, user[0]);
    } catch (e) {
      return done(e, false);
    }
  })
);

export default passport;
