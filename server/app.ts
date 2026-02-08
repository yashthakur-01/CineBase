import express, { Express } from 'express';
import dbConnect from "./lib/dbConnect.js";
import dotenv from "dotenv";
import routes from "./routes/index.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "./config/passport.js";

dotenv.config();

const app: Express = express();

const PORT = process.env.PORT;

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize passport
app.use(passport.initialize());

app.use("/api", routes);

dbConnect();

app.listen(PORT, () => {
  console.log(`server running successfully on port ${PORT}`);
});