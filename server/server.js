import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from './config/db.js'

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

connectDB();

app.get("/", (req, res) => {
  res.send("hello world!!");
});

app.listen(port, () => {
  console.log(`server is started on port:${port}`);
});