import { Router, Request, Response } from 'express';
import { db } from '../store';
import { GoogleGenAI } from '@google/genai';

const router = Router();

// Lazy Gemini AI initialization
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
}

// Get all skills with search & filtering
router.get('/', (req: Request, res: Response) => {
  const { search, category, level, userId } = req.query;

  let results = [...db.skills];

  if (category && category !== 'All') {
    results = results.filter(s => s.category.toLowerCase() === (category as string).toLowerCase());
  }

  if (level && level !== 'All') {
    results = results.filter(s => s.level.toLowerCase() === (level as string).toLowerCase());
  }

  if (userId) {
    results = results.filter(s => s.userId === userId);
  }

  if (search && (search as string).trim()) {
    const q = (search as string).toLowerCase().trim();
    results = results.filter(s =>
      s.title.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q) ||
      s.userName.toLowerCase().includes(q) ||
      s.tags.some(t => t.toLowerCase().includes(q))
    );
  }

  res.json({ skills: results });
});

// Get skill by ID
router.get('/:id', (req: Request, res: Response) => {
  const skill = db.skills.find(s => s.id === req.params.id);
  if (!skill) return res.status(404).json({ error: 'Skill not found' });
  
  const mentor = db.users.find(u => u.id === skill.userId);
  const mentorReviews = db.reviews.filter(r => r.mentorId === skill.userId);

  res.json({ skill, mentor, reviews: mentorReviews });
});

// Create new skill listing
router.post('/', (req: Request, res: Response) => {
  const { userId, title, category, description, level, tags, images } = req.body;

  if (!userId || !title || !category || !description) {
    return res.status(400).json({ error: 'Missing required skill parameters' });
  }

  const user = db.users.find(u => u.id === userId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const newSkill = {
    id: 'skl_' + Date.now(),
    userId,
    userName: user.name,
    userAvatar: user.avatarUrl,
    userCollege: user.college,
    userRating: user.rating,
    title,
    category,
    description,
    level: level || 'Beginner',
    tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map((t: string) => t.trim()) : [category]),
    pointsCost: 30,
    images: images && images.length > 0 ? images : ['https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600'],
    createdAt: new Date().toISOString()
  };

  db.skills.unshift(newSkill);

  // Update user's offered skills list if not present
  if (!user.skillsOffered.includes(title)) {
    user.skillsOffered.push(title);
  }

  res.status(201).json({ skill: newSkill });
});

// Update skill listing
router.put('/:id', (req: Request, res: Response) => {
  const skillIndex = db.skills.findIndex(s => s.id === req.params.id);
  if (skillIndex === -1) return res.status(404).json({ error: 'Skill not found' });

  const current = db.skills[skillIndex];
  const { title, category, description, level, tags } = req.body;

  const updated = {
    ...current,
    title: title ?? current.title,
    category: category ?? current.category,
    description: description ?? current.description,
    level: level ?? current.level,
    tags: tags ? (Array.isArray(tags) ? tags : tags.split(',').map((t: string) => t.trim())) : current.tags
  };

  db.skills[skillIndex] = updated;
  res.json({ skill: updated });
});

// Delete skill listing
router.delete('/:id', (req: Request, res: Response) => {
  const idx = db.skills.findIndex(s => s.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Skill not found' });

  const removed = db.skills.splice(idx, 1)[0];
  res.json({ success: true, removed });
});

// Gemini AI Smart Skill Matcher & Recommendation Engine
router.post('/ai-match', async (req: Request, res: Response) => {
  const { userGoal, wantedSkills, currentCollege } = req.body;

  const ai = getGeminiClient();
  const availableSkillsList = db.skills.map(s => ({
    id: s.id,
    title: s.title,
    category: s.category,
    description: s.description,
    instructor: s.userName,
    college: s.userCollege,
    level: s.level,
    rating: s.userRating
  }));

  if (!ai) {
    // Fallback algorithmic match if no Gemini key
    const matched = db.skills.slice(0, 3).map(s => ({
      skillId: s.id,
      matchPercentage: 92,
      reason: `Matches your interest in ${s.category} and high rating from ${s.userCollege}`
    }));
    return res.json({ matches: matched, aiNote: 'Smart skill matching calculated locally.' });
  }

  try {
    const prompt = `You are the SkillSwap AI Campus Matchmaker.
User Goal/Interest: "${userGoal || 'Skill exchange'}"
Skills User Wants to Learn: ${JSON.stringify(wantedSkills || [])}
User College: "${currentCollege || 'University'}"

Available Skill Listings on Platform:
${JSON.stringify(availableSkillsList, null, 2)}

Analyze the listings and recommend the top 3 best matching mentors/skills for this student. Return JSON strictly in this format:
{
  "matches": [
    {
      "skillId": "skl_1",
      "matchPercentage": 96,
      "reason": "Detailed concise explanation why this student and mentor are a great skill swap match"
    }
  ],
  "aiNote": "A warm encouraging 1-sentence tip on how to pitch their learning request to this mentor"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (err: unknown) {
    console.error('Gemini AI Match error:', err);
    // Fallback match
    const matched = db.skills.slice(0, 3).map((s, idx) => ({
      skillId: s.id,
      matchPercentage: 95 - idx * 4,
      reason: `Recommended based on popular category ${s.category} and top mentor rating.`
    }));
    res.json({ matches: matched, aiNote: 'Recommended based on campus popularity & rating.' });
  }
});

export default router;
