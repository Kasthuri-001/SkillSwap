import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../store';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'skillswap_jwt_secret_key_2026';

// Helper to generate JWT token
export function generateToken(userId: string) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
}

// Register
router.post('/register', (req: Request, res: Response) => {
  const { name, email, password, college, bio, skillsOffered, skillsWanted, availability } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  const existing = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(400).json({ error: 'Email already registered' });
  }

  const newUser = {
    id: 'usr_' + Date.now(),
    name,
    email,
    avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
    bio: bio || 'Excited to exchange skills on SkillSwap!',
    college: college || 'University Student',
    skillsOffered: skillsOffered || [],
    skillsWanted: skillsWanted || [],
    availability: availability || 'Flexible Schedule',
    skillPoints: 100, // Welcome bonus skill points
    rating: 5.0,
    ratingCount: 0,
    role: 'student' as const,
    status: 'active' as const,
    createdAt: new Date().toISOString()
  };

  db.users.push(newUser);
  const token = generateToken(newUser.id);

  res.json({
    token,
    user: newUser
  });
});

// Login
router.post('/login', (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or user not found' });
  }

  if (user.status === 'suspended') {
    return res.status(403).json({ error: 'Account has been suspended by administrator' });
  }

  const token = generateToken(user.id);
  res.json({ token, user });
});

// Get current user profile
router.get('/me', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const user = db.users.find(u => u.id === decoded.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user });
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Update Profile
router.put('/profile', (req: Request, res: Response) => {
  const { userId, name, bio, college, avatarUrl, skillsOffered, skillsWanted, availability } = req.body;

  const userIndex = db.users.findIndex(u => u.id === userId);
  if (userIndex === -1) return res.status(404).json({ error: 'User not found' });

  const current = db.users[userIndex];
  const updated = {
    ...current,
    name: name ?? current.name,
    bio: bio ?? current.bio,
    college: college ?? current.college,
    avatarUrl: avatarUrl ?? current.avatarUrl,
    skillsOffered: skillsOffered ?? current.skillsOffered,
    skillsWanted: skillsWanted ?? current.skillsWanted,
    availability: availability ?? current.availability
  };

  db.users[userIndex] = updated;

  // Sync skill listings avatar & name
  db.skills.forEach(s => {
    if (s.userId === userId) {
      s.userName = updated.name;
      s.userAvatar = updated.avatarUrl;
      s.userCollege = updated.college;
    }
  });

  res.json({ user: updated });
});

export default router;
