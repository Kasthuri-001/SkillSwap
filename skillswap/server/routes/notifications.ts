import { Router, Request, Response } from 'express';
import { db } from '../store';

const router = Router();

// Get notifications for user
router.get('/:userId', (req: Request, res: Response) => {
  const notifs = db.notifications.filter(n => n.userId === req.params.userId);
  res.json({ notifications: notifs });
});

// Mark all as read
router.put('/read-all/:userId', (req: Request, res: Response) => {
  db.notifications.forEach(n => {
    if (n.userId === req.params.userId) {
      n.read = true;
    }
  });
  res.json({ success: true });
});

export default router;
