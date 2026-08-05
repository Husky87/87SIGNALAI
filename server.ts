import path from 'path';
import express from 'express';
import { createServer as createViteServer } from 'vite';
import { createApiApp } from './src/server/apiApp';

const PORT = 3000;

// ==========================================
// VITE MIDDLEWARE & STATIC SERVING
// ==========================================

async function startServer() {
  const app = createApiApp();

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Signal87 AI Full-Stack Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
