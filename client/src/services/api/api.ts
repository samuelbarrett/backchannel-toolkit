import express from 'express';
import 'dotenv/config';
import { backendService } from './BackendService';

const app = express();

app.get('/status', async (req, res) => {
  try {
    const result = await backendService.getStatus();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get status' });
  }
});

app.listen(process.env.NODE_PORT, () => {
  console.log(`Backend API server is running on http://localhost:${process.env.NODE_PORT}`);
});