import express from 'express';
import 'dotenv/config';
import { backendService } from './BackendService.ts';

const app = express();

app.use(express.json());

// status endpoint for health checks
app.get('/status', async (req, res) => {
  try {
    console.log('Received /status request');
    const result = await backendService.getStatus();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get status' });
  }
});

app.post('/command/speak', async (req, res) => {
  try {
    console.log('Received /command/speak request');
    const result = await backendService.speak(req.body.speech, req.body.style);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to send speak command' });
  }
});

app.post('/command/listenSilence', async (req, res) => {
  try {
    console.log('Received /command/listenSilence request');
    const result = await backendService.listenSilence(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to send listenSilence command' });
  }
});

app.post('/command/listenKeyword', async (req, res) => {
  try {
    console.log('Received /command/listenKeyword request');
    const result = await backendService.listenKeyword(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to send listenKeyword command' });
  }
});

app.listen(process.env.NODE_PORT, () => {
  console.log(`Backend API server is running on http://localhost:${process.env.NODE_PORT}`);
});