import { AppBar, Box, Card, Stack, Switch, TextField, Toolbar, Tooltip, Typography } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import { useEffect, useRef, useState } from 'react';
import { useCollapsed } from 'lib/useStore';
import { IpAddressSchema } from '../../lib/form-schema';
import LaptopIcon from '@mui/icons-material/Laptop';
import { EditableElement } from 'lib/EditableElement';

export const DeviceCredential = ({ index }: { index: number }) => {
  const [ipError, setIpError] = useState('');
  const [deviceInfo, setDeviceInfo] = useState({
    ip: '',
    username: '',
    password: '',
    enabled: true,
    deviceTitle: '',
  });
  const { collapsed } = useCollapsed();
  const ipInputRef = useRef<HTMLInputElement>(null);

  // convert setCookie to localStorage and make all variables into one object
  // then use a useEffect to set the values from localStorage

  type DeviceInfo = typeof deviceInfo;

  const setDeviceInfoToStorage = (deviceInfo: DeviceInfo) => {
    setDeviceInfo(deviceInfo);
    localStorage.setItem(`device-info-${index}`, JSON.stringify(deviceInfo));
  };

  const getDeviceInfo = () => {
    const deviceInfo = localStorage.getItem(`device-info-${index}`);
    if (deviceInfo) {
      return JSON.parse(deviceInfo);
    }
    return null;
  };
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDeviceInfoToStorage({ ...deviceInfo, enabled: event.target.checked });
  };
  const handleChangeDeviceTitle = (title: string) => {
    if (title !== `Device ${index + 1}`) {
      setDeviceInfoToStorage({ ...deviceInfo, deviceTitle: title });
    }
  };

  useEffect(() => {
    const deviceInfo = getDeviceInfo();
    if (deviceInfo) {
      setDeviceInfo(deviceInfo);
    }
  }, []);

  return (
    <Grid2 xs={12} md={collapsed ? 4 : 12} lg={collapsed ? 12 : 4} xl={collapsed ? 6 : 2}>
      <Card sx={{ p: 0, overflow: 'hidden' }}>
        <AppBar elevation={1} position='static' color='transparent'>
          <Toolbar variant='dense'>
            <LaptopIcon />
            <Typography variant='h6' component='div' sx={{ flexGrow: 0, px: 1 }}>
              <EditableElement onChange={handleChangeDeviceTitle}>
                <div style={{ outline: 'none' }} key={`edit-title-${index}`}>
                  {deviceInfo.deviceTitle || `Device ${index + 1}`}
                </div>
              </EditableElement>
            </Typography>

            <Box sx={{ flexGrow: 1 }} />

            <Tooltip title={`Device ${deviceInfo.enabled ? 'enabled' : 'disabled'}`} placement='top'>
              <Switch
                checked={deviceInfo.enabled}
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
            value={deviceInfo.ip}
            onChange={(e) => {
              setDeviceInfoToStorage({ ...deviceInfo, ip: e.target.value });
            }}
            onBlur={(e) => {
              try {
                IpAddressSchema.parse(e.target.value);
                setIpError('');
              } catch (e: any) {
                const error = JSON.parse(e);
                setIpError(error.errors[0]);
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
            value={deviceInfo.username}
            onChange={(e) => {
              setDeviceInfoToStorage({ ...deviceInfo, username: e.target.value });
            }}
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
            value={deviceInfo.password}
            onChange={(e) => {
              setDeviceInfoToStorage({ ...deviceInfo, password: e.target.value });
            }}
            autoComplete='off'
          />
        </Stack>
      </Card>
    </Grid2>
  );
};
