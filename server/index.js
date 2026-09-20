import dotenv from "dotenv";
dotenv.config();

import express from "express";
import bodyParser from "body-parser";
import connectDB from "./config/dbConfig.js";
import cors from "cors";

// Router import 

import adminAuthRoutes from './routes/admin/authRoute.js'


const PORT = process.env.PORT || 3000;

const app = express();
app.use(bodyParser.json());
app.use(cors());

//Database Connection
await connectDB();

// Testing Route

app.get("/test-server", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Server is running successfully",
        server: {
            name: "Noodle Junction",
            status: "online",
            environment: process.env.NODE_ENV,
            port: PORT,
        },
        database: {
            name: process.env.DB_NAME || "Not configured",
            status: "connected",
        },
        timestamp: new Date().toISOString(),
    });
});

// Admin Routes 
app.use('/api/admin/auth', adminAuthRoutes);

// Branch Routes


// Customer Routes



//Server Setup
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})

