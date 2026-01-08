import React, { createContext, useContext, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  TextField,
  Stack
} from '@mui/material';
import { PairingService } from '../services/PairingService.ts';

type DialogPayload = { title?: string; body?: React.ReactNode };

type DialogContextValue = {
  openDialog: (payload: DialogPayload) => void;
  closeDialog: () => void;
}

const DialogContext = createContext<DialogContextValue | undefined>(undefined);

export function useDialog() {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error('useDialog must be used within a DialogProvider');
  }
  return context;
}

export default function DialogProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [payload, setPayload] = useState<DialogPayload>({});
  const [robotId, setRobotId] = useState('');

  const handleOpen = (payload: DialogPayload) => {
    setPayload(payload);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handlePairing = (id: string) => {
    PairingService.pair(id);
    handleClose();
  }

  return (
    <DialogContext.Provider value={{ openDialog: handleOpen, closeDialog: handleClose }}>
      {children}
      <Dialog open={open} onClose={handleClose}>
        {payload.title && <DialogTitle>{payload.title}</DialogTitle>}
        <DialogContent>
          {payload.body && 
            <TextField id="robot-id-input" label="Robot ID" fullWidth variant="outlined" value={robotId} onChange={(e) => setRobotId(e.target.value)} />
          }
        </DialogContent>
        <Stack direction="row" spacing={2} sx={{ px: 2, justifyContent: 'right' }}>
          <DialogActions>
            <Button variant="contained" onClick={() => {
              handlePairing(robotId);
              handleClose();
            }}>Pair</Button>
          </DialogActions>
          <DialogActions>
            <Button onClick={handleClose}>Close</Button>
          </DialogActions>
        </Stack>
      </Dialog>
    </DialogContext.Provider>
  )
}