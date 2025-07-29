import express from 'express';
import cors from 'cors';
import passport from 'passport';
import authRoutes from './routes/auth.routes.js';
import noteRoutes from './routes/note.routes.js';
import './config/passport.js';

const app = express();

app.use(cors({
  // origin: ['http://localhost:3000', 'https://noteapp-yd7e.vercel.app/'], // Update this to your frontend URL if different
  origin: "*",
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));
app.use(express.json());
app.use(passport.initialize());

app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);

app.get('/', (req, res) => {
  res.send('Note App API');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

export default app;