import dotenv from "dotenv";
dotenv.config();

import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import connectDB from "./config/dbConfig.js";
const PORT = process.env.PORT || 3000;

const app = express();
app.use(bodyParser.json());
app.use(cors());

//Database Connection
await connectDB();

//Server Setup
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})

