
import express from "express";
import dotenv from "dotenv"; 
import cookieParser from "cookie-parser"; 
import dbConnect from "../DB/dbconnect.js";
import authRouter from "./route/authUser.js";
import messageRouter from "./route/messageRout.js";
import userRouter from "./route/userRout.js"; 
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();
const app=express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(express.json());
app.use(cookieParser()); 


app.use("/api/auth", authRouter);
app.use("/api/message", messageRouter);
app.use("/api/user", userRouter);

app.use(express.static(path.join(__dirname, "../../frontend/dist")));

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/dist/index.html"));
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, async () => {
  try {
    await dbConnect();
    console.log("Server is running on port", PORT);
  } catch (err) {
    console.error("Server failed to start:", err.message);
  }
});
