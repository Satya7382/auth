import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import connectDB from './config/mongodb.js';
import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';
const app = express();
const PORT = process.env.PORT || 4000;

connectDB();

const allowedOrigins = [
  'http://localhost:5173',
  'https://auth098.netlify.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// API Endpoints
app.get('/', (req, res) => {
  res.send('Hello from Express server!');
});
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

