import { memo } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Box, Stack, Typography } from '@mui/material';
import { DeviceConnType, QBVcommand, QBVconfig } from 'lib/qbvDefaultConfig';
import { useQbvSteps } from 'lib/useStore';
import { QbvDevice } from './QbvDevice';

export const AccordionQbvEth = memo(
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
        expanded={currentStep === 2}
        onClick={() => handleStep(2)}
      >
        <AccordionSummary aria-controls='qbv-eth-accordion' id='qbv-eth-accordion'>
          <Stack>
            <Typography>Ethernet</Typography>
            {currentStep !== 2 && (
              <Typography variant='caption'>{findDeviceByType('eth')?.ip ?? 'Not Configured'}</Typography>
            )}
          </Stack>
        </AccordionSummary>
        <AccordionDetails>
          <Box>
            <QbvDevice
              device={deviceConfigs.find((device) => device.type === 'eth')}
              type='eth'
              updateDevice={(device) => {
                const newDeviceConfigs = deviceConfigs.map((d) => {
                  if (d.type === 'eth') {
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

AccordionQbvEth.displayName = 'AccordionQbvEth';
