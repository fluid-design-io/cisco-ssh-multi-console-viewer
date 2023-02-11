'use client';

import {
  Alert,
  AppBar,
  Box,
  Card,
  CardContent,
  CircularProgress,
  IconButton,
  LinearProgress,
  Snackbar,
  Toolbar,
  Typography,
} from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import { Fragment, useEffect, useRef, useState } from 'react';
import { getStationIperfCommand, IperfCommands } from './IperfCommands';
import SubjectIcon from '@mui/icons-material/Subject';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import GetAppRoundedIcon from '@mui/icons-material/GetAppRounded';
import { QbvDevice, QbvTFTPDevice } from './QbvDevice';
import { QbvSettings } from './QbvSettings';
import { useQbvCollapsed } from 'lib/useStore';
import { marked } from 'marked';

export type DeivceConfig = {
  ip: string;
  username: string;
  password: string;
};

export type QBVcommand = {
  type: string;
  command: string;
};

export type QBVconfig = {
  device_wifi: DeivceConfig;
  device_eth: DeivceConfig;
  device_tftp: DeivceConfig;
  device_sniffer: DeivceConfig;
  ap_command: string;
  server_commands: QBVcommand[];
  station_commands: QBVcommand[];
  options: QBVOptions;
};

export type QBVOptions = {
  /**
   * Store the captures in the local output folder or using the TFTP server
   */
  store: 'local' | 'tftp';
  /**
   * The local output folder
   */
  output: string;
  direction: 'DL' | 'UL' | 'ULDL';
};

export const defaultConfig: QBVconfig = {
  device_wifi: {
    ip: '10.10.12.99',
    username: 'sanjaynuc2',
    password: 'sjnuc2',
  },
  device_eth: {
    ip: '10.10.12.97',
    username: 'sanjaynuc1',
    password: 'sjnuc1',
  },
  device_tftp: {
    ip: '10.9.1.135',
    username: 'Cisco',
    password: 'Cisco',
  },
  device_sniffer: {
    ip: '10.10.12.101',
    username: 'sanjaynuc3',
    password: 'sjnuc3',
  },
  ap_command: 'wifitool apr1v0 setUnitTestCmd 0x47 13 402 0 1 0 0x3c8a85d 0x5f3d4f 35000 2 5000 3000 0 3000 100000',
  server_commands: [
    {
      type: 'BE 5010',
      command: 'iperf -s -p 5010',
    },
    {
      type: 'VI 5020',
      command: 'iperf -s -p 5020',
    },
  ],
  station_commands: [
    {
      type: 'BE',
      command: '',
    },
    {
      type: 'VI',
      command: '',
    },
  ],
  options: {
    store: 'tftp',
    // default as qbv-Jan-01-23
    output: `qbv-${new Date()
      .toLocaleString('default', { month: 'short', day: '2-digit', year: '2-digit' })
      .replace(/\s/g, '-')
      .replace(/,/g, '')}`,
    direction: 'DL',
  },
};

