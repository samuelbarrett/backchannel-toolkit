import {
  AppBar,
  Toolbar,
  Box,
  Button,
  Typography,
  Stack,
  IconButton
} from '@mui/material';
import { Settings as SettingsIcon } from '@mui/icons-material';
import { runCode } from '../blockly/workspace.ts';
import { useDialog } from './DialogProvider.tsx';

export default function Header() {
  const { openDialog } = useDialog();

  const handlePlayButtonClick = () => {
    runCode();
  };

  const handleShowDialog = () => {
    openDialog({
      title: 'Pair with Robot',
      body: <Typography>Enter the Robot ID to pair with your robot.</Typography>,
    });
  }

  return (
    <AppBar position="static" color="transparent" elevation={0}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', px: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <img src="/favicon.ico" alt="logo" style={{ width: 36, height: 36 }} />
          <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
            ListenBot App
          </Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <Button variant="contained" color="primary" onClick={handlePlayButtonClick} sx={{ textTransform: 'none' }}>
            Play
          </Button>
          <div></div>
          <IconButton size="small" onClick={handleShowDialog}>
            <SettingsIcon />
          </IconButton> 
        </Stack>
      </Toolbar>
    </AppBar>
  );
}