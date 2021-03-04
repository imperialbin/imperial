import { Strategy as LocalStrategy } from "passport-local";
import { Users } from "../models/Users";
import bcrypt from "bcrypt";
import passport, { authenticate } from "passport";

function initialize(passport: any) {
  const authenticateUser = async (email: string, password: string, done: any) => {
    Users.findOne(
      {
        $or: [{ email: email.toLowerCase() }, { name: email.toLowerCase() }],
      },
      async (err: string, user: any) => {
        if (err) return console.log(err);

        if (!user)
          return done(null, false, {
            message: "No user with that email or username!",
          });

        if (!user.confirmed)
          return done(null, false, { message: "Please confirm your email!" });
        if (user.banned)
          return done(null, false, { message: "You are banned!" });
        try {
          if (await bcrypt.compare(password, user.password)) {
            return done(null, user);
          } else {
            return done(null, false, { message: "Password incorrect!" });
          }
        } catch (e) {
          return done(e);
        }
      }
    );
  };
}

  passport.use(new LocalStrategy({ usernameField: "email" }, authenticateUser));
  passport.serializeUser((user, done) => done(null, user._id));
  passport.deserializeUser(async (id, done) => {
    Users.findById(id, (err, user) => {
      done(err, user._id);
    });
  });
}