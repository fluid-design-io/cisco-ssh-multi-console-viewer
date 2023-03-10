import { LoadingButton } from '@mui/lab';
import {
  Box,
  TextField,
  MenuItem,
  InputAdornment,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Stack,
  Typography,
  Collapse,
  Divider,
  Toolbar,
  IconButton,
  Alert,
} from '@mui/material';
import { getHexTime, splitHexIntoHighAndLow } from 'lib/getHexTime';
import { ApConnType, defaultApConfig, QbvApConfig } from 'lib/qbvDefaultConfig';
import { useQbvSteps } from 'lib/useStore';
import { Dispatch, memo, SetStateAction, useEffect, useState } from 'react';
import { GateCycleDoc } from './GateCycleDoc';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

const inputProps = [
  {
    name: 'radioId',
    label: 'radio_id',
    type: 'select',
    options: [
      { value: 0, label: '5 GHz' },
      { value: 1, label: '2.4 GHz' },
    ],
  },
  {
    name: 'enable',
    label: 'slot_id enable',
    type: 'select',
    options: [
      { value: 0, label: 'Disable' },
      { value: 1, label: 'Enable' },
    ],
  },
  { name: 'epochId', label: 'epoch_id', type: 'number' },
  {
    name: 'utcStartTimeLoUs',
    label: 'utc_start_time_lo_us',
    type: 'text',

    InputProps: {
      //   startAdornment: <InputAdornment position='start'>0x</InputAdornment>,
      readOnly: true,
    },
  },
  {
    name: 'utcStartTimeHiUs',
    label: 'utc_start_time_hi_us',
    type: 'text',

    InputProps: {
      //   startAdornment: <InputAdornment position='start'>0x</InputAdornment>,
      readOnly: true,
    },
  },
  {
    name: 'guardIntervalUs',
    label: 'nothing_duration_us',
    type: 'number',
    InputProps: {
      endAdornment: <InputAdornment position='end'>μs</InputAdornment>,
    },
    inputProps: {
      min: 0,
    },
  },
  {
    name: 'tsnAc',
    label: 'tsn_ac',
    type: 'number',
    inputProps: {
      max: 3,
      min: 0,
    },
  },
  {
    name: 'tsnDurationUs',
    label: 'tsn_duration_us',
    type: 'number',
    InputProps: {
      endAdornment: <InputAdornment position='end'>μs</InputAdornment>,
    },
    inputProps: {
      min: 0,
    },
  },
  {
    name: 'tsnUlOffsetUs',
    label: 'tsn_ul_offset_us',
    type: 'number',
    InputProps: {
      endAdornment: <InputAdornment position='end'>μs</InputAdornment>,
    },
    inputProps: {
      min: 0,
    },
  },
  {
    name: 'tsnDlOffsetUs',
    label: 'tsn_dl_offset_us',
    type: 'number',
    InputProps: {
      endAdornment: <InputAdornment position='end'>μs</InputAdornment>,
    },
    inputProps: {
      min: 0,
    },
  },
  {
    name: 'tsnUlDlOffsetUs',
    label: 'tsn_ul_dl_offset_us',
    type: 'number',
    InputProps: {
      endAdornment: <InputAdornment position='end'>μs</InputAdornment>,
    },
    inputProps: {
      min: 0,
    },
  },
  {
    name: 'epochDurationUs',
    label: 'epoch_duration_us',
    type: 'number',
    InputProps: {
      endAdornment: <InputAdornment position='end'>μs</InputAdornment>,
    },
    inputProps: {
      min: 0,
    },
  },
];

type qbvApDispatchAction = {
  type: 'SET_UTC_TIME' | 'SET_INPUT' | 'ADD_AP_CONFIG' | 'REMOVE_AP_CONFIG';
  payload: number | string | Record<string, any>;
};

const apPreconfigurationCommands = `wifitool apr1v1 setUnitTestCmd 0x47 4 170 0 0 2000
wifitool apr1v1 setUnitTestCmd 0x47 4 170 0 1 2000
wifitool apr1v1 setUnitTestCmd 0x47 4 170 0 2 2000
wifitool apr1v1 setUnitTestCmd 0x47 4 170 0 3 2000
wifitool apr1v1 setUnitTestCmd 0x47 3 267 0 1
wifitool apr1v1 setUnitTestCmd 0x47 3 267 1 1
wifitool apr1v1 setUnitTestCmd 0x47 3 267 2 1
wifitool apr1v1 setUnitTestCmd 0x47 3 267 3 1

cd /sys/kernel/debug/aquantia-phy-0
echo "0 0x3c600 0x200" > phy-write-reg
echo "0 0x3c600 0x300" > phy-write-reg

ptp4l -f /storage/ptp4l.conf -i wired0 &
phc2sys -s wired0 -w &
tail -f /var/log/messages

iwpriv wifi1 set_utc_info 16
`;

