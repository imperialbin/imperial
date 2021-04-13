import { Router, Request, Response } from "express";
import { IUser, Users } from "../models/Users";
import { hash } from "bcryptjs";

// Middleware
import { checkAuthenticated } from "../middleware/checkAuthenticated";
import { checkNotAuthenticated } from "../middleware/checkNotAuthenticated";

// Utilities
import { mail } from "../utilities/mailer";
import { signToken } from "../utilities/signToken";
import { verifyToken } from "../utilities/verifyToken";
import { rateLimiter } from "../utilities/apiLimit";

export const routes = Router();

// default pages
routes.get("/", (req: Request, res: Response) => {
  if (req.isAuthenticated()) {
    const user = req.user;
    if (user && !user.banned) {
      res.render("index.ejs", {
        loggedIn: true,
        pfp: user.icon,
        isAdmin: user.admin || null,
        settings: user.settings,
      });
    }
  } else {
    res.render("index.ejs", { loggedIn: false, settings: false });
  }
});

routes.get("/about", (req: Request, res: Response) => {
  res.render("about.ejs");
});

routes.get("/forgot", (req: Request, res: Response) => {
  res.render("forgot.ejs", { error: false });
});

routes.get("/resetPassword/:resetToken", (req: Request, res: Response) => {
  const token = req.params.resetToken;
  const tokenExists = verifyToken(token);
  if (!tokenExists)
    return res.render("error.ejs", { error: "Token is not valid!" });

  res.render("resetPassword.ejs", { token, error: false });
});

routes.get("/redeem", checkAuthenticated, (req: Request, res: Response) => {
  res.render("redeem.ejs", { error: false });
});

routes.get("/logout", (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) return console.log(err);

    // @ts-ignore shut up pwetty pwease
    req.session = null;
    req.logOut();
  });
  res.redirect("/login");
});

routes.get(["/terms", "/tos"], (req: Request, res: Response) => {
  res.render("terms.ejs");
});

routes.get(
  ["/policy", "/privacy", "/privacypolicy"],
  (req: Request, res: Response) => {
    res.render("privacy.ejs");
  }
);

// Social Medias
routes.get(["/discord", "/dis", "/dsc"], (req: Request, res: Response) =>
  res.redirect("https://discord.com/invite/cTm85eW49D")
);

routes.get(["/github", "/git", "/gh"], (req: Request, res: Response) =>
  res.redirect("https://github.com/imperialbin")
);

// Some posts for resetting your password
routes.post(
  "/requestResetPassword",
  checkNotAuthenticated,
  rateLimiter,
  (req: Request, res: Response) => {
    const email = req.body.email.toLowerCase();
    Users.findOne({ email }, (err: string, user: IUser) => {
      if (err)
        return res.render("forgot.ejs", {
          error: "An internal server error has occurred!",
        });

      if (!user)
        return res.render("forgot.ejs", {
          error: "We couldn't find a user with that email!",
        });

      const token = signToken(email);
      mail(
        email,
        "Reset password",
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
                                <p>You've requested to reset your password! Heres the link to reset it :).
                                </p>
                                <hr
                                  style="display: inline-block;background: #eff1f4;margin-top: 24px;width: 42px;height: 1px;border: none;">
                                <br>
                                <p>– <span class="il">IMPERIAL</span></p>
                                <a href="https://www.imperialb.in/resetPassword/${token}" style="margin-top: 24px;display: inline-block;padding: 10px 23px;color: #fff;background: #161A1E;border-radius: 4px;font-size: 15px;font-weight: 600;text-decoration: none;" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://www.imperialb.in/resetPassword/${token}">Reset Password</a>
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
      )
        .then(() => {
          res.render("success.ejs", {
            successMessage: `Please check your email at ${email}`,
          });
        })
        .catch((err) => {
          console.log(err);
          res.render("error.ejs", { error: "An unexpected error happened!" });
        });
    });
  }
);

routes.post("/resetPassword", async (req: Request, res: Response) => {
  const token = req.body.token;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  try {
    const getEmail = verifyToken(token);

    if (password.length < 8) throw "Your password must be 8 characters long!";
    if (password !== confirmPassword) throw "Passwords do not match!";

    const hashedPass = await hash(password, 13);
    await Users.updateOne(
      { email: getEmail },
      { $set: { password: hashedPass } }
    );

    res.render("success.ejs", {
      successMessage: "Successfully resetted your password!",
    });
  } catch (error) {
    return res.render("resetPassword.ejs", {
      token,
      error: "Invalid reset token or token has expired!",
    });
  }
});
