import { AppBar, Box, Card, Stack, Switch, TextField, Toolbar, Tooltip, Typography } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import { useEffect, useRef, useState } from 'react';
import { useCollapsed } from '../lib/useStore';
import { IpAddressSchema } from './form-schema';
import { getCookies, setCookie } from 'cookies-next';
import LaptopIcon from '@mui/icons-material/Laptop';

export const DeviceCredential = ({ index }: { index: number }) => {
  const cookies = getCookies();
  const [ip, setIp] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [ipError, setIpError] = useState('');
  const [enabled, setEnabled] = useState(true);
  const { collapsed } = useCollapsed();
  const ipInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const ip = cookies[`device-${index}-ip`];
    const username = cookies[`device-${index}-username`];
    const password = cookies[`device-${index}-password`];
    if (ip) {
      setIp(ip);
    }
    if (username) {
      setUsername(username);
    }
    if (password) {
      setPassword(password);
    }
  }, []);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEnabled(event.target.checked);
  };
  return (
    <Grid2 xs={12} md={collapsed ? 4 : 12} lg={collapsed ? 12 : 4} xl={collapsed ? 12 : 3}>
      <Card sx={{ p: 0, overflow: 'hidden' }}>
        <AppBar elevation={1} position='static' color='transparent'>
          <Toolbar variant='dense'>
            <LaptopIcon />
            <Typography variant='h6' component='div' sx={{ flexGrow: 0, px: 1 }}>
              Device {index + 1}
            </Typography>

            <Box sx={{ flexGrow: 1 }} />

            <Tooltip title={`Device ${enabled ? 'enabled' : 'disabled'}`} placement='top'>
              <Switch
                checked={enabled}
                onChange={handleChange}
                inputProps={{ 'aria-label': 'controlled' }}
                name={`device-${index}-enabled`}
                id={`device-${index}-enabled`}
              />
            </Tooltip>
          </Toolbar>
        </AppBar>
        <Stack spacing={2} sx={{ p: 2 }}>
          <TextField
            required
            fullWidth
            id={`device-${index}-ip`}
            name={`device-${index}-ip`}
            label='IP Address'
            variant='outlined'
            autoFocus={index === 0}
            type='text'
            inputRef={ipInputRef}
            value={ip}
            onChange={(e) => {
              setIp(e.target.value);
            }}
            onBlur={() => {
              try {
                IpAddressSchema.parse(ip);
                setIpError('');
                setCookie(`device-${index}-ip`, ip);
              } catch (e: any) {
                const error = JSON.parse(e);
                setIpError(error[0]?.message);
              }
            }}
            error={!!ipError}
            helperText={ipError}
          />
          <TextField
            required
            fullWidth
            id={`device-${index}-username`}
            name={`device-${index}-username`}
            label='Username'
            variant='outlined'
            type='text'
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
            onBlur={() => setCookie(`device-${index}-username`, username)}
            autoComplete='off'
          />
          <TextField
            required
            fullWidth
            id={`device-${index}-password`}
            name={`device-${index}-password`}
            label='Password'
            variant='outlined'
            type='password'
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            onBlur={() => setCookie(`device-${index}-password`, password)}
            autoComplete='off'
          />
        </Stack>
      </Card>
    </Grid2>
  );
};
