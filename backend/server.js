const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const http = require('http');
const socketIo = require('socket.io');
const app = express();
const server = http.createServer(app); 

// ✅ Setup Socket.IO with CORS to allow frontend
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173", // Replace with your frontend origin in production
    methods: ['GET', 'POST']
  }
});

// ✅ Socket.IO handling
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});


// 🔴 Export io to use in your routes
module.exports = { io };



// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// Basic route to check server
app.get('/', (req, res) => {
  res.send('API is running...');
});

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const sentenceRoutes = require('./routes/sentence');
app.use('/api/sentence', sentenceRoutes);



const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


server.listen(PORT, () => console.log(`Server running on port ${PORT}`));


