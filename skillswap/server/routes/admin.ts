import { Router, Request, Response } from 'express';
import { db } from '../store';

const router = Router();

// Platform Analytics
router.get('/analytics', (_req: Request, res: Response) => {
  const analytics = db.getAnalytics();
  res.json({ analytics });
});

// Manage Users List
router.get('/users', (_req: Request, res: Response) => {
  res.json({ users: db.users });
});

// Update User Status (Suspend / Reactivate)
router.put('/users/:id/status', (req: Request, res: Response) => {
  const { status } = req.body;
  const user = db.users.find(u => u.id === req.params.id);

  if (!user) return res.status(404).json({ error: 'User not found' });

  user.status = status === 'suspended' ? 'suspended' : 'active';
  res.json({ user });
});

// Manage Skill Listings
router.get('/skills', (_req: Request, res: Response) => {
  res.json({ skills: db.skills });
});

// Remove Inappropriate Skill Listing
router.delete('/skills/:id', (req: Request, res: Response) => {
  const idx = db.skills.findIndex(s => s.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Skill listing not found' });

  const removed = db.skills.splice(idx, 1)[0];
  
  // Resolve any pending reports for this skill
  db.reports.forEach(r => {
    if (r.targetId === req.params.id) {
      r.status = 'resolved';
    }
  });

  res.json({ success: true, removed });
});

// View Complaints & Reports
router.get('/reports', (_req: Request, res: Response) => {
  res.json({ reports: db.reports });
});

// Report a skill or user
router.post('/reports', (req: Request, res: Response) => {
  const { reportedBy, reportedType, targetId, targetTitleOrName, reason } = req.body;

  const reporter = db.users.find(u => u.id === reportedBy);

  const newReport = {
    id: 'rep_' + Date.now(),
    reportedBy,
    reportedByName: reporter ? reporter.name : 'Anonymous Student',
    reportedType: reportedType || 'skill',
    targetId,
    targetTitleOrName: targetTitleOrName || 'Target Item',
    reason: reason || 'Inappropriate content',
    status: 'pending' as const,
    createdAt: new Date().toISOString()
  };

  db.reports.unshift(newReport);
  res.status(201).json({ report: newReport });
});

// Update Report Status
router.put('/reports/:id/status', (req: Request, res: Response) => {
  const { status } = req.body;
  const report = db.reports.find(r => r.id === req.params.id);

  if (!report) return res.status(404).json({ error: 'Report not found' });

  report.status = status;
  res.json({ report });
});

export default router;
