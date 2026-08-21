import { Router, Request, Response } from 'express';
import { db } from '../store';

const router = Router();

// Get reviews for a mentor
router.get('/mentor/:mentorId', (req: Request, res: Response) => {
  const reviews = db.reviews.filter(r => r.mentorId === req.params.mentorId);
  const mentor = db.users.find(u => u.id === req.params.mentorId);

  res.json({
    reviews,
    averageRating: mentor ? mentor.rating : 5.0,
    totalCount: reviews.length
  });
});

// Submit review for completed session
router.post('/', (req: Request, res: Response) => {
  const { mentorId, studentId, rating, feedback, skillTitle } = req.body;

  if (!mentorId || !studentId || !rating) {
    return res.status(400).json({ error: 'Missing required review fields' });
  }

  const student = db.users.find(u => u.id === studentId);
  const mentor = db.users.find(u => u.id === mentorId);

  if (!student || !mentor) {
    return res.status(404).json({ error: 'Student or Mentor not found' });
  }

  const newReview = {
    id: 'rev_' + Date.now(),
    mentorId,
    studentId,
    studentName: student.name,
    studentAvatar: student.avatarUrl,
    rating: Number(rating),
    feedback: feedback || 'Great learning experience!',
    skillTitle: skillTitle || 'SkillSwap Session',
    date: new Date().toISOString().split('T')[0]
  };

  db.reviews.unshift(newReview);

  // Recalculate mentor rating
  const mentorReviews = db.reviews.filter(r => r.mentorId === mentorId);
  const total = mentorReviews.reduce((sum, r) => sum + r.rating, 0);
  mentor.rating = Number((total / mentorReviews.length).toFixed(2));
  mentor.ratingCount = mentorReviews.length;

  // Sync skill listings for this mentor
  db.skills.forEach(s => {
    if (s.userId === mentorId) {
      s.userRating = mentor.rating;
    }
  });

  res.status(201).json({ review: newReview, updatedMentorRating: mentor.rating });
});

export default router;
