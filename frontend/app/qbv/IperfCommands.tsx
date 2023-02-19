import {
  Card,
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Stack,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Collapse,
  FormHelperText,
  FormControl,
  Divider,
  InputAdornment,
} from '@mui/material';
import LaptopIcon from '@mui/icons-material/Laptop';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { memo, useEffect } from 'react';
import { useQbvCollapsed } from 'lib/useStore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { QBVcommand, QBVconfig } from 'lib/qbvDefaultConfig';

export const getStationIperfCommand = (config: QBVconfig, command: string) => {
  switch (config.options.direction) {
    case 'DL':
      return command.replace('{{IP}}', config.device_wifi.ip);
    case 'UL':
      return command.replace('{{IP}}', config.device_eth.ip);
    case 'ULDL':
      return 'not yet implemented';
  }
};
export const IperfCommands = memo(
  ({
    serverCommands,
    updateServerCommands,
    stationCommands,
    updateStationCommands,
  }: {
    serverCommands: QBVcommand[];
    updateServerCommands: (commands: QBVcommand[]) => void;
    stationCommands: QBVcommand[];
    updateStationCommands: (commands: QBVcommand[]) => void;
  }) => {
    return (
      <Box>
        <Toolbar sx={{ px: '0 !important', mt: -2 }}>
          <Typography variant='h6' flexGrow={1}>
            Server iPerf
          </Typography>
          <IconButton
            onClick={() => {
              const newCommands = [...serverCommands];
              newCommands.push({ type: 'VO 5030', command: 'iperf -s 5030' });
              updateServerCommands(newCommands);
            }}
            disabled={serverCommands.length > 0 && !serverCommands[serverCommands.length - 1].command}
          >
            <AddIcon />
          </IconButton>
        </Toolbar>
        <Stack spacing={2}>
          {serverCommands.map((command, index) => (
            <Stack
              key={`qbv-server-command-${index}`}
              direction='row'
              spacing={2}
              alignItems='center'
              justifyItems='center'
            >
              <TextField
                required
                id={`qbv-server-type-${index}`}
                name={`qbv-server-type-${index}`}
                label='Type'
                type='text'
                autoComplete='off'
                value={command.type}
                onChange={(e) => {
                  const newCommands = [...serverCommands];
                  newCommands[index].type = e.target.value;
                  updateServerCommands(newCommands);
                }}
              />
              <TextField
                required
                id={`qbv-server-command-${index}`}
                name={`qbv-server-command-${index}`}
                label={`${command.type} Command`}
                type='text'
                autoComplete='off'
                value={command.command}
                onChange={(e) => {
                  const newCommands = [...serverCommands];
                  newCommands[index].command = e.target.value;
                  updateServerCommands(newCommands);
                }}
                sx={{ flexGrow: 1 }}
              />

              <IconButton
                color='inherit'
                aria-label='delete'
                onClick={() => {
                  const newCommands = [...serverCommands];
                  newCommands.splice(index, 1);
                  updateServerCommands(newCommands);
                }}
                disabled={serverCommands.length === 1}
              >
                <DeleteIcon />
              </IconButton>
            </Stack>
          ))}
        </Stack>
        <Divider sx={{ mt: 2 }} />
        <Toolbar sx={{ px: '0 !important' }}>
          <Typography variant='h6' flexGrow={1}>
            Station iPerf
          </Typography>
          <IconButton
            onClick={() => {
              const newCommands = [...stationCommands];
              newCommands.push({ type: 'VO', command: '' });
              updateStationCommands(newCommands);
            }}
            // disable if the previous command is empty, if there is a previous command
            disabled={stationCommands.length > 0 && !stationCommands[stationCommands.length - 1].command}
          >
            <AddIcon />
          </IconButton>
        </Toolbar>
        <Stack spacing={2}>
          {/* <Typography variant='caption' sx={{ mb: 2 }}>
          {`Using {{ IP }} will be replaced with the IP based on the direction of the test.`}
        </Typography> */}
          {stationCommands.map((command, index) => (
            <Stack
              key={`qbv-station-command-${index}`}
              direction='row'
              spacing={2}
              alignItems='center'
              justifyItems='center'
            >
              <TextField
                required
                id={`qbv-station-type-${index}`}
                name={`qbv-station-type-${index}`}
                label='Type'
                type='text'
                autoComplete='off'
                value={command.type}
                onChange={(e) => {
                  const newCommands = [...stationCommands];
                  newCommands[index].type = e.target.value;
                  updateStationCommands(newCommands);
                }}
              />
              <FormControl sx={{ flexGrow: 1 }}>
                <TextField
                  required
                  id={`qbv-station-command-${index}`}
                  name={`qbv-station-command-${index}`}
                  label={`${command.type} Command`}
                  type='text'
                  autoComplete='off'
                  value={command.command}
                  onChange={(e) => {
                    const newCommands = [...stationCommands];
                    newCommands[index].command = e.target.value;
                    updateStationCommands(newCommands);
                  }}
                  // TODO: add preview of command
                  // InputProps={{
                  //   startAdornment: <InputAdornment position='start'>iperf -c {config.device_wifi.ip}</InputAdornment>,
                  // }}
                />
                {/* <FormHelperText>Preview: {getStationIperfCommand(config, command.command)}</FormHelperText> */}
              </FormControl>

              <IconButton
                color='inherit'
                aria-label='delete'
                onClick={() => {
                  const newCommands = [...stationCommands];
                  newCommands.splice(index, 1);
                  updateStationCommands(newCommands);
                }}
                disabled={stationCommands.length === 1}
              >
                <DeleteIcon />
              </IconButton>
            </Stack>
          ))}
        </Stack>
      </Box>
    );
  }
);

IperfCommands.displayName = 'IperfCommands';
