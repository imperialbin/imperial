import { Strategy as LocalStrategy } from "passport-local";
import { IUser, Users } from "../models/Users";
import bcrypt from "bcryptjs";
import { mail } from "../utilities/mailer";
import Passport from "passport";

// uwu
export const initialize = (passport: typeof Passport): void => {
  const authenticateUser = async (
    email: string,
    password: string,
    done: any
  ) => {
    Users.findOne(
      { $or: [{ email: email.toLowerCase() }, { name: email.toLowerCase() }] },
      async (err: string, user: IUser) => {
        if (err)
          return done(null, false, {
            message:
              "An internal server error has occurred! Please contact an admin!",
          });

        if (!user)
          return done(null, false, { message: "No user with that email" });
        if (!user.confirmed)
          return done(null, false, { message: "Please confirm your email!" });
        if (user.banned)
          return done(null, false, { message: "You are banned!" });

        try {
          if (await bcrypt.compare(password, user.password)) {
            mail(
              user.email,
              "IMPERIAL | New login",
              "Hey there!",
              `Somebody has just logged into your IMPERIAL account! If this wasn't you, please change your password ASAP <a href="https://imperialb.in/forgot">here</a>`
            );
            return done(null, user);
          } else {
            return done(null, false, { message: "Password incorrect" });
          }
        } catch (e) {
          return done(e);
        }
      }
    );
  };

  passport.use(new LocalStrategy({ usernameField: "email" }, authenticateUser));
  passport.serializeUser((user, done) => done(null, user));
  passport.deserializeUser((id, done) => {
    Users.findById({ _id: id })
      .then((user) => done(null, user))
  });
};
