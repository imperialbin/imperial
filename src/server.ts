// Some random imports and consts we need
import express from "express";
const app = express();
import bodyParser from "body-parser";
import { connect } from "mongoose";
import flash from "express-flash";
import session from "express-session";
import cookieParser from "cookie-parser";
import passport from "passport";
import methodOverride from "method-override";

// @ts-ignore shut the fuck up pwetty pwease
import CrawlerDetect from "crawler-detect";
import MongoStore from "connect-mongo";

// Passport
import initializePassport from "./auth/passport-config";
initializePassport(passport);

// Utilities
import { rateLimiter } from "./utilities/apiLimiter";
import "./utilities/autoDelete";

// Middleware
import checkAuthenticated from "./middleware/checkAuthenticated";
import checkNotAuthenticated from "./middleware/checkNotAuthenticated";

// Our ENV!!! hiii env!
import "dotenv/config";
const MONGOURI = process.env.MONGO_URI ?? "";
const COOKIE_SECRET = process.env.COOKIE_SECRET ?? "";
const SESSION_SECRET = process.env.SESSION_SECRET ?? "";
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

// Some stupid express stuff
app.set("views", "./views");
app.set("view-engine", "ejs");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
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
      autoRemoveInterval: 15,
    }),
    unset: "destroy",
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));
app.use(CrawlerDetect.express());
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

app.use("/", indexRouter);
app.use("/api", rateLimiter, apiRouter);
app.use("/auth", authRouter);
app.use("/login", checkNotAuthenticated, loginRouter);
app.use("/register", checkNotAuthenticated, registerRouter);
app.use("/account", checkAuthenticated, accountRouter);

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

process.on("uncaughtException", (err: string, origin: string) => {
  console.error(
    process.stderr.fd,
    `Caught exception: ${err}\n` + `Exception origin: ${origin}`
  );
});

app.listen(PORT, () => console.log("Server running"));
