'use client';

import { Paper, Box } from '@mui/material';
import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import { QbvStepperControls } from './QbvStepper';
import { useQbvSteps } from 'lib/useStore';
import { ApQbvSettings, qbvApConfigReducer } from './ApQbvSettings';
import {
  ApConnType,
  defaultApConfig,
  defaultApConnection,
  defaultDeviceConnConfig,
  defaultQbvOptions,
  defaultServerCommands,
  defaultStationCommands,
  DeviceConnType,
  QBVconfig,
} from 'lib/qbvDefaultConfig';
import { AccordionQbvSetup } from './AccordionQbvSetup';
import { AccordionQbvTFTP } from './AccordionQbvTFTP';
import { AccordionQbvEth } from './AccordionQbvEth';
import { AccordionQbvSniffer } from './AccordionQbvSniffer';
import { AccordionQbvWiFi } from './AccordionQbvWiFi';
import { SplineRender } from './SplineRender';
import { RawConfiguration } from './RawConfiguration';
import { marked } from 'marked';
import { QbvLogPanel } from './QbvLogPanel';
import { storage } from 'lib/storage';

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
    process.env.NODE_ENV === 'development' && console.log('data', data);
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
/**
 * A function to get the values from the local storage
 * @returns {object} storedQbvApConfig, storedApConnection, storedDeviceConfigs, storedServerCommands, storedStationCommands, storedQbvOptions
 */
const getValuesFromLocalStorage = () => {
  let storedQbvApConfig,
    storedApConnection,
    storedDeviceConfigs,
    storedServerCommands,
    storedStationCommands,
    storedQbvOptions;
  try {
    storedQbvApConfig = (storage && JSON.parse(storage.getItem('qbv-ap-config'))) || [defaultApConfig];
    storedApConnection = (storage && JSON.parse(storage.getItem('qbv-ap-connection'))) || defaultApConnection;
    storedDeviceConfigs = (storage && JSON.parse(storage.getItem('qbv-device-configs'))) || defaultDeviceConnConfig;
    storedServerCommands = (storage && JSON.parse(storage.getItem('qbv-server-commands'))) || defaultServerCommands;
    storedStationCommands = (storage && JSON.parse(storage.getItem('qbv-station-commands'))) || defaultStationCommands;
    storedQbvOptions = (storage && JSON.parse(storage.getItem('qbv-options'))) || defaultQbvOptions;
  } catch (error) {
    console.error(error);
  }
  return {
    storedQbvApConfig,
    storedApConnection,
    storedDeviceConfigs,
    storedServerCommands,
    storedStationCommands,
    storedQbvOptions,
  };
};

const Page = () => {
  const { qbvSteps, setQbvSteps, isStarted, handleStop, handleStartQbvTest, handleStopQbvTest } = useQbvSteps();
  const currentStep = qbvSteps.findIndex((step) => step.isCurrent);
  // get the value from the local storage
  const {
    storedQbvApConfig,
    storedApConnection,
    storedDeviceConfigs,
    storedServerCommands,
    storedStationCommands,
    storedQbvOptions,
  } = getValuesFromLocalStorage();
  const spline = useRef(null);
  const logPanelRef = useRef(null);
  const [data, setData] = useState<string>('');
  const [errorText, setErrorText] = useState('');
  const [showLogPanel, setShowLogPanel] = useState(false);

  const [qbvApConfig, dispatchQbvApConfig] = useReducer(qbvApConfigReducer, storedQbvApConfig);
  const [apConnection, setApConnection] = useState<ApConnType>(storedApConnection);
  const [deviceConfigs, setDeviceConfigs] = useState<DeviceConnType[]>(storedDeviceConfigs);
  const [serverCommands, setServerCommands] = useState<QBVconfig['server_commands']>(storedServerCommands);
  const [stationCommands, setStationCommands] = useState<QBVconfig['station_commands']>(storedStationCommands);
  const [qbvOptions, setQbvOptions] = useState<QBVconfig['options']>(storedQbvOptions);

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
    storage.setItem('qbv-config', JSON.stringify(qbvConfig));
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
  };

  useEffect(() => {
    checkCompletion();
  }, [currentStep]);

  useEffect(() => {
    if (isStarted) {
      startQbvTest();
    }
  }, [handleStartQbvTest]);

  useEffect(() => {
    if (isStarted) {
      setShowLogPanel(true);
    }
  }, [isStarted]);

  // store each config in local storage
  useEffect(() => {
    // ignore if the config is the same as the one in local storage, if exists
    const storedCommands = JSON.stringify(qbvApConfig);
    if (storage && storedCommands === storage.getItem('qbv-ap-config')) return;
    localStorage.setItem('qbv-ap-config', storedCommands);
    console.log('stored ap config');
  }, [qbvApConfig]);

  useEffect(() => {
    const storedCommands = JSON.stringify(apConnection);
    if (storage && storedCommands === storage.getItem('qbv-ap-connection')) return;
    localStorage.setItem('qbv-ap-connection', storedCommands);
  }, [apConnection]);

  useEffect(() => {
    const storedCommands = JSON.stringify(deviceConfigs);
    if (storage && storedCommands === storage.getItem('qbv-device-configs')) return;
    localStorage.setItem('qbv-device-configs', storedCommands);
  }, [deviceConfigs]);

  useEffect(() => {
    const storedCommands = JSON.stringify(serverCommands);
    if (storage && storedCommands === storage.getItem('qbv-server-commands')) return;
    localStorage.setItem('qbv-server-commands', storedCommands);
    console.log('stored server commands');
  }, [serverCommands]);

  useEffect(() => {
    const storedCommands = JSON.stringify(stationCommands);
    if (storage && storedCommands === storage.getItem('qbv-station-commands')) return;
    localStorage.setItem('qbv-station-commands', storedCommands);
  }, [stationCommands]);

  useEffect(() => {
    const storedOptions = JSON.stringify(qbvOptions);
    if (storedOptions === storage.getItem('qbv-options')) return;
    localStorage.setItem('qbv-options', storedOptions);
  }, [qbvOptions]);

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
          <ApQbvSettings
            {...{ spline, qbvApConfig, dispatchQbvApConfig, apConnection, setApConnection, setErrorText, updateData }}
          />
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
