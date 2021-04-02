// Some random imports and consts we need
import express, { Request, Response } from "express";
const app = express();
import flash from "express-flash";
import session from "express-session";
import cookieParser from "cookie-parser";
import passport from "passport";
import methodOverride from "method-override";

// @ts-ignore shut the fuck up pwetty pwease
import { middleware as crawlerMiddleware } from "es6-crawler-detect";
import MongoStore from "connect-mongo";

// Passport
import { initialize as initializePassport } from "./auth/passport-config";
initializePassport(passport);

// Utilities
import { rateLimiter } from "./utilities/apiLimit";
import "./utilities/autoDelete";

// Middleware
import { checkAuthenticated } from "./middleware/checkAuthenticated";
import { checkNotAuthenticated } from "./middleware/checkNotAuthenticated";

// Our ENV!!! hiii env!
import "dotenv/config";
const MONGOURI = process.env.MONGO_URI ?? "";
const COOKIE_SECRET = process.env.COOKIE_SECRET ?? "";
const SESSION_SECRET = process.env.SESSION_SECRET ?? "";
const PORT = process.env.PORT ?? 3000;

// Database
import { connectDatabase } from "./utilities/connectDatabases";
connectDatabase();

// Some stupid express stuff
app.set("views", "./views");
app.set("view-engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(express.json({ limit: "150kb" }));
app.use(express.static("./public"));
app.use(flash());
app.use(cookieParser(COOKIE_SECRET));
app.use(
  session({
    secret: SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
    cookie: { maxAge: 120 * 60 * 60 * 1000 },
    store: MongoStore.create({
      mongoUrl: MONGOURI,
      dbName: "sessions",
      ttl: 5 * 24 * 60 * 60,
      autoRemove: "interval",
      autoRemoveInterval: 5,
    }),
    unset: "destroy",
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));
app.use(crawlerMiddleware);
app.disable("x-powered-by");

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
import { routes as adminRouter } from "./routes/adminRouter";
import { checkAdmin } from "./middleware/checkAdmin";

app.use("/", indexRouter);
app.use("/api", rateLimiter, apiRouter);
app.use("/auth", authRouter);
app.use("/login", checkNotAuthenticated, loginRouter);
app.use("/register", checkNotAuthenticated, registerRouter);
app.use("/account", checkAuthenticated, accountRouter);
app.use("/admin", checkAdmin, adminRouter);

app.use(
  [
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

app.get("*", (req: Request, res: Response) => {
  res.render("error.ejs", {
    error: "We couldn't find the page/document you're looking for :(",
  });
});
process.on("uncaughtException", (err: any, origin: string) => {
  console.error(
    process.stderr.fd,
    `Caught exception: ${err}\n` +
      `Exception origin: ${origin}\n` +
      `Error stack: ${err.stack}`
  );
});

app.listen(PORT, () => console.log("Server running"));
