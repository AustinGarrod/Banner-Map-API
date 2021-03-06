import express from 'express';
import { json } from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import mongoose from 'mongoose';
import morgan from 'morgan';

// Import routes
import { bannerRouter } from './routes/banner';
import { authRouter } from './routes/auth';

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

// Connect to MongoDB with mongoose
mongoose.connect("mongodb://localhost:27017/banners", {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true
}, () => {
  console.log("Connected to database");
});

// Start listening for requests
app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
