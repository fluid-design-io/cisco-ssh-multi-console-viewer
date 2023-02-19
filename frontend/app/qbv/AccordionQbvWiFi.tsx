import { memo } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Box, Stack, Typography } from '@mui/material';
import { DeviceConnType, QBVcommand, QBVconfig } from 'lib/qbvDefaultConfig';
import { useQbvSteps } from 'lib/useStore';
import { QbvDevice } from './QbvDevice';

export const AccordionQbvWiFi = memo(
  ({
    deviceConfigs,
    setDeviceConfigs,
  }: {
    deviceConfigs: DeviceConnType[];
    setDeviceConfigs: (deviceConfigs: DeviceConnType[]) => void;
  }) => {
    const { qbvSteps, handleStep } = useQbvSteps();
    const currentStep = qbvSteps.findIndex((step) => step.isCurrent);
    const findDeviceByType = (type: DeviceConnType['type']) => {
      return deviceConfigs.find((device) => device.type === type);
    };
    return (
      <Accordion
        elevation={4}
        TransitionProps={{ unmountOnExit: true }}
        expanded={currentStep === 1}
        onClick={() => handleStep(1)}
      >
        <AccordionSummary aria-controls='qbv-wifi-accordion' id='qbv-wifi-accordion'>
          <Stack>
            <Typography>WIFI</Typography>
            {currentStep !== 1 && (
              <Typography variant='caption'>{findDeviceByType('wifi')?.ip ?? 'Not Configured'}</Typography>
            )}
          </Stack>
        </AccordionSummary>
        <AccordionDetails>
          <Box>
            <QbvDevice
              device={deviceConfigs.find((device) => device.type === 'wifi')}
              type='wifi'
              updateDevice={(device) => {
                const newDeviceConfigs = deviceConfigs.map((d) => {
                  if (d.type === 'wifi') {
                    return device;
                  }
                  return d;
                });
                setDeviceConfigs(newDeviceConfigs);
              }}
            />
          </Box>
        </AccordionDetails>
      </Accordion>
    );
  }
);

AccordionQbvWiFi.displayName = 'AccordionQbvWiFi';
