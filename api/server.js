import express from "express";
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from 'cloudinary'; // Correct import for cloudinary.v2
import fileUpload from 'express-fileupload';
import UserRouter from './routes/user.route.js';
import JobRouter from './routes/job.route.js';
import AppRouter from './routes/app.route.js';

import { connectDB } from "./database/connectDB.js";

const app = express();
dotenv.config();

app.use(express.json());
app.use(cors({
  origin: ['http://localhost:5173'],
  credentials: true,
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Authorization', 'Access-Control-Allow-Credentials'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH']
}));
app.use(cookieParser());
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/'
}));

// cloudinary config
cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.CLOUD_KEY, 
  api_secret: process.env.CLOUD_SECRET
});

// routes
app.use('/api/users', UserRouter);
app.use('/api/jobs', JobRouter);
app.use('/api/apps', AppRouter);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  connectDB();
  console.log(`Server running on port ${PORT}`);
});
