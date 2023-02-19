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
} from '@mui/material';
import { QBVcommand, QBVconfig } from './page';
import LaptopIcon from '@mui/icons-material/Laptop';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useEffect } from 'react';
import { useQbvCollapsed } from 'lib/useStore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

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
export const IperfCommands = ({
  config,
  serverCommands,
  updateServerCommands,
  stationCommands,
  updateStationCommands,
}: {
  config: QBVconfig;
  serverCommands: QBVcommand[];
  updateServerCommands: (commands: QBVcommand[]) => void;
  stationCommands: QBVcommand[];
  updateStationCommands: (commands: QBVcommand[]) => void;
}) => {
  const { qbvCollapsedCommands, toggleQbvCollapsedCommands } = useQbvCollapsed();

  // populate default command if type exists and command is empty
  useEffect(() => {
    const newStationCommands = [...stationCommands];
    newStationCommands.forEach((command, index) => {
      if (command.type && !command.command) {
        // if type is BE, then use iperf -c eth -l 1500 -b 212M -t 15 -i 1 -p 5010
        if (command.type === 'BE') {
          newStationCommands[index].command = `iperf -c {{IP}} -l 1500 -b 212M -t 15 -i 1 -p 5010`; // replace {{IP}} based on config.options.direction
        }
        if (command.type === 'VI') {
          {
            newStationCommands[index].command = `iperf -c {{IP}} -l 128 -b 50pps -t 15 -i 1 -p 5020`; // replace {{IP}} based on config.options.direction
          }
        }
      }
    });
    updateStationCommands(newStationCommands);
  }, [stationCommands, config, updateStationCommands]);

  return (
    <Card sx={{ p: 0, overflow: 'hidden' }}>
      <AppBar elevation={1} position='static' color='transparent'>
        <Toolbar variant='dense'>
          <LaptopIcon />
          <Typography variant='h6' component='div' sx={{ flexGrow: 0, px: 1 }}>
            iPerf Commands
          </Typography>

          <Box sx={{ flexGrow: 1 }} />

          <IconButton onClick={toggleQbvCollapsedCommands}>
            {qbvCollapsedCommands ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Toolbar>
      </AppBar>
      <Collapse in={!qbvCollapsedCommands}>
        <Box sx={{ p: 2 }}>
          <Accordion elevation={4} defaultExpanded>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls='server-iperf-commands-content'
              id='server-iperf-commands'
            >
              <Typography>Server</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Stack spacing={2}>
                {serverCommands.map((command, index) => (
                  <Stack key={`qbv-server-command-${index}`} direction='row' spacing={2} alignItems='center'>
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
                    {
                      // add button only if last command
                      index === serverCommands.length - 1 && (
                        <IconButton
                          color='inherit'
                          aria-label='add'
                          onClick={() => {
                            const newCommands = [...serverCommands];
                            newCommands.push({ type: 'VO 5030', command: 'iperf -s 5030' });
                            updateServerCommands(newCommands);
                          }}
                        >
                          <AddIcon />
                        </IconButton>
                      )
                    }
                  </Stack>
                ))}
              </Stack>
            </AccordionDetails>
          </Accordion>
          <Accordion elevation={4} defaultExpanded>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls='station-iperf-commands-content'
              id='station-iperf-commands'
            >
              <Typography>Station</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Stack spacing={2}>
                <Typography variant='caption' sx={{ mb: 2 }}>
                  {`Using {{ IP }} will be replaced with the IP based on the direction of the test.`}
                </Typography>
                {stationCommands.map((command, index) => (
                  <Stack key={`qbv-station-command-${index}`} direction='row' spacing={2} alignItems='start'>
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
                      />
                      <FormHelperText>Preview: {getStationIperfCommand(config, command.command)}</FormHelperText>
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
                    {
                      // add button only if last command
                      index === stationCommands.length - 1 && (
                        <IconButton
                          color='inherit'
                          aria-label='add'
                          onClick={() => {
                            const newCommands = [...stationCommands];
                            newCommands.push({ type: 'VO', command: '' });
                            updateStationCommands(newCommands);
                          }}
                        >
                          <AddIcon />
                        </IconButton>
                      )
                    }
                  </Stack>
                ))}
              </Stack>
            </AccordionDetails>
          </Accordion>
        </Box>
      </Collapse>
    </Card>
  );
};
