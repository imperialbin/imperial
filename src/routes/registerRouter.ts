import { Router, Request, Response } from "express";
import { Users } from "../models/Users";
import { hash } from "bcryptjs";
// @ts-ignore shhh
import getIp from "ipware";

// Utilities
import { mail } from "../utilities/mailer";
import { generateApiToken } from "../utilities/generateApiToken";
import { signToken } from "../utilities/signToken";

export const routes = Router();

routes.get("/", (req: Request, res: Response) => {
  res.render("register.ejs", { error: false, user: false, email: false });
});

routes.post("/", async (req: Request, res: Response) => {
  const throwInternalError = (error: string, email: string, user: string) => {
    res.render("register.ejs", {
      error,
      email,
      user,
    });
  };

  const email = req.body.email.toLowerCase();
  const username = req.body.name.toLowerCase();
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const inviteCode = req.body.code;
  const usersIp = getIp(req);

  // Check if username has been taken and if it returns
  const usernameCheck = await Users.findOne({ name: username });
  if (usernameCheck)
    return throwInternalError("That username is taken", email, username);

  // Check if we already have an IP associated with existing user
  const ipCheck = await Users.findOne({ ip: usersIp.clientIp });
  if (ipCheck?.ip)
    return throwInternalError(
      "IP is already associated with an account!",
      email,
      username
    );
  // Check if the email already is associated with an existing user
  const emailCheck = await Users.findOne({ email });
  if (emailCheck)
    return throwInternalError(
      "A user with that email already has an account!",
      email,
      username
    );

  // Check if the passwords are long enough and if they match
  if (password.length < 8)
    return throwInternalError(
      "Please make your password atleast 8 characters long!",
      email,
      username
    );
  if (password !== confirmPassword)
    return throwInternalError("Passwords do not match!", email, username);

  // Check the beta code
  //@ts-ignore This ignore is so that it doesnt complain that `code: inviteCode` isnt in the thingy
  const checkCode = await Users.findOne({ codes: inviteCode });
  if (!checkCode)
    return throwInternalError("Invalid invite code!", email, username);

  try {
    const hashedPass = await hash(password, 13);
    const emailToken = signToken(email);
    const newUser = new Users({
      userId: (await Users.collection.count()) + 1,
      name: username,
      email: email,
      betaCode: inviteCode,
      banned: false,
      confirmed: false,
      ip: usersIp.clientIp,
      codesLeft: 0,
      icon: "/assets/img/pfp.png",
      password: hashedPass,
      memberPlus: false,
      apiToken: generateApiToken(),
      codes: [],
      documentsMade: 0,
      activeUnlimitedDocuments: 0,
      discordId: null,
      githubAccess: null,
      settings: {
        clipboard: false,
        longerUrls: false,
        instantDelete: false,
        encrypted: false,
        expiration: 5,
        imageEmbed: false,
      },
    });
    await newUser.save();

    mail(
      email,
      "Confirm your email",
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
                                <p>Welcome to IMPERIAL! We're thrilled to have you aboard. Please confirm your account before using!
                                </p>
                                <hr
                                  style="display: inline-block;background: #eff1f4;margin-top: 24px;width: 42px;height: 1px;border: none;">
                                <br>
                                <p>– <span class="il">IMPERIAL</span></p>
                                <a href="https://imperialb.in/auth/${emailToken}" style="margin-top: 24px;display: inline-block;padding: 10px 23px;color: #fff;background: #161A1E;border-radius: 4px;font-size: 15px;font-weight: 600;text-decoration: none;" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://imperialb.in/auth/${emailToken}">Confirm Email</a>
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
      .then(async () => {
        await Users.findOneAndUpdate(
          // @ts-ignore shhh
          { codes: { code: inviteCode } },
          { $pull: { codes: { code: inviteCode } } }
        );
        return res.render("success.ejs", {
          successMessage: `Please check your email to verify! (${email})`,
        });
      })
      .catch((err) => {
        console.log(err);
        return throwInternalError(
          "An error occurred whilst emailing you, please contact an admin!",
          email,
          username
        );
      });
  } catch (error) {
    console.log(error);
    return throwInternalError(
      "An error occurred, please contact an admin!",
      email,
      username
    );
  }
});