async function getStreamingData({ body, updateData }: { body: string; updateData?: (data: string) => void }) {
  try {
    const response = await fetch('http://localhost:8000/qbv', {
      method: 'POST',
      body,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = response.body;
    if (!data) {
      throw new Error('No data');
    }
    const reader = data.getReader();
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      const chunk = new TextDecoder('utf-8').decode(value);
      updateData && updateData(chunk);
    }
  } catch (error) {
    return Promise.reject(new Error('Something went wrong: ' + JSON.stringify(error)));
  }
}

const renderer = new marked.Renderer();
renderer.link = function (href, title, text) {
  return `<div class="py-5"><a class="bg-blue-500 cursor-pointer uppercase no-underline text-white py-2 px-4 rounded my-4 hover:bg-blue-600 font-medium" href="${encodeURI(
    href
  )}" title="${title}" target="_blank" rel="noopener noreferrer">${text}</a><div>`;
};

export default function Page() {
  const [config, setConfig] = useState<QBVconfig>(defaultConfig);
  const [data, setData] = useState<string>('');
  const [errorText, setErrorText] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [openToast, setOpenToast] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const outputRef = useRef<any>(null);
  const { setQbvCollapsedDevices, setQbvCollapsedSettings, setQbvCollapsedCommands } = useQbvCollapsed();

  const updateData = (chunk: string) => {
    setData((data) => marked.parse(data + chunk, { renderer }));
    // scroll to bottom of output
    setTimeout(() => {
      outputRef.current?.scrollTo(0, outputRef.current.scrollHeight);
    }, 150);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorText('');
    setQbvCollapsedDevices(true);
    setQbvCollapsedSettings(true);
    setQbvCollapsedCommands(true);
    // save current config to local storage
    localStorage.setItem('qbv-config', JSON.stringify(config));
    let body = { ...config } as any;
    // replace the iperf station command with getStationIperfCommand()
    body.station_commands = body.station_commands.map((command) => {
      return {
        ...command,
        command: getStationIperfCommand(config, command.command),
      };
    });
    body = JSON.stringify(body);
    try {
      await getStreamingData({ body, updateData });
      setIsFinished(true);
    } catch (error) {
      setErrorText(error.message);
    }
    setTimeout(() => {
      setIsLoading(false);
      setQbvCollapsedDevices(false);
      setQbvCollapsedSettings(false);
      setQbvCollapsedCommands(false);
      setTimeout(() => {
        // scroll to bottom of the page
        window.scrollTo(0, document.body.scrollHeight);
      }, 300);
    }, 800);
  };

  const handleExport = () => {
    const element = document.createElement('a');
    const file = new Blob([data], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'qbv-output.txt';
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
    setOpenToast(true);
  };

  // load config from local storage, if it exists
  useEffect(() => {
    const config = localStorage.getItem('qbv-config');
    if (config) {
      setConfig(JSON.parse(config));
      console.log('loaded config from local storage');
    }
  }, []);
  return (
    <Box component='main' sx={{ p: 2 }} className='max-w-[90rem] mx-auto'>
      <Grid2 container spacing={2} component='form' onSubmit={handleSubmit}>
        <QbvSettings config={config} updateConfig={setConfig} />
        {['wifi', 'eth', 'sniffer'].map((type) => (
          <QbvDevice
            type={type}
            device={config[`device_${type}`]}
            updateDevice={(device) => {
              setConfig({ ...config, [`device_${type}`]: device });
            }}
            key={`${type}-device-config`}
          />
        ))}
        <QbvTFTPDevice
          store={config.options?.store || 'tftp'}
          device={config.device_tftp}
          updateDevice={(device) => setConfig({ ...config, device_tftp: device })}
          updateStore={(store) => {
            setConfig({ ...config, options: { ...config.options, store: store ? 'tftp' : 'local' } });
          }}
        />
        <Grid2 xs={12}>
          <IperfCommands
            config={config}
            serverCommands={config.server_commands}
            updateServerCommands={(server_commands) => setConfig({ ...config, server_commands })}
            stationCommands={config.station_commands}
            updateStationCommands={(station_commands) => setConfig({ ...config, station_commands })}
          />
        </Grid2>
        <Grid2 xs={12}>
          <Card sx={{ p: 0, overflow: 'hidden' }}>
            <AppBar elevation={1} position='static' color='transparent'>
              {isLoading && <LinearProgress />}
              <Toolbar variant='dense'>
                <SubjectIcon />
                <Typography variant='h6' component='div' sx={{ flexGrow: 0, px: 1 }}>
                  Log
                </Typography>

                <Box sx={{ flexGrow: 1 }} />
                <IconButton color='error' aria-label='clear' disabled={isLoading || !data} onClick={() => setData('')}>
                  <DeleteSweepIcon />
                </IconButton>
                <IconButton color='inherit' aria-label='export' disabled={isLoading || !data} onClick={handleExport}>
                  <GetAppRoundedIcon />
                </IconButton>
                <IconButton color='inherit' aria-label='add' disabled={isLoading} type='submit'>
                  {isLoading ? <CircularProgress size={20} /> : <PlayArrowIcon />}
                </IconButton>
              </Toolbar>
            </AppBar>
            <CardContent
              sx={{
                py: '0 !important',
                minHeight: '12rem',
                height: '100vh',
                '& .md p': { my: '0 !important' },
                '& .md hr': {
                  borderTop: '2px dashed rgba(255,255,255,0.15)',
                  borderRadius: '0.5rem',
                },
              }}
              className='max-h-[max(32rem,80vh)] scroll-smooth overflow-y-auto'
              ref={outputRef}
            >
              {data && (
                <div className='md py-4 my-0 w-full text-xs text-white' dangerouslySetInnerHTML={{ __html: data }} />
              )}

              {!data && !errorText && (
                <Box sx={{ px: 2, py: 4 }}>
                  <Typography variant='body2' color='text.secondary'>
                    Start the iPerf test by clicking the play button above.
                  </Typography>
                </Box>
              )}
              {!data && errorText && (
                <Box sx={{ px: 2, py: 4 }}>
                  <Typography variant='body2' color='error'>
                    {errorText}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid2>
      </Grid2>

      <Snackbar open={openToast} onClose={() => setOpenToast(false)} autoHideDuration={3800}>
        <Alert onClose={() => setOpenToast(false)} severity='success' sx={{ width: '100%' }}>
          Export successful!
        </Alert>
      </Snackbar>
      <Snackbar open={isFinished} onClose={() => setIsFinished(false)} autoHideDuration={8000}>
        <Alert onClose={() => setIsFinished(false)} severity='success' sx={{ width: '100%' }}>
          Test finished {':)'}
        </Alert>
      </Snackbar>
    </Box>
  );
}
