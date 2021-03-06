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
              `
<div class="">
  <div id=":td" class="ii gt">
    <div id=":tc" class="a3s aiL msg-4423895930860829796">
      <div bgcolor="#FFF" width="100%"
        style="width: 100% !important;background: #fff;margin: 0;padding: 0;min-width: 100%;direction: ltr;">
        <table bgcolor="#FFF" id="m_-4423895930860829796__bodyTable__" width="100%"
          style="width: 100% !important;background: #fff;margin: 0;padding: 0;min-width: 100%;">
          <tbody>
            <tr>
              <td align="center">
                <table id="m_-4423895930860829796main" width="620"
                  style="border: 1px solid #eff1f4;border-radius: 3px;padding: 24px 42px;margin: 24px;background: #fff;max-width: 90vw;background-position: top right;background-repeat: no-repeat;color: #3c4149;font-family: 'SF Pro Display', -apple-system,BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu,Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;font-size: 15px;line-height: 1.4;"
                  border="0" cellspacing="0" cellpadding="0">
                  <tbody>
                    <tr>
                      <td align="left">
                        <table width="100%" border="0" cellspacing="0" cellpadding="0">
                          <tbody>
                            <tr>
                              <td>
                                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                  <tbody>
                                    <tr>
                                      <td width="100%" height="20px" style="line-height: 20px;font-size: 1px;">&nbsp;
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                                <img alt="IMPERIAL" src="https://imperialb.in/assets/img/Logo.png" height="82"
                                  width="82" class="CToWUd">
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        <table width="100%" border="0" cellspacing="0" cellpadding="0">
                          <tbody>
                            <tr>
                              <td>
                                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                  <tbody>
                                    <tr>
                                      <td width="100%" height="10px" style="line-height: 10px;font-size: 1px;">&nbsp;
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                                <h2 style="font-weight: 500;font-size: 22px;color: #282a30;">Hi there!
                                </h2>
                                <p>Somebody has logged into your account just now. If this wasn't you, please make sure
                                  you change your password immediately.
                                </p>
                                <hr
                                  style="display: inline-block;background: #eff1f4;margin-top: 24px;width: 42px;height: 1px;border: none;">
                                <p>
                                  <a href="https://imperialb.in/forgot"
                                    data-saferedirecturl="https://www.google.com/url?q=https://imperialb.in/forgot"
                                    style="color: #161A1E;font-size: 15px;font-weight: 500;line-height: 24px;padding: 0px 16px 20px 0px;"
                                    target="_blank"><strong><span class="il">Change your password</span>→</strong></a>
                                </p>
                                <p>If this was you, relax! No need to act!</p>
                                <hr
                                  style="display: inline-block;background: #eff1f4;margin-top: 24px;width: 42px;height: 1px;border: none;">
                                <hr
                                  style="display: inline-block;background: #eff1f4;margin-top: 24px;width: 42px;height: 1px;border: none;">
                                <br>
                                <p>– <span class="il">IMPERIAL</span></p>
                                <a href="https://imperialb.in/" style="margin-top: 24px;display: inline-block;padding: 10px 23px;color: #fff;background: #161A1E;border-radius: 4px;font-size: 15px;font-weight: 600;text-decoration: none;" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://imperialb.in">Open IMPERIAL</a>
                                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                  <tbody>
                                    <tr>
                                      <td width="100%" height="10px" style="line-height: 10px;font-size: 1px;">&nbsp;
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        <table width="100%" style="margin-top: 24px" border="0" cellspacing="0" cellpadding="0">
                          <tbody>
                            <tr>
                              <td style="padding: 20px 0 0 0;border-top: 1px solid #dfe1e4;font-size: 14px;">
                                <a href="https://imperialb.in/terms"
                                  style="color: #b4becc;font-weight: 500;text-decoration: none;margin-right: 10px;"
                                  target="_blank"
                                  data-saferedirecturl="https://www.google.com/url?q=https://imperialb.in/terms"><span
                                    class="il">TERMS OF SERVICE</span></a>
                                <a href="https://imperialb.in/privacy"
                                  style="color: #b4becc;text-decoration: none;margin: 0 10px;" target="_blank"
                                  data-saferedirecturl="https://www.google.com/url?q=https://imperialb.in/privacy">PRIVACY
                                  POLICY</a>
                                <a href="https://docs.imperialb.in/"
                                  style="color: #b4becc;text-decoration: none;margin: 0 10px;" target="_blank"
                                  data-saferedirecturl="https://www.google.com/url?q=https://docs.imperialb.in">Documentation</a>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>
`
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
  passport.serializeUser((user, done) => done(null, user._id));
  passport.deserializeUser((_id, done) => {
    Users.findById({ _id }).then((user) => done(null, user));
  });
};
