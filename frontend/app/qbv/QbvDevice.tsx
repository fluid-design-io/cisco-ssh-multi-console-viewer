import { Card, AppBar, Toolbar, Typography, Box, Tooltip, Switch, Stack, TextField } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2';
import { DeivceConfig, QBVconfig } from './page';

export const QbvDevice = ({
  type,
  device,
  updateDevice,
}: {
  type: string;
  device: DeivceConfig;
  updateDevice: (device: DeivceConfig) => void;
}) => {
  return (
    <Grid2 xs={12} md={6} lg={3}>
      <Card sx={{ p: 0, overflow: 'hidden' }}>
        <AppBar elevation={1} position='static' color='transparent'>
          <Toolbar variant='dense'>
            <Typography variant='h6' component='div' sx={{ flexGrow: 0, px: 1 }} className='uppercase'>
              {type}
            </Typography>

            <Box sx={{ flexGrow: 1 }} />
          </Toolbar>
        </AppBar>
        <Stack spacing={2} sx={{ p: 2 }}>
          <TextField
            required
            fullWidth
            id={`device_${type}_ip`}
            name={`device_${type}_ip`}
            label={`${type} ip`}
            type='text'
            autoComplete='off'
            value={device.ip}
            onChange={(e) => {
              updateDevice({ ...device, ip: e.target.value });
            }}
          />
          <TextField
            required
            fullWidth
            id={`device_${type}_username`}
            name={`device_${type}_username`}
            label={`${type} username`}
            type='text'
            autoComplete='off'
            value={device.username}
            onChange={(e) => {
              updateDevice({ ...device, username: e.target.value });
            }}
          />
          <TextField
            required
            fullWidth
            id={`device_${type}_password`}
            name={`device_${type}_password`}
            label={`${type} password`}
            type='password'
            autoComplete='off'
            value={device.password}
            onChange={(e) => {
              updateDevice({ ...device, password: e.target.value });
            }}
          />
        </Stack>
      </Card>
    </Grid2>
  );
};

export const QbvTFTPDevice = ({
  store,
  device,
  updateDevice,
  updateStore,
}: {
  store: QBVconfig['options']['store'];
  device: DeivceConfig;
  updateDevice: (device: DeivceConfig) => void;
  updateStore: (store: boolean) => void;
}) => {
  return (
    <Grid2 xs={12} md={6} lg={3}>
      <Card sx={{ p: 0, overflow: 'hidden' }}>
        <AppBar elevation={1} position='static' color='transparent'>
          <Toolbar variant='dense'>
            <Typography variant='h6' component='div' sx={{ flexGrow: 0, px: 1 }} className='uppercase'>
              TFTP
            </Typography>

            <Box sx={{ flexGrow: 1 }} />
            <Tooltip title={'Enable or disable device'} placement='top'>
              <Switch
                checked={store === 'tftp'}
                name={`device_tftp_store`}
                onChange={(e) => {
                  updateStore(e.target.checked);
                }}
              />
            </Tooltip>
          </Toolbar>
        </AppBar>
        <Stack spacing={2} sx={{ p: 2 }}>
          <TextField
            required
            fullWidth
            id={`device_tftp_ip`}
            name={`device_tftp_ip`}
            label={`tftp ip`}
            type='text'
            autoComplete='off'
            value={device.ip}
            onChange={(e) => {
              updateDevice({ ...device, ip: e.target.value });
            }}
          />
          <TextField
            required
            fullWidth
            id={`device_tftp_username`}
            name={`device_tftp_username`}
            label={`tftp username`}
            type='text'
            autoComplete='off'
            value={device.username}
            onChange={(e) => {
              updateDevice({ ...device, username: e.target.value });
            }}
          />
          <TextField
            required
            fullWidth
            id={`device_tftp_password`}
            name={`device_tftp_password`}
            label={`tftp password`}
            type='password'
            autoComplete='off'
            value={device.password}
            onChange={(e) => {
              updateDevice({ ...device, password: e.target.value });
            }}
          />
        </Stack>
      </Card>
    </Grid2>
  );
};
