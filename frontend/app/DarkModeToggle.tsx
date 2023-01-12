'use client';

import { FormControlLabel, Switch } from '@mui/material';
import { darkTheme } from 'lib/themes';
import { useTheme } from 'lib/useTheme';

export const DarkModeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <FormControlLabel
      control={
        <Switch checked={theme === darkTheme} inputProps={{ 'aria-label': 'Dark Mode' }} onChange={toggleTheme} />
      }
      label='Dark Mode'
      labelPlacement='start'
    />
  );
};
