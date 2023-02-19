import { memo } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Box, Stack, Typography } from '@mui/material';
import { DeviceConnType, QBVcommand, QBVconfig } from 'lib/qbvDefaultConfig';
import { useQbvSteps } from 'lib/useStore';
import { QbvDevice } from './QbvDevice';

export const AccordionQbvSniffer = memo(
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
        expanded={currentStep === 3}
        onClick={() => handleStep(3)}
      >
        <AccordionSummary aria-controls='qbv-sniffer-accordion' id='qbv-sniffer-accordion'>
          <Stack>
            <Typography>Sniffer</Typography>
            {currentStep !== 3 && (
              <Typography variant='caption'>{findDeviceByType('sniffer')?.ip ?? 'Not Configured'}</Typography>
            )}
          </Stack>
        </AccordionSummary>
        <AccordionDetails>
          <Box>
            <QbvDevice
              device={deviceConfigs.find((device) => device.type === 'sniffer')}
              type='sniffer'
              updateDevice={(device) => {
                const newDeviceConfigs = deviceConfigs.map((d) => {
                  if (d.type === 'sniffer') {
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

AccordionQbvSniffer.displayName = 'AccordionQbvSniffer';
