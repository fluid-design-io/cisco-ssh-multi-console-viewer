import { Box, TextField } from '@mui/material';
import { DeviceConnType } from 'lib/qbvDefaultConfig';

export const QbvDevice = ({
  type,
  device,
  updateDevice,
  inputProps,
}: {
  type: string;
  device: DeviceConnType;
  updateDevice: (device: DeviceConnType) => void;
  inputProps?: any;
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
        disabled={inputProps?.disabled}
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
        disabled={inputProps?.disabled}
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
        disabled={inputProps?.disabled}
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
        disabled={inputProps?.disabled}
      />
    </Box>
  );
};
