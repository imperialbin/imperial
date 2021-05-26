import { Router, Request, Response } from "express";
import { Documents } from "../models/Documents";
import { IUser, Users } from "../models/Users";
import { Consts } from "../utilities/consts";
import fetch from "node-fetch";

// Utilities
import { generateString } from "../utilities/generateString";
import { getDocuments } from "../utilities/getDocuments";

export const routes = Router();

const DISCORD_BOT_TOKEN = Consts.DISCORD_BOT_TOKEN;
const DISCORD_GUILD = Consts.DISCORD_GUILD;
const DISCORD_ROLE_MEMBER_PLUS = Consts.DISCORD_ROLE_MEMBER_PLUS;

routes.get("/", async (req: Request, res: Response) => {
  const recentDocuments = await Documents.find({})
    .sort({ dateCreated: -1 })
    .limit(15);
  const recentUsers = await Users.find({}).sort({ _id: -1 }).limit(10);

  res.render("admin.ejs", { recentUsers, recentDocuments });
});

routes.get("/user/:id", (req: Request, res: Response) => {
  const _id = req.params.id;
  Users.findOne({ _id }, async (err: string, user: IUser) => {
    if (err)
      return res.render("error.ejs", {
        error: "An error occurred whilst getting that user!",
      });
    if (!user)
      return res.render("error.ejs", {
        error: "That user doesn't exist!",
      });

    res.render("viewUser.ejs", {
      user,
      documents: await getDocuments(_id, 10),
    });
  });
});

routes.get("/getUsers/:query", async (req: Request, res: Response) => {
  const query = req.params.query;
  const users = await Users.find({
    $or: [
      { name: { $regex: query, $options: "i" } },
      { email: { $regex: query, $options: "i" } },
    ],
  }).limit(8);

  res.json({ users });
});

routes.post("/updateUser/:_id", (req: Request, res: Response) => {
  const settings = req.body;
  const _id = req.params._id;
  Users.updateOne({ _id }, { $set: { settings } }, {}, (err: string) => {
    if (err)
      return res.json({
        success: false,
        message: "An error occurred whilst saving their settings!",
      });
    res.json({
      success: true,
      message: "Successfully changed users settings!",
    });
  });
});

routes.post("/changeConfirm", async (req: Request, res: Response) => {
  const status = JSON.parse(req.body.status.toLowerCase());
  const _id = req.body._id;

  await Users.updateOne({ _id }, { $set: { confirmed: !status } });

  res.redirect(`/admin/user/${_id}`);
});

routes.post("/changeBanned", async (req: Request, res: Response) => {
  const status = JSON.parse(req.body.status.toLowerCase());
  const _id = req.body._id;

  await Users.updateOne({ _id }, { $set: { banned: !status } });

  res.redirect(`/admin/user/${_id}`);
});

routes.post("/changeMemberPlus", async (req: Request, res: Response) => {
  const status = JSON.parse(req.body.status.toLowerCase());
  const _id = req.body._id;

  const user = await Users.findOneAndUpdate(
    { _id },
    { $set: { memberPlus: !status } }
  );

  if (!status && user?.discordId) {
    await fetch(
      `https://discord.com/api/guilds/${DISCORD_GUILD}/members/${user?.discordId}/roles/${DISCORD_ROLE_MEMBER_PLUS}`,
      {
        method: "PUT",
        headers: {
          authorization: `Bot ${DISCORD_BOT_TOKEN}`,
        },
      }
    );
  }

  res.redirect(`/admin/user/${_id}`);
});

routes.post("/giveCode", async (req: Request, res: Response) => {
  const _id = req.body._id;

  await Users.updateOne(
    { _id },
    {
      $push: { codes: generateString(8) },
    }
  );

  res.redirect(`/admin/user/${_id}`);
});
