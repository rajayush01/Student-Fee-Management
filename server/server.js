import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import http from 'http';
import { Server as SocketIO } from 'socket.io';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.js';
import studentRoutes from './routes/students.js';
import paymentRoutes from './routes/payments.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new SocketIO(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

io.on('connection', (socket) => {
  console.log('✅ A user connected to Socket.IO');

  socket.on('disconnect', () => {
    console.log('❌ A user disconnected from Socket.IO');
  });
});

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/payments', paymentRoutes);

const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');

  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log('Everything is connected and ready!');
  });
})
.catch((err) => {
  console.error('Failed to connect to MongoDB:', err);
});
