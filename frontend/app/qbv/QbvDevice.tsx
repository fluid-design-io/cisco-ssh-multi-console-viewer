import { Card, AppBar, Toolbar, Typography, Box, Tooltip, Switch, Stack, TextField } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2';
import { DeviceConnType } from 'lib/qbvDefaultConfig';

export const QbvDevice = ({
  type,
  device,
  updateDevice,
}: {
  type: string;
  device: DeviceConnType;
  updateDevice: (device: DeviceConnType) => void;
}) => {
  return (
    <Box className='grid grid-cols-2 gap-2 xl:grid-cols-4 mt-4'>
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
      <TextField
        required
        fullWidth
        id={`device_${type}_sudo_password`}
        name={`device_${type}_sudo_password`}
        label={`${type} sudo password`}
        type='password'
        autoComplete='off'
        value={device.sudo_password}
        onChange={(e) => {
          updateDevice({ ...device, sudo_password: e.target.value });
        }}
      />
    </Box>
  );
};
