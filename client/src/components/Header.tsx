import {
  AppBar,
  Toolbar,
  Box,
  Button,
  Typography
} from '@mui/material';

type Props = {
  onClick?: () => void;
};

export default function Header({ onClick: onClick }: Props) {
  const handlePlayButtonClick = () => {
    if (onClick) onClick();
  };

  return (
    <AppBar position="static" color="transparent" elevation={0}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', px: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <img src="/favicon.ico" alt="logo" style={{ width: 36, height: 36 }} />
          <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
            ListenBot App
          </Typography>
        </Box>

        <Button variant="contained" color="primary" onClick={handlePlayButtonClick} sx={{ textTransform: 'none' }}>
          Play
        </Button>
      </Toolbar>
    </AppBar>
  );
}