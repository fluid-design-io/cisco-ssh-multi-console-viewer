'use client';

import {
  Alert,
  AlertTitle,
  AppBar,
  Collapse,
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import Stack from '@mui/material/Stack';
import { Box } from '@mui/system';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import { useEffect, useRef, useState } from 'react';
import { DeviceCredential } from './DeviceCredential';
import { FormSchema } from './form-schema';
import { fromZodError, ValidationError } from 'zod-validation-error';
import { GreyButton } from '../lib/CustomButtons';
import { CommandField } from './CommandField';
import { useCollapsed } from '../lib/useStore';
import UnfoldLessIcon from '@mui/icons-material/UnfoldLess';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import AttachmentIcon from '@mui/icons-material/Attachment';
import { getCookie, setCookie } from 'cookies-next';
import { CommandResultType, ResultTable } from './ResultTable';

export default function Home() {
  const [numberOfDevices, setNumberOfDevices] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<ValidationError | null>(null);
  const [commands, setCommands] = useState('');
  const [commandResult, setCommandResult] = useState<CommandResultType>({});
  const { collapsed, toggleCollapsed, setCollapsed } = useCollapsed();
  const formRef = useRef<HTMLFormElement>(null);
  const submitButtonRef = useRef<HTMLButtonElement>(null);

  const handleKeyDown = (e: KeyboardEvent) => {
    if ((e.key === 'Enter' && e.ctrlKey) || (e.key === 'Enter' && e.metaKey)) {
      console.log('ctrl+enter');
      submitButtonRef.current?.click();
    }
  };

  const handleSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const fromData = new FormData(e.currentTarget);
    const data = Object.fromEntries(fromData.entries());
    const devices = [];
    for (let i = 0; i < numberOfDevices; i++) {
      const deviceEnabled = data[`device-${i}-enabled`];
      if (deviceEnabled === 'on') {
        devices.push({
          hostname: data[`device-${i}-ip`],
          username: data[`device-${i}-username`],
          password: data[`device-${i}-password`],
        });
      }
    }
    const body = {
      devices,
      commands: commands,
    };
    // validate form
    if (devices.length === 0) {
      return;
    }
    try {
      FormSchema.parse(body);
      setFormError(null);
    } catch (e: any) {
      const error = fromZodError(e);
      setFormError(error);
      return;
    }
    setCollapsed(true);
    setIsLoading(true);
    // send the data to localhost:8000
    try {
      const res = await fetch('http://localhost:8000/execute', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (res.ok) {
        const data = (await res.json()) as CommandResultType;
        // add the data to the existing commandResult
        const prev = commandResult;
        // merge the new data with the existing data
        const newResult = Object.keys(data).reduce((acc, key) => {
          if (prev[key]) {
            acc[key] = [...data[key], ...prev[key]];
          } else {
            acc[key] = data[key];
          }
          return acc;
        }, {} as CommandResultType);
        setCommandResult(newResult);
      } else {
        console.log('error');
      }
    } catch (e) {
      console.log(e);
    }
    setIsLoading(false);
  };

  // listen for keyboard command or ctrl+click when any element is focused
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    const cookie = getCookie('number_of_devices');
    if (cookie) {
      setNumberOfDevices(parseInt(cookie as string));
    }
  }, []);

  return (
    <Grid2 container spacing={2} maxWidth='100%' overflow='hidden' m={0} p={1}>
      {/* A Paper to hold a form element */}
      <Grid2
        component='form'
        p={0}
        xs={12}
        lg={collapsed ? 4 : 12}
        xl={collapsed ? 4 : 12}
        className='transition-all'
        ref={formRef}
        onSubmit={handleSubmitForm}
      >
        <Grid2>
          <Paper elevation={3} sx={{ p: 0, width: '100%', overflow: 'hidden' }}>
            <AppBar position='sticky' color='inherit' elevation={2}>
              <Toolbar variant='dense'>
                <KeyboardIcon />
                <Typography variant='h6' component='div' sx={{ flexGrow: 1, pl: 1 }}>
                  Form
                </Typography>
                <Tooltip title={collapsed ? 'Expand' : 'Collapse'}>
                  <IconButton
                    size='large'
                    edge='end'
                    color='inherit'
                    aria-label='collapse'
                    className='rotate-90'
                    onClick={toggleCollapsed}
                  >
                    {collapsed ? <UnfoldMoreIcon /> : <UnfoldLessIcon />}
                  </IconButton>
                </Tooltip>
              </Toolbar>
            </AppBar>
            <Box p={2}>
              <Collapse in={formError !== null}>
                <Alert severity='error' onClose={() => setFormError(null)}>
                  <AlertTitle>Error</AlertTitle>
                  {formError?.message}
                </Alert>
              </Collapse>
              <Stack spacing={2} mt={2}>
                <FormControl fullWidth>
                  <InputLabel id='number-of-devices-label' htmlFor='number-of-devices'>
                    Number of devices
                  </InputLabel>
                  <Select
                    id='number-of-devices'
                    label='Number of devices'
                    sx={{ width: '100%' }}
                    inputProps={{ name: 'number-of-devices', id: 'number-of-devices' }}
                    value={numberOfDevices}
                    onChange={(e) => {
                      setNumberOfDevices(Number(e.target.value));
                      setCookie('number_of_devices', e.target.value.toString());
                    }}
                  >
                    <MenuItem value='1'>1</MenuItem>
                    <MenuItem value='2'>2</MenuItem>
                    <MenuItem value='3'>3</MenuItem>
                    <MenuItem value='4'>4</MenuItem>
                    <MenuItem value='5'>5</MenuItem>
                  </Select>
                  <FormHelperText>Number of devices to configure</FormHelperText>
                </FormControl>
                <Grid2 container p={0}>
                  {
                    // Loop over the number of devices
                    Array.from(Array(numberOfDevices).keys()).map((i) => (
                      <DeviceCredential index={i} key={`device-credential-${i}`} />
                    ))
                  }
                </Grid2>
              </Stack>
            </Box>
          </Paper>
        </Grid2>
        <Grid2>
          <CommandField onCommandUpdate={(value) => setCommands(value)} />
          <GreyButton
            hidden
            aria-hidden
            className='absolute bottom-8 right-8 hidden'
            variant='contained'
            type='submit'
            ref={submitButtonRef}
          >
            Send
          </GreyButton>
        </Grid2>
      </Grid2>
      <Grid2 xs>
        <Paper sx={{ p: 0, width: '100%', overflow: 'hidden' }}>
          <AppBar position='static' color='inherit' elevation={2}>
            {isLoading && <LinearProgress />}
            <Toolbar variant='dense'>
              <AttachmentIcon />
              <Typography variant='h6' component='div' sx={{ flexGrow: 1, pl: 1 }}>
                Results
              </Typography>
            </Toolbar>
          </AppBar>
          <Box p={2}>
            {Object.keys(commandResult).length > 0 && <ResultTable result={commandResult} />}
            <FormHelperText>Results of the commands</FormHelperText>
          </Box>
        </Paper>
      </Grid2>
    </Grid2>
  );
}
