const jsonServer = require('json-server');
const express = require('express');

const server = jsonServer.create();
const router = jsonServer.router('src/db.json');
const middlewares = jsonServer.defaults({ static: '.' });


server.use(middlewares);
server.use(jsonServer.bodyParser); // ✅ REQUIRED

// Custom routes AFTER bodyParser

//server.use(express.json());
server.use(middlewares);

// GET endpoint to view all users (for testing/debugging)
server.get('/login', (req, res) => {
  const users = router.db.get('users').value() || [];
  res.json({ 
    message: 'Available users in the system',
    users: users.map(u => ({ 
      id: u.id, 
      email: u.email, 
      role: u.role 
    })),
    note: 'To login, make a POST request with email, password, and role'
  });
});

// GET endpoint to view all users data (for testing/debugging)
server.get('/register', (req, res) => {
  const users = router.db.get('users').value() || [];
  res.json({ 
    message: 'To register a new user, make a POST request with email, password, and role',
    totalUsers: users.length,
    users: users.map(u => ({ 
      id: u.id, 
      email: u.email, 
      role: u.role 
    }))
  });
});

// Mock login endpoint - BEFORE router
server.post('/login', (req, res) => {
  const { email, password, role } = req.body;
  console.log('Login attempt:', { email, password, role });
  
  if (!email || !password || !role) {
    return res.status(400).json({ message: 'Email, password, and role are required' });
  }
  
  // Find user in database
  const users = router.db.get('users').value() || [];
  console.log('Users in database:', users);
  const user = users.find(u => u.email === email && u.password === password && u.role === role);
  
  if (user) {
    const token = 'token-' + Date.now();
    res.json({ 
      accessToken: token,
      user: { 
        id: user.id, 
        email: user.email,
        role: user.role,
        permissions: getPermissionsByRole(user.role)
      }
    });
  } else {
    res.status(401).json({ message: 'Invalid credentials or role mismatch' });
  }
});

// Mock register endpoint - BEFORE router
server.post('/register', (req, res) => {
  const { email, password, role } = req.body;
  console.log('Register attempt:', { email, password, role });
  
  if (!email || !password || !role) {
    return res.status(400).json({ message: 'Email, password, and role are required' });
  }
  
  if (!['Admin', 'Employee'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role. Must be Admin or Employee' });
  }
  
  const users = router.db.get('users').value() || [];
  console.log('Current users:', users);
  
  // Check if user already exists
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ message: 'User already exists' });
  }
  
  // Add new user
  const newUser = {
    id: users.length + 1,
    email,
    password,
    role
  };
  users.push(newUser);
  
  // Save to database
  router.db.set('users', users).write();
  
  console.log('User registered successfully:', newUser);
  console.log('Database updated:', router.db.get('users').value());
  
  const token = 'token-' + Date.now();
  res.status(201).json({ 
    accessToken: token,
    user: { 
      id: newUser.id, 
      email: newUser.email,
      role: newUser.role,
      permissions: getPermissionsByRole(newUser.role)
    }
  });
});

// Function to return permissions based on role
function getPermissionsByRole(role) {
  const permissions = {
    Admin: [
      'view_all_tasks',
      'create_task',
      'edit_task',
      'delete_task',
      'assign_task',
      'view_all_users',
      'create_user',
      'edit_user',
      'delete_user',
      'view_reports',
      'manage_settings'
    ],
    Employee: [
      'view_own_tasks',
      'view_assigned_tasks',
      'update_task_status',
      'view_own_profile'
    ]
  };
  return permissions[role] || [];
}

// Register the json-server router AFTER custom routes so custom routes take precedence
server.use(router);

server.listen(3000, () => {
  console.log('JSON Server is running on http://localhost:3000');
  console.log('');
  console.log('GET  /login    - View all users (for testing)');
  console.log('GET  /register - View all users (for testing)');
  console.log('POST /login    - Login endpoint');
  console.log('POST /register - Register endpoint');
});
