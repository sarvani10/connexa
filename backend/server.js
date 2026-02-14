const jsonServer = require('json-server');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

// Add CORS middleware
server.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Use default middlewares
server.use(middlewares);
server.use(jsonServer.bodyParser);

// Custom routes
server.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // Mock users database
  const db = JSON.parse(fs.readFileSync('./db.json', 'utf8'));
  const users = db.users || [];
  const user = users.find(u => u.email === email && u.password === password);
  
  if (user) {
    res.status(200).json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        username: user.username
      },
      token: `mock-token-${user.id}-${Date.now()}`
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Invalid email or password'
    });
  }
});

server.post('/api/auth/signup', (req, res) => {
  const { email, password, fullName, username } = req.body;
  
  // Read current users
  const db = JSON.parse(fs.readFileSync('./db.json', 'utf8'));
  
  // Check if user already exists
  if (db.users && db.users.find(u => u.email === email)) {
    res.status(400).json({
      success: false,
      message: 'User with this email already exists'
    });
    return;
  }
  
  // Create new user
  const newUser = {
    id: uuidv4(),
    email,
    password,
    fullName,
    username,
    createdAt: new Date().toISOString(),
    isPrivate: false
  };
  
  // Add to users array
  if (!db.users) db.users = [];
  db.users.push(newUser);
  
  // Save to file
  fs.writeFileSync('./db.json', JSON.stringify(db, null, 2));
  
  res.status(201).json({
    success: true,
    user: {
      id: newUser.id,
      email: newUser.email,
      fullName: newUser.fullName,
      username: newUser.username
    },
    token: `mock-token-${newUser.id}-${Date.now()}`
  });
});

server.get('/api/posts', (req, res) => {
  const db = JSON.parse(fs.readFileSync('./db.json', 'utf8'));
  res.json(db.posts || []);
});

server.post('/api/posts', (req, res) => {
  const db = JSON.parse(fs.readFileSync('./db.json', 'utf8'));
  
  const newPost = {
    id: uuidv4(),
    authorId: req.body.authorId,
    content: req.body.content,
    mediaType: req.body.mediaType || 'text',
    mediaUrl: req.body.mediaUrl || '',
    createdAt: new Date().toISOString(),
    likesCount: 0,
    commentsCount: 0,
    isAnonymous: req.body.isAnonymous || false
  };
  
  if (!db.posts) db.posts = [];
  db.posts.unshift(newPost); // Add to beginning of array
  
  fs.writeFileSync('./db.json', JSON.stringify(db, null, 2));
  
  res.status(201).json(newPost);
});

server.delete('/api/posts/:id', (req, res) => {
  const db = JSON.parse(fs.readFileSync('./db.json', 'utf8'));
  const postId = req.params.id;
  
  if (db.posts) {
    db.posts = db.posts.filter(post => post.id !== postId);
    fs.writeFileSync('./db.json', JSON.stringify(db, null, 2));
  }
  
  res.status(200).json({ success: true });
});

// Use default router
server.use(router);

// Start server
server.listen(3001, () => {
  console.log('🚀 JSON Server is running on http://localhost:3001');
  console.log('📊 API Endpoints:');
  console.log('  POST /api/auth/login - User login');
  console.log('  POST /api/auth/signup - User registration');
  console.log('  GET  /api/posts - Get all posts');
  console.log('  POST /api/posts - Create new post');
  console.log('  DELETE /api/posts/:id - Delete post');
});
