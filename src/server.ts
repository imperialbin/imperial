// Some random imports and consts we need
import express from "express";
const app = express();
import bodeParser from "body-parser";
import { connect } from "mongoose";
import flash from "express-flash";
import session from "express-session";
import cookieParser from "cookie-parser";
import passport from "passport";
import methodOverride from "method-override";
import MongoStore from "connect-mongo";

// Our ENV!!! hiii env!
import "dotenv/config";
const MONGOURI = process.env.MONGO_URI ?? "";
const PORT = process.env.PORT ?? 3000;

// Database
connect(
  MONGOURI,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    if (err) return console.log(err);
    console.log("Connected to database");
  }
);

// Some of our routes
import { routes as indexRouter } from "./routes/indexRouter";
import { routes as accountRouter } from "./routes/accountRouter";
import { routes as apiRouter } from "./routes/apiRouter";
import { routes as authRouter } from "./routes/authRouter";
import { routes as compareRouter } from "./routes/compareRouter";
import { routes as loginRouter } from "./routes/loginRouter";
import { routes as pasteRouter } from "./routes/pasteRouter";
import { routes as rawRouter } from "./routes/rawRouter";
import { routes as registerRouter } from "./routes/registerRouter";

app.use("/", indexRouter);
app.use("/api", apiRouter);
app.use("/auth", authRouter);
app.use("/login", loginRouter);
app.use("/register", registerRouter);
app.use("/account", accountRouter);

app.use(
  [
    "/:documentId",
    "/p",
    "/paste",
    "/document",
    "/d",
    "/paste/:documentId",
    "/p/:documentId",
    "/document/:documentId",
    "/d/:documentId",
    "/:slug/:documentId",
    "/:slug/:slugTwo/:documentId",
    "/:slug/:slugTwo/slugThree/:documentId",
  ],
  pasteRouter
);
app.use(
  [
    "/c",
    "/compare",
    "/c/:documentIdOne/:documentIdTwo",
    "/compare/:documentIdOne/:documentIdTwo",
  ],
  compareRouter
);

app.use(["/r", "/raw", "/r/:documentId", "/raw/:documentId"], rawRouter);

process.on("uncaughtException", (err: string, origin: string) => {
  console.error(
    process.stderr.fd,
    `Caught exception: ${err}\n` + `Exception origin: ${origin}`
  );
});

app.listen(PORT, () => console.log("Server running"));
