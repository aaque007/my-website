require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');

// Initialize app and socket.io
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Atlas Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  ssl: true // Required for Atlas
})
.then(() => console.log('MongoDB Atlas connected successfully!'))
.catch(err => console.error('MongoDB connection error:', err));

// User Model
const User = mongoose.model('User', new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String, default: '' },
  lastLogin: { type: Date, default: Date.now }
}));

// Diagram Model
const Diagram = mongoose.model('Diagram', new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['Class', 'Sequence', 'Flowchart', 'ER', 'Use Case', 'Activity'], default: 'Class' },
  content: { type: String, default: '' },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  collaborators: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  lastModified: { type: Date, default: Date.now }
}));

// Auth Middleware
const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) throw new Error('No token provided');

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: 'Not authorized' });
  }
};

// Socket.IO Authentication
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error('Authentication error'));

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded;
    next();
  } catch (err) {
    next(new Error('Invalid token'));
  }
});

// Real-time Collaboration
io.on('connection', (socket) => {
  socket.on('join_diagram', (diagramId) => {
    socket.join(`diagram_${diagramId}`);
    socket.to(`diagram_${diagramId}`).emit('user_joined', socket.user);
  });

  socket.on('diagram_update', (data) => {
    socket.to(`diagram_${data.diagramId}`).emit('remote_update', data);
  });
});

// Routes
// Register User
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please fill all fields' });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      avatar: `https://i.pravatar.cc/150?u=${email}`
    });

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Login User
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

    // Update last login
    user.lastLogin = Date.now();
    await user.save();

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get User Diagrams
app.get('/api/diagrams', auth, async (req, res) => {
  try {
    const diagrams = await Diagram.find({
      $or: [
        { owner: req.user._id },
        { collaborators: req.user._id }
      ]
    }).sort('-lastModified').populate('owner', 'name email avatar');

    res.json({ success: true, diagrams });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Create New Diagram
app.post('/api/diagrams', auth, async (req, res) => {
  try {
    const { name, type } = req.body;

    const diagram = await Diagram.create({
      name,
      type,
      owner: req.user._id,
      collaborators: [req.user._id]
    });

    res.status(201).json({ success: true, diagram });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update Diagram
app.put('/api/diagrams/:id', auth, async (req, res) => {
  try {
    const { content } = req.body;
    const diagram = await Diagram.findById(req.params.id);

    if (!diagram) {
      return res.status(404).json({ success: false, message: 'Diagram not found' });
    }

    // Check permissions
    if (!diagram.owner.equals(req.user._id) && 
        !diagram.collaborators.some(c => c.equals(req.user._id))) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    // Update diagram
    diagram.content = content;
    diagram.lastModified = Date.now();
    await diagram.save();

    // Broadcast update to all collaborators
    io.to(`diagram_${diagram._id}`).emit('diagram_update', {
      diagramId: diagram._id,
      content: diagram.content,
      lastModified: diagram.lastModified
    });

    res.json({ success: true, diagram });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});