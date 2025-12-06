import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import coachesRouter from './routes/coaches.js';
import messagesRouter from './routes/messages.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/coaches', coachesRouter);
app.use('/api/messages', messagesRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Sunucu hatası oluştu' });
});

// Bind explicitly to localhost to avoid IPv6 EADDRINUSE on some Windows setups
app.listen(PORT, '127.0.0.1', () => {
  console.log(`🚀 Server çalışıyor: http://localhost:${PORT}`);
});

