'use client';

import { Paper, Box, IconButton } from '@mui/material';
import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import { QbvStepperControls } from './QbvStepper';
import { useQbvSteps } from 'lib/useStore';
import { ApQbvSettings, qbvApConfigReducer } from './ApQbvSettings';
import { ApConnType, defaultApConfig, defaultDeviceConnConfig, DeviceConnType, QBVconfig } from 'lib/qbvDefaultConfig';
import { AccordionQbvSetup } from './AccordionQbvSetup';
import { AccordionQbvTFTP } from './AccordionQbvTFTP';
import { AccordionQbvEth } from './AccordionQbvEth';
import { AccordionQbvSniffer } from './AccordionQbvSniffer';
import { AccordionQbvWiFi } from './AccordionQbvWiFi';
import { SplineRender } from './SplineRender';
import { RawConfiguration } from './RawConfiguration';
import { marked } from 'marked';
import { QbvLogPanel } from './QbvLogPanel';

const renderer = new marked.Renderer();
renderer.link = function (href, title, text) {
  return `<div class="py-5"><a class="bg-blue-500 cursor-pointer uppercase no-underline text-white py-2 px-4 rounded my-4 hover:bg-blue-600 font-medium" href="${encodeURI(
    href
  )}" title="${title}" target="_blank" rel="noopener noreferrer">${text}</a><div>`;
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
      // When no more data needs to be consumed, break the reading
      if (done) {
        break;
      }
      // value for fetch streams is a Uint8Array
      const chunk = new TextDecoder('utf-8').decode(value);

      // Accumulate data and display it
      updateData && updateData(chunk);
    }
  } catch (error) {
    return Promise.reject(new Error('Something went wrong: ' + JSON.stringify(error)));
  }
}

