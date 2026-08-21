import express from 'express';
import path from 'path';
import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import authRoutes from './server/routes/auth';
import skillsRoutes from './server/routes/skills';
import requestsRoutes from './server/routes/requests';
import chatRoutes from './server/routes/chat';
import reviewsRoutes from './server/routes/reviews';
import notificationsRoutes from './server/routes/notifications';
import adminRoutes from './server/routes/admin';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/skills', skillsRoutes);
  app.use('/api/requests', requestsRoutes);
  app.use('/api/chat', chatRoutes);
  app.use('/api/reviews', reviewsRoutes);
  app.use('/api/notifications', notificationsRoutes);
  app.use('/api/admin', adminRoutes);

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', service: 'SkillSwap Backend', timestamp: new Date().toISOString() });
  });

  const server = http.createServer(app);

  // Setup WebSocket Server for Real-Time Chat & Live Notifications
  const wss = new WebSocketServer({ server, path: '/ws' });

  const clients = new Map<WebSocket, string>(); // ws -> userId

  wss.on('connection', (ws) => {
    ws.on('message', (messageRaw) => {
      try {
        const data = JSON.parse(messageRaw.toString());

        if (data.type === 'auth') {
          clients.set(ws, data.userId);
          ws.send(JSON.stringify({ type: 'authenticated', userId: data.userId }));
        } else if (data.type === 'chat_message') {
          // Broadcast to target receiver if connected
          for (const [clientWs, clientUserId] of clients.entries()) {
            if (clientUserId === data.receiverId && clientWs.readyState === WebSocket.OPEN) {
              clientWs.send(JSON.stringify({
                type: 'new_chat_message',
                message: data.message
              }));
            }
          }
        }
      } catch (err) {
        console.error('WebSocket Error:', err);
      }
    });

    ws.on('close', () => {
      clients.delete(ws);
    });
  });

  // Vite middleware setup for development vs production
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`SkillSwap Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
