require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const flash = require("express-flash");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const fs = require("fs");
const passport = require("passport");
const initializePassport = require("./passport-config");
const methodOverride = require("method-override");
const MongoStore = require("connect-mongo").default;
const CrawlerDetect = require("crawler-detect");

// Middleware
const checkAuthenticated = require("./middleware/checkAuthenticated");

// Database
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
  if (err) return err;
  console.log("Connected to database");
});

// Utilities
const apiLimiter = require("./utilities/apiLimiter");
require("./utilities/autoDelete");

// Passport
initializePassport(passport);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(flash());
app.use(cookieParser(process.env.COOKIE_SECRET));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 120 * 60 * 60 * 1000 },
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      dbName: "sessions",
      ttl: 5 * 24 * 60 * 60,
      autoRemove: "interval",
      autoRemoveInterval: 1,
    }),
    unset: "destroy",
  })
); // UwU

app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));
app.use(CrawlerDetect.express());
app.use(express.static(__dirname + "/public"));
app.disable("x-powered-by");
app.set("view-engine", "ejs");

// Routes
const indexRouter = require("./routes/indexRouter");
const registerRouter = require("./routes/registerRouter");
const loginRouter = require("./routes/loginRouter");
const accountRouter = require("./routes/accountRouter");
const authRouter = require("./routes/authRouter");
const apiRouter = require("./routes/apiRouter");
const rawRouter = require("./routes/rawRouter");
const compareRouter = require("./routes/compareRouter");
const pasteRouter = require("./routes/pasteRouter");

// Initialize the routes
app.use("/", indexRouter);
app.use("/login", loginRouter);
app.use("/register", registerRouter);
app.use("/account", checkAuthenticated, accountRouter);
app.use("/api", apiLimiter, apiRouter);
app.use("/auth", authRouter);
app.use(["/raw", "/r", "/raw/:documentId", "/r/:documentId"], rawRouter);

app.use(
  ["/c", "/compare", "/c/:documentIdOne/:documentIdTwo", "/compare/:documentIdOne/:documentIdTwo"],
  compareRouter
);

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

process.on("uncaughtException", (err, origin) => {
  fs.writeSync(process.stderr.fd, `Caught exception: ${err}\n` + `Exception origin: ${origin}`);
});

app.get("*", (req, res) => {
  res.redirect("/");
});

app.listen(3000, () => console.log("Running on 3000!"));
