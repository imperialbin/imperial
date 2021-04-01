import { Router, Request, Response } from "express";
import { Users } from "../models/Users";
import { hash } from "bcrypt";

// Utilities
import { verifyToken } from "../utilities/verifyToken";
import { checkAuthenticated } from "../middleware/checkAuthenticated";

export const routes = Router();

// env
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const DISCORD_GUILD = process.env.DISCORD_GUILD;

routes.get("/", (req: Request, res: Response) => {
  res.redirect("/");
});

routes.get("/:token", async (req: Request, res: Response) => {
  const token = req.params.token;
  try {
    const getEmail = verifyToken(token);

    await Users.updateOne({ email: getEmail }, { $set: { confirmed: true } });
    res.redirect("/login");
  } catch (err) {
    res.render("error.ejs", {
      error: "Invalid token! Please contact an admin!",
    });
  }
});

// Discord integration
routes.get(
  "/discord/callback",
  checkAuthenticated,
  async (req: Request, res: Response) => {
    const code = req.query.code;
    const state = req.query.state;

    if (!code || !state)
      return res.render("error.ejs", {
        error: "An error occurred whilst linking your discord account!",
      });

    // I need to check the state here later

    const fetchToken = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      body: JSON.stringify({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: "authorization_code",
        code,
        redirect_uri: `${process.env.MAIN_URI}/auth/discord/callback`,
        scope: "identify guilds guilds.join",
      }),
    });

    const token = await fetchToken.json();
    console.log(token);
    const getDiscordUser = await fetch("https://discord.com/api/users/@me", {
      headers: {
        authorization: `${token.token_type} ${token.access_token}`,
      },
    });
    const discordUser = getDiscordUser.json();
    const roles = [process.env.DISCORD_ROLE_MEMBER]
    console.log(discordUser);

    // Give them the role
    await fetch(
      `https://discord.com/api/guilds/${DISCORD_GUILD}/members/${discordUser.id}`,
      {
        method: "PUT",
        body: JSON.stringify({
          access_token: token.access_token,
          roles,
        }),
      }
    );
  }
);

routes.post("/resetPassword", async (req: Request, res: Response) => {
  const token = req.body.token;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  try {
    const tokenInfo = verifyToken(token);
    if (password.length < 8) throw "Your password must be 8 characters long!";
    if (confirmPassword === password) throw "Passwords do not match!";

    const hashedPass = await hash(password, 13);
    await Users.updateOne(
      { email: tokenInfo },
      { $set: { password: hashedPass } }
    );

    res.render("success.ejs", {
      successMessage: "Successfully reset your password!",
    });
  } catch (error) {
    res.render("resetPassword.ejs", {
      token,
      error: "Invalid token or token has expired!!",
    });
  }
});
