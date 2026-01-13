import express from 'express';
import 'dotenv/config';
import { backendService } from './BackendService.ts';
import fs from 'node:fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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

app.post('/pair', async (req, res): Promise<void> => {
  try {
    console.log('Received /pair request');
    const response = await backendService.pair(req.body.robot_id);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: 'Failed to pair with robot' });
  }
});

app.post('/command/speak', async (req, res) => {
  try {
    console.log('Received /command/speak request');
    let token: string = req.headers['x-pairing-token'] as string;
    const result = await backendService.speak(token, req.body.robot_id, req.body.speech, req.body.style);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to send speak command' });
  }
});

app.post('/command/listenSilence', async (req, res) => {
  try {
    console.log('Received /command/listenSilence request');
    let token = req.headers['x-pairing-token'] as string;
    const result = await backendService.listenSilence(token, req.body.robot_id, req.body.style);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to send listenSilence command' });
  }
});

app.post('/command/listenKeywords', async (req, res) => {
  try {
    console.log('Received /command/listenKeywords request');
    let token = req.headers['x-pairing-token'] as string;
    const result = await backendService.listenKeyword(token, req.body.robot_id, req.body.keywords, req.body.style);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to send listenKeywords command' });
  }
});

app.post('/save', async (req, res) => {
  
  try {
    console.log('saving workspace for robot:', req.body.robotId);
    const workspaceData = req.body.workspace;
    const savePath = path.join(__dirname, '../../../savedWorkspaces/', `${req.body.robotId}_workspace.json`)
    const now = new Date();
    fs.appendFile(savePath, `\n${now.toLocaleString()} `, (err) => {})
    fs.appendFile(savePath, workspaceData, (err) => {
      if (err) {
        console.error('Error saving workspace:', err);
        res.status(500).json({ error: 'Failed to save program' });
      } else {
        res.status(200).json({ message: 'Workspace saved successfully' });
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save program' });
  }
});

app.listen(process.env.NODE_PORT, () => {
  console.log(`Backend API server is running on http://localhost:${process.env.NODE_PORT}`);
});