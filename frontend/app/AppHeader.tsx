'use client';

import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material';
import Link from 'next/link';
import { DarkModeToggle } from './DarkModeToggle';

const navItems = [
  {
    name: 'Home',
    href: '/',
  },
];

export const AppHeader = () => {
  return (
    <AppBar position='static'>
      <Toolbar>
        <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
          Cisco IOS Manager
        </Typography>

        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
          {navItems.map(({ name, href }) => (
            <Button key={`nav-${name}`} sx={{ color: '#fff' }} href={href} LinkComponent={Link}>
              {name}
            </Button>
          ))}
        </Box>
        <DarkModeToggle />
      </Toolbar>
    </AppBar>
  );
};
