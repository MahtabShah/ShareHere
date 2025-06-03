const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const http = require('http');
const socketIo = require('socket.io');
const app = express();
const server = http.createServer(app); 



// const allowedOrigin = process.env.NODE_ENV === 'production'
//   ? 
//   : "http://localhost:5174";
// Allow multiple origins
const allowedOrigins = process.env.VITE_FRONTEND_URL || "https://sharehere-frontend.onrender.com" // Add production frontend


app.use(cors({
  origin: allowedOrigins,
  credentials: true // If using cookies/auth
}));
console.log("Allowed Origin:", allowedOrigins);


// ✅ Setup Socket.IO with CORS to allow frontend
const io = socketIo(server, {
  cors: {
    origin: allowedOrigins, // Replace with your frontend origin in production
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

const corsOptions = {
  origin: allowedOrigins, // must match your deployed frontend
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());


// const dns = require('dns');
// dns.setDefaultResultOrder('ipv4first');


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

const crudRoutes = require('./routes/crud');
app.use('/api/crud', crudRoutes);

const userRoute = require('./routes/user');
app.use('/api/user', userRoute);


const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


server.listen(PORT, () => console.log(`Server running on port ${PORT}`));


