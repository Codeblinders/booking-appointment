import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import dbConfig from "./config/dbConfig.js"; // Must have `.js` extension
import userRouter from "./routes/userRoute.js";
import teacherRouter from "./routes/teacherRoute.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/v1/user", userRouter);
app.use("/api/v1/teacher", teacherRouter);

app.listen(port, () => {
  console.log(`MongoDB URI: ${process.env.MONGO_URI}`);
  console.log(`Server running on http://localhost:${port}`);
});
