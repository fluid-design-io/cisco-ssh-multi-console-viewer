'use client';

import { AppBar, Toolbar, Typography } from '@mui/material';
import { DarkModeToggle } from './DarkModeToggle';

export const AppHeader = () => {
  return (
    <AppBar position='static'>
      <Toolbar>
        <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
          Cisco IOS Manager
        </Typography>
        <DarkModeToggle />
      </Toolbar>
    </AppBar>
  );
};