export const qbvApConfigReducer = (state: QbvApConfig[], action: qbvApDispatchAction) => {
  switch (action.type) {
    case 'SET_UTC_TIME':
      if (typeof action.payload === 'string' || typeof action.payload === 'number') {
        return state;
      }
      const { hexTime, offset } = action.payload;
      const { utc_high, utc_low } = splitHexIntoHighAndLow(hexTime, offset);
      const utcStartTimeHiUs = '0x' + utc_high.toString(16);
      const utcStartTimeLoUs = '0x' + utc_low.toString(16);
      return state.map((apConfig) => ({
        ...apConfig,
        utcStartTimeHiUs,
        utcStartTimeLoUs,
      }));
    case 'SET_INPUT':
      if (typeof action.payload === 'string' || typeof action.payload === 'number') {
        return state;
      }
      const { name, value, index } = action.payload;
      return state.map((apConfig, i) => {
        if (i === index) {
          return {
            ...apConfig,
            [name]: value,
          };
        }
        return apConfig;
      });
    case 'ADD_AP_CONFIG':
      return [...state, defaultApConfig];
    case 'REMOVE_AP_CONFIG':
      if (typeof action.payload === 'number') {
        const indexToRemove = action.payload;
        return state.filter((apConfig, i) => i !== indexToRemove);
      } else {
        return state;
      }
    default:
      return state;
  }
};

