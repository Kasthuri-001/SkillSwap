import { Router, Request, Response } from 'express';
import { db } from '../store';

const router = Router();

// Get chat history for a request
router.get('/history/:requestId', (req: Request, res: Response) => {
  const messages = db.messages.filter(m => m.requestId === req.params.requestId);
  res.json({ messages });
});

// Get all chat threads for a user
router.get('/threads/:userId', (req: Request, res: Response) => {
  const userId = req.params.userId;
  const userRequests = db.requests.filter(r => r.requesterId === userId || r.providerId === userId);

  const threads = userRequests.map(req => {
    const isRequester = req.requesterId === userId;
    const partnerId = isRequester ? req.providerId : req.requesterId;
    const partnerName = isRequester ? req.providerName : req.requesterName;
    const partnerAvatar = isRequester ? req.providerAvatar : req.requesterAvatar;

    const reqMessages = db.messages.filter(m => m.requestId === req.id);
    const lastMessage = reqMessages[reqMessages.length - 1] || null;
    const unreadCount = reqMessages.filter(m => m.receiverId === userId && !m.read).length;

    return {
      request: req,
      partnerId,
      partnerName,
      partnerAvatar,
      lastMessage,
      unreadCount
    };
  });

  res.json({ threads });
});

// Send new message via HTTP REST (also broadcasted via WebSocket in server.ts)
router.post('/send', (req: Request, res: Response) => {
  const { requestId, senderId, senderName, receiverId, content, imageUrl } = req.body;

  if (!requestId || !senderId || (!content && !imageUrl)) {
    return res.status(400).json({ error: 'Missing chat message details' });
  }

  const newMessage = {
    id: 'msg_' + Date.now(),
    requestId,
    senderId,
    senderName,
    receiverId,
    content: content || '',
    imageUrl,
    read: false,
    timestamp: new Date().toISOString()
  };

  db.messages.push(newMessage);

  // Trigger chat notification
  db.notifications.unshift({
    id: 'notif_' + Date.now(),
    userId: receiverId,
    title: `Message from ${senderName}`,
    message: content ? (content.length > 40 ? content.slice(0, 40) + '...' : content) : 'Sent an image attachment',
    type: 'chat',
    read: false,
    createdAt: new Date().toISOString()
  });

  res.status(201).json({ message: newMessage });
});

// Mark messages as read
router.put('/read', (req: Request, res: Response) => {
  const { requestId, userId } = req.body;

  db.messages.forEach(m => {
    if (m.requestId === requestId && m.receiverId === userId) {
      m.read = true;
    }
  });

  res.json({ success: true });
});

export default router;
