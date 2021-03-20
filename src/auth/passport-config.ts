import { Strategy as LocalStrategy } from "passport-local";
import { IUser, Users } from "../models/Users";
import bcrypt from "bcrypt";

// uwu
export const initialize = (passport: any) => {
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
  passport.serializeUser((user: IUser, done: any) => done(null, user._id));
  passport.deserializeUser(async (id: string, done: any) => {
    Users.findById(id, (err: string, user: IUser) => {
      done(err, user._id);
    });
  });
};
