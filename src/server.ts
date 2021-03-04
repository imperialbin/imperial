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

// Database
connect(process.env.MONGO_URI, {})

// Some of our routes
import { routes as indexRouter } from "./routes/indexRouter";
import { routes as apiRouter } from "./routes/apiRouter";
import { routes as authRouter } from "./routes/authRouter";
import { routes as compareRouter } from "./routes/compareRouter";
import { routes as loginRouter } from "./routes/loginRouter";
import { routes as pasteRouter } from "./routes/pasteRouter";
import { routes as rawRouter } from "./routes/rawRouter";
import { routes as registerRouter } from "./routes/registerRouter";

app.use(["/p", "/d", "/:documentId", "/p/:documentId"]);
app.use("/", indexRouter);
app.use("/api", apiRouter);
app.use("/auth", authRouter);

app.listen(3000, () => console.log("Server running"));
