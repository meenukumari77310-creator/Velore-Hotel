// server.js or index.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { connectDB } from './config/mongodb.js';
import userRoutes from './routes/auth.js';
import { startOtpCleaner } from './config/otpCleaner.js';



dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cookieParser());
app.use(cors({ 
    origin: 'http://localhost:3000',
    credentials: true 
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false, limit: '50mb' }));
//app.use(auth);
app.use('/foodie', userRoutes);


// Make images folder publicly accessible
app.use("/uploads", express.static("uploads"));


app.use((error, req, res, next) => {
  const message = error.message || 'server error';
  const statusCode = error.statusCode || 500;
  res.status(statusCode).json({ message: message });
});

// 🔁 Connect to DB and start cron
const startServer =  () => {
  connectDB();            // 1. Connect MongoDB
  startOtpCleaner();            // 2. Start OTP cleaner
  app.listen(PORT, () => console.log(`server running on port ${PORT}`));
};

startServer();
