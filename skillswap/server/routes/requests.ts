import { Router, Request, Response } from 'express';
import { db } from '../store';

const router = Router();

// Get learning requests for a user (as requester or provider)
router.get('/', (req: Request, res: Response) => {
  const { userId, role, status } = req.query;

  let results = [...db.requests];

  if (userId) {
    if (role === 'provider') {
      results = results.filter(r => r.providerId === userId);
    } else if (role === 'requester') {
      results = results.filter(r => r.requesterId === userId);
    } else {
      results = results.filter(r => r.requesterId === userId || r.providerId === userId);
    }
  }

  if (status && status !== 'All') {
    results = results.filter(r => r.status === status);
  }

  res.json({ requests: results });
});

// Create new learning request
router.post('/', (req: Request, res: Response) => {
  const { requesterId, skillId, message, scheduledDate, scheduledTime } = req.body;

  if (!requesterId || !skillId) {
    return res.status(400).json({ error: 'Missing requesterId or skillId' });
  }

  const requester = db.users.find(u => u.id === requesterId);
  if (!requester) return res.status(404).json({ error: 'Requester not found' });

  const skill = db.skills.find(s => s.id === skillId);
  if (!skill) return res.status(404).json({ error: 'Skill not found' });

  if (requester.id === skill.userId) {
    return res.status(400).json({ error: 'Cannot request a learning session with yourself' });
  }

  // Check if student has enough points
  if (requester.skillPoints < 30) {
    return res.status(400).json({ error: 'You need at least 30 Skill Points to request a session. Teach a skill to earn points!' });
  }

  const newRequest = {
    id: 'req_' + Date.now(),
    requesterId: requester.id,
    requesterName: requester.name,
    requesterAvatar: requester.avatarUrl,
    providerId: skill.userId,
    providerName: skill.userName,
    providerAvatar: skill.userAvatar,
    skillId: skill.id,
    skillTitle: skill.title,
    message: message || `Hi ${skill.userName}, I would love to schedule a SkillSwap session to learn ${skill.title}!`,
    status: 'pending' as const,
    scheduledDate: scheduledDate || new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    scheduledTime: scheduledTime || '15:00',
    durationMinutes: 60,
    meetingUrl: `https://meet.jit.si/skillswap-${skill.id.slice(-4)}-${Date.now().toString().slice(-4)}`,
    pointsTransferred: 30,
    createdAt: new Date().toISOString()
  };

  db.requests.unshift(newRequest);

  // Notify Mentor
  db.notifications.unshift({
    id: 'notif_' + Date.now(),
    userId: skill.userId,
    title: 'New Skill Request Received! 🎓',
    message: `${requester.name} wants to learn ${skill.title} from you.`,
    type: 'request',
    read: false,
    createdAt: new Date().toISOString()
  });

  res.status(201).json({ request: newRequest });
});

// Update request status (accept / reject / cancel / mark completed)
router.put('/:id/status', (req: Request, res: Response) => {
  const { status, actionUserId } = req.body;
  const requestId = req.params.id;

  const request = db.requests.find(r => r.id === requestId);
  if (!request) return res.status(404).json({ error: 'Request not found' });

  const prevStatus = request.status;
  request.status = status;

  // Handle completion points awarding
  if (status === 'completed' && prevStatus !== 'completed') {
    const mentor = db.users.find(u => u.id === request.providerId);
    const learner = db.users.find(u => u.id === request.requesterId);

    if (mentor) mentor.skillPoints += 50; // Mentor earns +50 pts for teaching
    if (learner) learner.skillPoints = Math.max(0, learner.skillPoints - 30); // Learner spends 30 pts

    // Send notifications to both
    if (mentor) {
      db.notifications.unshift({
        id: 'notif_' + Date.now(),
        userId: mentor.id,
        title: 'Session Completed! 🎉 +50 PTS',
        message: `You earned 50 Skill Points for teaching ${request.skillTitle} to ${request.requesterName}!`,
        type: 'points',
        read: false,
        createdAt: new Date().toISOString()
      });
    }

    if (learner) {
      db.notifications.unshift({
        id: 'notif_' + Date.now() + 1,
        userId: learner.id,
        title: 'Session Completed! ⭐ Leave Review',
        message: `Your session with ${request.providerName} for ${request.skillTitle} is marked complete. Please rate your mentor!`,
        type: 'status',
        read: false,
        createdAt: new Date().toISOString()
      });
    }
  } else if (status === 'accepted') {
    db.notifications.unshift({
      id: 'notif_' + Date.now(),
      userId: request.requesterId,
      title: 'Learning Request Accepted! ✅',
      message: `${request.providerName} accepted your request for ${request.skillTitle}. Session scheduled for ${request.scheduledDate} at ${request.scheduledTime}.`,
      type: 'status',
      read: false,
      createdAt: new Date().toISOString()
    });
  } else if (status === 'rejected') {
    db.notifications.unshift({
      id: 'notif_' + Date.now(),
      userId: request.requesterId,
      title: 'Request Declined',
      message: `${request.providerName} was unable to accept your request for ${request.skillTitle}.`,
      type: 'status',
      read: false,
      createdAt: new Date().toISOString()
    });
  }

  res.json({ request });
});

// Reschedule session
router.put('/:id/reschedule', (req: Request, res: Response) => {
  const { scheduledDate, scheduledTime } = req.body;
  const request = db.requests.find(r => r.id === req.params.id);

  if (!request) return res.status(404).json({ error: 'Request not found' });

  request.scheduledDate = scheduledDate || request.scheduledDate;
  request.scheduledTime = scheduledTime || request.scheduledTime;

  res.json({ request });
});

export default router;
