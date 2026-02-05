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

app.post('/command/runDialog', async (req, res) => {
  try {
    console.log('Received /command/runDialog request');
    let token: string = req.headers['x-pairing-token'] as string;
    const result = await backendService.runDialog(token, req.body.robot_id, req.body.dialog);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to run dialog' });
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