import express from 'express';
import dotenv from 'dotenv';
import session from 'express-session';
import passport from 'passport';
import cors from 'cors';
import MongoStore from 'connect-mongo';
import dbConnect from './configs/dbconnect.js';
import authRoutes from './routes/authRoutes.js';
import './configs/passportConfig.js';

dotenv.config();

const app = express();

// Connect DB
dbConnect();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));

// Trust proxy (important for cookies)
app.set('trust proxy', 1);

// Session middleware
app.use(
  session({
    name: 'mern-2fa-session',
    secret: process.env.SESSION_SECRET || 'dev_secret_key',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: 'sessions',
    }),
    cookie: {
      httpOnly: true,
      secure: false, // set true in production (https)
      maxAge: 1000 * 60 * 60, // 1 hour
    },
  })
);

// Passport
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/auth" , authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});