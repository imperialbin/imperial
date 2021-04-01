import { Router, Request, Response } from "express";
import { Users } from "../models/Users";
import { hash } from "bcrypt";
import { stringify } from "querystring";
import fetch from "node-fetch";

// Utilities
import { verifyToken } from "../utilities/verifyToken";
import { checkAuthenticated } from "../middleware/checkAuthenticated";
import { generateString } from "../utilities/generateString";

export const routes = Router();

// env
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const DISCORD_GUILD = process.env.DISCORD_GUILD;
const DSICORD_CALLBACK_URI = process.env.DSICORD_CALLBACK_URI;
const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;

routes.get("/", (req: Request, res: Response) => {
  res.redirect("/");
});

// Discord integration
routes.get("/discord", checkAuthenticated, (req: Request, res: Response) => {
  res.redirect(
    `https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${DSICORD_CALLBACK_URI}&response_type=code&scope=identify%20guilds%20guilds.join`
  );
});

routes.get(
  "/discord/callback",
  checkAuthenticated,
  async (req: Request, res: Response) => {
    // Some of this code is based off of pxls code, but like its simple oauth, so its like what more/less could you do?
    const code = req.query.code;
    const user = await Users.findOne({ _id: req.user?.toString() });

    if (!code || !user)
      return res.render("error.ejs", {
        error: "An error occurred whilst linking your discord account!",
      });

    const fetchToken = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      body: stringify({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: "authorization_code",
        code: code as string,
        redirect_uri: `${process.env.MAIN_URI}/auth/discord/callback`,
        scope: "identify guilds guilds.join",
      }),
      headers: {
        "content-type": "application/x-www-form-urlencoded",
      },
    });
    const token = await fetchToken.json();
    console.log(token);

    if (!token.access_token)
      return res.render("error.ejs", { error: "Invalid OAuth2 token!" });

    const getDiscordUser = await fetch("https://discord.com/api/users/@me", {
      headers: {
        authorization: `${token.token_type} ${token.access_token}`,
      },
    });
    const discordUser = await getDiscordUser.json();
    console.log(discordUser);
    if (!discordUser.id)
      return res.render("error.ejs", {
        error:
          "Your bearer token expired! Please go and try authorizing again!",
      });

    // Make the mf join the server
    await fetch(
      `https://discord.com/api/guilds/${DISCORD_GUILD}/members/${discordUser.id}`,
      {
        method: "PUT",
        body: JSON.stringify({
          access_token: token.access_token,
        }),
        headers: {
          "content-type": "application/json",
          "authorization": `Bot ${DISCORD_BOT_TOKEN}`,
        },
      }
    );

    // Give that mf a name
    await fetch(
      `https://discord.com/api/guilds/${DISCORD_GUILD}/members/${discordUser.id}`,
      {
        method: "PATCH",
        body: JSON.stringify({
          nick: user.name,
        }),
        headers: {
          "content-type": "application/json",
          "authorization": `Bot ${DISCORD_BOT_TOKEN}`,
        },
      }
    );

    // give that mf a role
    await fetch(
      `https://discord.com/api/guilds/${DISCORD_GUILD}/members/${discordUser.id}/roles/${process.env.DISCORD_ROLE_MEMBER}`,
      {
        method: "PUT",
        headers: {
          authorization: `Bot ${DISCORD_BOT_TOKEN}`,
        },
      }
    );

    // Save the Discord ID to uhhhhhhhhhhhhhhhhhhhhhhhhhh the user yea
    await Users.updateOne(
      { _id: user._id },
      { $set: { discordId: discordUser.id } }
    );

    res.render("success.ejs", {
      successMessage: "Successfully linked your account with Discord!",
    });
  }
);

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