export const ApQbvSettings = memo(
  ({
    spline,
    qbvApConfig,
    apConnection,
    dispatchQbvApConfig,
    setApConnection,
    updateData,
    setErrorText,
  }: {
    spline: any;
    qbvApConfig: QbvApConfig[];
    apConnection: ApConnType;
    setApConnection: Dispatch<SetStateAction<ApConnType>>;
    dispatchQbvApConfig: Dispatch<{
      type: string;
      payload: any;
    }>;
    updateData: (data: any) => void;
    setErrorText: (text: string) => void;
  }) => {
    const { isStarted, qbvSteps, handleStep, handleStartApCommands, handleStopApCommands } = useQbvSteps();

    const currentStep = qbvSteps.findIndex((step) => step.isCurrent);
    const [currentTime, setCurrentTime] = useState(Date.now());
    const [isActivePreConfig, setIsActivePreConfig] = useState(false);
    const [isSendingApCommands, setIsSendingApCommands] = useState(false);
    const [qbvUtcOffset, setQbvUtcOffset] = useState(5);
    const [apHexTime, setApHexTime] = useState(undefined); // test 5F4CB19C5B3E4
    const [isGettingApTime, setIsGettingApTime] = useState(false);
    const [error, setError] = useState('');
    const isActiveStep = currentStep === 0;
    const qbvApValues = qbvApConfig.map((config) => Object.values(config).join(' ').trim());
    const handleChangeQbv = (event, index) => {
      const { name, value } = event.target;
      dispatchQbvApConfig({
        type: 'SET_INPUT',
        payload: { name, value, index },
      });
    };
    const handleApConnChange = (event) => {
      const { name, value } = event.target;
      setApConnection((prevState) => ({ ...prevState, [name]: value }));
    };
    const handlePreConfig = async () => {
      setIsActivePreConfig(true);
    };
    const handleQbvUtcOffsetChange = (event) => {
      const { value } = event.target;
      setQbvUtcOffset(value);
    };

    const getApTime = async () => {
      setIsGettingApTime(true);
      setError('');
      const body = JSON.stringify(apConnection);
      try {
        const response = await fetch('http://localhost:8000/qbv-ap-time', {
          method: 'POST',
          body,
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        if (!data) {
          throw new Error('No data');
        }
        if (data.data) {
          // "5F4CB19C5B3E4" -> 5F4CB19C5B3E4
          const value = data.data.replace(/"/g, '');
          if (value.includes('File not found')) {
            throw new Error('File not found');
          }
          const hexTime = value.trim();
          setApHexTime(hexTime);
          setCurrentTime(Date.now());
        }
      } catch (error) {
        console.log(error);
        setError(error.message);
      }
      setTimeout(() => {
        setIsGettingApTime(false);
        spline.current?.emitEvent('mouseDown', 'AP LED On Toggle');
      }, 1000);
    };

    const handleApPreConfig = async () => {
      setIsActivePreConfig(true);
      const body = JSON.stringify(apConnection);
      try {
        const response = await fetch('http://localhost:8000/qbv-ap-pre-config', {
          method: 'POST',
          body,
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        if (!data) {
          throw new Error('No data');
        }
        console.log(data);
      } catch (error) {
        console.log(error);
      }
      setTimeout(() => {
        setIsActivePreConfig(false);
      }, 1000);
    };

    const handleSendApCommands = async () => {
      handleStartApCommands();
      setIsSendingApCommands(true);
      const ap_commands = qbvApValues.map((value) => 'wifitool apr1v0 setUnitTestCmd 0x47 13 402' + value);
      const body = JSON.stringify({
        ap_connection: apConnection,
        ap_commands,
      });
      for (let index = 0; index < ap_commands.length; index++) {
        const element = ap_commands[index];
        updateData(`Sending command ${index + 1} of ${ap_commands.length}: ${element}`);
      }
      try {
        const response = await fetch('http://localhost:8000/qbv-ap-commands', {
          method: 'POST',
          body,
          headers: {
            'Content-Type': 'application/json',
          },
        });
        // jsonfy the response
        const data = await response.json();
        if (!data) {
          throw new Error('No data');
        }
        updateData(data);
      } catch (error) {
        console.log(error);
      }
      setTimeout(() => {
        setIsSendingApCommands(false);
        handleStopApCommands();
      }, 1000);
    };

    // start the 1 second interval when getApTime is called
    useEffect(() => {
      if (apHexTime) {
        const interval = setInterval(() => {
          const hexTime = getHexTime(apHexTime, currentTime);
          dispatchQbvApConfig({
            type: 'SET_UTC_TIME',
            payload: { hexTime, offset: qbvUtcOffset },
          });
        }, 1000);
        return () => clearInterval(interval);
      }
    }, [apHexTime]);

    return (
      <Accordion
        elevation={4}
        defaultExpanded
        TransitionProps={{ unmountOnExit: true }}
        expanded={isActiveStep}
        onClick={() => handleStep(0)}
      >
        <AccordionSummary aria-controls='qbv-ap-accordion' id='qbv-ap-accordion'>
          <Stack flexGrow={1} spacing={0}>
            <Typography>AP QBV</Typography>
            <Collapse in={!isActiveStep}>
              <Typography variant='caption' className='tabular-nums whitespace-pre-wrap'>
                {qbvApValues.map((value) => 'wifitool apr1v0 setUnitTestCmd 0x47 13 402' + value + '\n')}
              </Typography>
            </Collapse>
          </Stack>
          {!apHexTime && !isActiveStep && (
            <Typography variant='caption' color='error' className='flex-shrink-0'>
              Not synced
            </Typography>
          )}
          <Collapse in={isActiveStep} className={isActiveStep ? 'flex-shrink-0' : 'hidden'}>
            <LoadingButton
              onClick={getApTime}
              variant={apHexTime ? 'outlined' : 'contained'}
              color={apHexTime ? 'primary' : 'success'}
              loading={isGettingApTime}
            >
              Get AP Time
            </LoadingButton>
          </Collapse>
        </AccordionSummary>
        <AccordionDetails>
          <Toolbar sx={{ px: '0 !important' }}>
            <Typography variant='h6' flexGrow={1}>
              Pre Configuration (In development)
            </Typography>
            <LoadingButton
              variant='outlined'
              className='flex-shrink-0'
              onClick={handlePreConfig}
              loading={isActivePreConfig}
              disabled={true}
            >
              Start
            </LoadingButton>
          </Toolbar>
          <Box className='mb-4'>
            <Typography variant='body2' gutterBottom>
              Use this when the AP is restarted, you do not need to run this every time you run the test.
            </Typography>
            <Collapse in={isActivePreConfig}>
              <Typography variant='body2' gutterBottom>
                The following commands will be sent to the AP
              </Typography>
              <Typography variant='caption' component='pre' gutterBottom>
                {apPreconfigurationCommands}
              </Typography>
            </Collapse>
          </Box>
          <Divider sx={{ mb: 1 }} />
          <Typography variant='h6' gutterBottom>
            AP Connection
          </Typography>
          <Collapse in={error !== ''}>
            <Alert severity='error' sx={{ mb: 2 }}>
              {error}
            </Alert>
          </Collapse>

          <Box className='grid grid-cols-2 gap-2 mt-4'>
            {Object.keys(apConnection).map((key) => (
              <TextField
                key={key}
                name={key}
                label={key}
                type={key === 'password' || key === 'enable_password' ? 'password' : key === 'ip' ? 'url' : 'text'}
                value={apConnection[key]}
                onChange={handleApConnChange}
                variant='outlined'
                style={{ marginBottom: 16 }}
                id={key}
              />
            ))}
          </Box>
          <Divider sx={{ mb: 1 }} />
          <Toolbar sx={{ px: '0 !important' }}>
            <Typography variant='h6' flexGrow={1}>
              QBV Settings
            </Typography>
            <IconButton onClick={() => dispatchQbvApConfig({ type: 'ADD_AP_CONFIG', payload: null })}>
              <AddIcon />
            </IconButton>
          </Toolbar>
          <Box>
            <Box>
              <TextField
                name='qbvUtcOffset'
                label='Qbv UTC offset'
                type='number'
                value={qbvUtcOffset}
                onChange={handleQbvUtcOffsetChange}
                variant='outlined'
                id='qbvUtcOffset'
                fullWidth
                helperText='The offset in seconds from UTC time received from AP so the start-time is always in the future'
                inputProps={{ min: 0, max: 86400 }}
                InputProps={{
                  endAdornment: <InputAdornment position='end'>seconds</InputAdornment>,
                }}
              />
            </Box>
          </Box>
          <Box>
            {qbvApConfig.map((config, index) => (
              <Box key={`qbv-ap-config-${index}`}>
                <Toolbar sx={{ px: '0 !important' }}>
                  <Typography variant='body1' flexGrow={1}>
                    QBV Settings {index + 1}
                  </Typography>
                  {qbvApConfig.length > 1 && (
                    <IconButton onClick={() => dispatchQbvApConfig({ type: 'REMOVE_AP_CONFIG', payload: index })}>
                      <DeleteIcon />
                    </IconButton>
                  )}
                </Toolbar>
                <Box className='grid grid-cols-2 lg:grid-cols-3 gap-2 xl:grid-cols-4 mt-4'>
                  {inputProps.map((input) =>
                    input.type === 'select' ? (
                      <TextField
                        select
                        key={`${input.name}-${index}`}
                        name={input.name}
                        // use regex to replace '_' with ' '
                        label={input.label.replace(/_/g, ' ').toUpperCase()}
                        value={qbvApConfig[index][input.name]}
                        onChange={(event) => handleChangeQbv(event, index)}
                        variant='outlined'
                        style={{ marginBottom: 16 }}
                        id={input.name}
                        disabled={isStarted} // disable when started
                      >
                        {input.options.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    ) : (
                      <TextField
                        key={`${input.name}-${index}`}
                        name={`${input.name}`}
                        label={input.label.replace(/_/g, ' ').toUpperCase()}
                        type={input.type}
                        value={qbvApConfig[index][input.name]}
                        onChange={(event) => handleChangeQbv(event, index)}
                        variant='outlined'
                        style={{ marginBottom: 16 }}
                        id={input.name}
                        disabled={isStarted}
                        InputProps={input?.InputProps || {}}
                        inputProps={input?.inputProps || {}}
                      />
                    )
                  )}
                </Box>
              </Box>
            ))}
          </Box>
          <Divider sx={{ mb: 1 }} />
          {/* Display them in a pre */}
          <Typography variant='h6' gutterBottom>
            Preview
          </Typography>
          <pre className='whitespace-pre-wrap -mt-1'>
            {qbvApValues.map((value) => 'wifitool apr1v0 setUnitTestCmd 0x47 13 402 ' + value + '\n')}
          </pre>

          <GateCycleDoc />
          <Divider sx={{ my: 1 }} />
          <Toolbar sx={{ px: '0 !important' }}>
            <LoadingButton color='warning'>Reset Qbv on AP</LoadingButton>
            <Box flexGrow={1} />
            <LoadingButton
              variant='contained'
              color='primary'
              disabled={apHexTime ? false : true}
              loading={isSendingApCommands}
              onClick={handleSendApCommands}
            >
              Send Commands to AP
            </LoadingButton>
          </Toolbar>
        </AccordionDetails>
      </Accordion>
    );
  }
);

ApQbvSettings.displayName = 'ApQbvSettings';
