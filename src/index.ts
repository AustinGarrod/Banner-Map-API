import express from 'express';
import { json } from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import mongoose from 'mongoose';
import morgan from 'morgan';
import * as dotenv from "dotenv";

// Implement env file
dotenv.config(); 

// Import routes
import { bannerRouter } from './routes/banner';
import { authRouter } from './routes/auth';
import { statusRouter } from './routes/status';

// Get needed values from ENV
const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS;
const DB_NAME = process.env.DB_NAME;
const APP_PORT = process.env.PORT ? process.env.PORT : process.env.APP_PORT;

// Create express app
const app = express();

// apply libraries to express app
app.use(helmet());
app.use(json());
app.use(cors());
// app.use(morgan('combined'));

// apply routes to express app
app.use(bannerRouter);
app.use(authRouter);
app.use(statusRouter);

// Connect to MongoDB with mongoose
mongoose.connect(`mongodb+srv://${DB_USER}:${DB_PASS}@${DB_HOST}/${DB_NAME}?retryWrites=true&w=majority`, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
}, () => {
  console.log("Connected to database");
});

// Start listening for requests
app.listen(APP_PORT, () => {
  console.log(`Server is listening on port ${APP_PORT}`);
});
