import express, {Application} from 'express';
import * as mongoose from "mongoose";

import cors from 'cors';

const app: Application = express();
const port = process.env.PORT || 5000;
console.log(`Port: ${port}`);

// Middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors({origin: 'http://localhost:3000'})); // Allow React app

// MongoDB Connection
const mongoUri = process.env.MONGO_URI || '';
console.log(`Mongo URI: ${mongoUri}`);
mongoose.connect(mongoUri, {dbName: "Topic2"})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(`MongoDB connection error: ${err}`));
