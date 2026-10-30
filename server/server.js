const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// ---------- API ROUTES FIRST ----------
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.post('/api/chat', async (req, res) => {
  // ← keep your existing /api/chat handler exactly as-is
});

// ---------- SERVE VITE BUILD ----------
// Adjust this path to match YOUR repo layout (see note below)
const distPath = path.join(__dirname, '..', 'frontend', 'dist');

app.use(express.static(distPath));

// SPA fallback — MUST be last
app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'Not found' });
  }
  res.sendFile(path.join(distPath, 'index.html'));
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));