const Page = () => {
  const { qbvSteps, setQbvSteps, isStarted, handleStop } = useQbvSteps();
  const currentStep = qbvSteps.findIndex((step) => step.isCurrent);
  const spline = useRef(null);
  const logPanelRef = useRef(null);
  const [data, setData] = useState<string>('');
  const [errorText, setErrorText] = useState('');
  const [showLogPanel, setShowLogPanel] = useState(false);
  // const [qbvApConfig, setQbvApConfig] = useState<QbvApConfig[]>([defaultApConfig]);
  const [qbvApConfig, dispatchQbvApConfig] = useReducer(qbvApConfigReducer, [defaultApConfig]);
  const [apConnection, setApConnection] = useState<ApConnType>({
    ip: '10.10.12.52',
    username: 'apuser',
    password: 'SecureAP1',
    enable_password: 'SecureAP1',
  });
  const [deviceConfigs, setDeviceConfigs] = useState<DeviceConnType[]>(defaultDeviceConnConfig);
  const [serverCommands, setServerCommands] = useState<QBVconfig['server_commands']>([
    {
      type: 'BE 5010',
      command: 'iperf -s -p 5010 -t 60', // We need to set timeout for the server to close the connection
    },
    {
      type: 'VI 5020',
      command: 'iperf -s -p 5020 -t 60',
    },
  ]);
  const [stationCommands, setStationCommands] = useState<QBVconfig['station_commands']>([
    {
      type: 'BE',
      command: "'/home/sanjaynuc1/Desktop/iperf' -c 10.10.12.99 -l 1500 -b 212M -t 55 -i 1 -p 5010", // give a little more time for the server to close the connection
    },
    {
      type: 'VI',
      command: "'/home/sanjaynuc1/Desktop/iperf' -c 10.10.12.99 -l 128 -b 50pps -t 55 -i 1 -p 5020",
    },
  ]);
  const [qbvOptions, setQbvOptions] = useState<QBVconfig['options']>({
    direction: 'DL',
    tftp: true,
    output_folder: './output',
  });

  const findDeviceByType = (type: DeviceConnType['type']) => {
    return deviceConfigs.find((device) => device.type === type);
  };

  const qbvConfig: QBVconfig = {
    ap_connection: apConnection,
    ap_commands: qbvApConfig.map(
      (config) => 'wifitool apr1v0 setUnitTestCmd 0x47 13 4020 ' + Object.values(config).join(' ').trim()
    ),
    device_wifi: { ...findDeviceByType('wifi') },
    device_eth: { ...findDeviceByType('eth') },
    device_tftp: { ...findDeviceByType('tftp') },
    device_sniffer: { ...findDeviceByType('sniffer') },
    server_commands: serverCommands,
    station_commands: stationCommands,
    options: qbvOptions,
  };

  // TODO: useReducer might be a better option here
  const setStepCompletion = useCallback(
    (step: number, completed: boolean) => {
      const prevQbvSteps = [...qbvSteps];
      prevQbvSteps[step].isCompleted = completed;
      setQbvSteps(prevQbvSteps);
    },
    [qbvSteps]
  );

  const checkDeviceCompletion = useCallback((device: DeviceConnType) => {
    // if ip and username are not empty, then set the step to completed
    if (device.ip !== '' && device.username !== '') {
      return true;
    }
    return false;
  }, []);

  const checkCompletion = useCallback(() => {
    qbvSteps.forEach((step, index) => {
      switch (step.name) {
        case 'AP': // if every value of the object qbvApConfig is not empty, then set the step to completed
          if (qbvApConfig.every((config) => Object.values(config).every((value) => value !== ''))) {
            setStepCompletion(index, true);
          } else {
            setStepCompletion(index, false);
          }
          break;
        case 'WiFi': // if the device wifi is not empty, then set the step to completed
          setStepCompletion(index, checkDeviceCompletion(findDeviceByType('wifi')));
          break;
        case 'Ethernet': // if the device eth is not empty, then set the step to completed
          setStepCompletion(index, checkDeviceCompletion(findDeviceByType('eth')));
          break;
        case 'TFTP': // if the device tftp is not empty, then set the step to completed
          setStepCompletion(index, checkDeviceCompletion(findDeviceByType('tftp')));
          break;
        case 'Sniffer': // if the device sniffer is not empty, then set the step to completed
          setStepCompletion(index, checkDeviceCompletion(findDeviceByType('sniffer')));
          break;
        case 'Setup':
          // if the server commands and station commands are not empty, then set the step to completed
          if (
            serverCommands.every(({ command }) => command !== '') &&
            stationCommands.every(({ command }) => command !== '')
          ) {
            setStepCompletion(index, true);
          } else {
            setStepCompletion(index, false);
          }
          break;
        default:
          break;
      }
    });
  }, [qbvApConfig, serverCommands, stationCommands]);

  const updateData = (chunk: string) => {
    setData((data) => marked.parse(data + chunk, { renderer }));
    // scroll to bottom of output
    setTimeout(() => {
      logPanelRef.current?.scrollTo(0, logPanelRef.current.scrollHeight);
    }, 150);
  };
  const startQbvTest = async () => {
    setShowLogPanel(true);
    // save current config to local storage
    localStorage.setItem('qbv-config', JSON.stringify(qbvConfig));
    let body = { ...qbvConfig } as any;
    body = JSON.stringify(body);
    try {
      await getStreamingData({ body, updateData });
    } catch (error) {
      setErrorText(error.message);
    }
    handleStop();
    setTimeout(() => {
      // scroll to bottom of the page
      logPanelRef.current?.scrollTo(0, logPanelRef.current.scrollHeight);
    }, 300);
    return;
  };

  useEffect(() => {
    checkCompletion();
  }, [currentStep]);

  useEffect(() => {
    if (isStarted) {
      startQbvTest();
    }
  }, [isStarted]);

  return (
    <Paper
      component='main'
      className='grid place-items-stretch sm:grid-cols-2 h-screen max-h-[calc(100dvh-56px)] md:max-h-[calc(100dvh-64px)] overflow-hidden'
    >
      <Box
        className='order-last md:order-first relative flex flex-col'
        style={{
          transform: showLogPanel ? 'rotateY(180deg)' : 'rotateY(0deg)',
          transformStyle: 'preserve-3d',
          transition: 'transform cubic-bezier(0.4, 0, 0.2, 1) 0.7s', // a cubic-bezier curve would be nice here
        }}
      >
        {/* Flip the boxes when is started */}
        <Box
          width={1}
          height={1}
          className='transition-transform duration-500'
          style={{
            backfaceVisibility: 'hidden',
            pointerEvents: showLogPanel ? 'none' : 'auto',
          }}
        >
          <SplineRender spline={spline} />
        </Box>
        <QbvLogPanel ref={logPanelRef} {...{ showLogPanel, isStarted, data, errorText, setData, setShowLogPanel }} />
      </Box>
      <Box className='relative flex flex-col h-full justify-between'>
        <Box p={2} className='flex-grow w-full max-h-[calc(50dvh-72px)] md:max-h-[calc(100dvh-132px)] overflow-auto'>
          <ApQbvSettings {...{ spline, qbvApConfig, dispatchQbvApConfig, apConnection, setApConnection }} />
          <AccordionQbvWiFi
            {...{
              deviceConfigs,
              setDeviceConfigs,
            }}
          />
          <AccordionQbvEth
            {...{
              deviceConfigs,
              setDeviceConfigs,
            }}
          />
          <AccordionQbvSniffer
            {...{
              deviceConfigs,
              setDeviceConfigs,
            }}
          />
          <AccordionQbvTFTP
            {...{
              spline,
              deviceConfigs,
              setDeviceConfigs,
              setQbvOptions,
              qbvOptions,
            }}
          />
          <AccordionQbvSetup {...{ serverCommands, setServerCommands, stationCommands, setStationCommands }} />
          <RawConfiguration config={qbvConfig} />
        </Box>
        <QbvStepperControls className='bottom-0 inset-x-0 w-full hidden md:block' />
      </Box>
    </Paper>
  );
};

export default Page;
