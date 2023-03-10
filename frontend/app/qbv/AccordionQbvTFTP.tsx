import { memo } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Stack,
  Switch,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import { DeviceConnType, QBVconfig } from 'lib/qbvDefaultConfig';
import { useQbvSteps } from 'lib/useStore';
import { QbvDevice } from './QbvDevice';

export const AccordionQbvTFTP = memo(
  ({
    spline,
    deviceConfigs,
    setDeviceConfigs,
    qbvOptions,
    setQbvOptions,
  }: {
    spline: any;
    deviceConfigs: DeviceConnType[];
    setDeviceConfigs: (deviceConfigs: DeviceConnType[]) => void;
    qbvOptions: QBVconfig['options'];
    setQbvOptions: (qbvOptions: QBVconfig['options']) => void;
  }) => {
    const { isStarted, qbvSteps, handleStep } = useQbvSteps();
    const currentStep = qbvSteps.findIndex((step) => step.isCurrent);
    const findDeviceByType = (type: DeviceConnType['type']) => {
      return deviceConfigs.find((device) => device.type === type);
    };

    // if store is local, then trigger the tftp led off trigger, else trigger the tftp led on trigger
    const handleTftpLED = (checked: boolean) => {
      if (spline.current) {
        if (checked) {
          spline.current?.emitEvent('mouseDown', 'TFTP LED On Toggle');
        } else {
          spline.current?.emitEvent('mouseDown', 'TFTP LED Off Toggle');
        }
      }
      setQbvOptions({ ...qbvOptions, tftp: checked });
    };
    return (
      <Accordion
        elevation={4}
        TransitionProps={{ unmountOnExit: true }}
        expanded={currentStep === 4}
        onClick={() => handleStep(4)}
      >
        <AccordionSummary aria-controls='qbv-setup-accordion' id='qbv-setup-accordion'>
          <Toolbar sx={{ px: '0 !important', width: '100%', minHeight: '0 !important' }}>
            <Stack flexGrow={1}>
              <Typography>TFTP Server</Typography>
              {currentStep !== 4 && (
                <Typography variant='caption'>
                  {findDeviceByType('tftp')?.ip ?? 'Not Configured'} {qbvOptions.tftp ? ' • On' : ' • Off'}
                </Typography>
              )}
            </Stack>
            {currentStep === 4 && (
              <Switch
                checked={qbvOptions.tftp}
                onChange={(e) => {
                  handleTftpLED(e.target.checked);
                }}
              />
            )}
          </Toolbar>
        </AccordionSummary>
        <AccordionDetails>
          <Box>
            <TextField
              required
              fullWidth
              id={`tftp_output`}
              name={`tftp_output`}
              label={`TFTP Output Folder`}
              type='text'
              autoComplete='off'
              value={qbvOptions.output_folder}
              onChange={(e) => {
                setQbvOptions({ ...qbvOptions, output_folder: e.target.value });
              }}
              disabled={isStarted}
            />
            <QbvDevice
              device={deviceConfigs.find((device) => device.type === 'tftp')}
              type='tftp'
              updateDevice={(device) => {
                const newDeviceConfigs = deviceConfigs.map((d) => {
                  if (d.type === 'tftp') {
                    return device;
                  }
                  return d;
                });
                setDeviceConfigs(newDeviceConfigs);
              }}
              inputProps={{
                disabled: isStarted,
              }}
            />
          </Box>
        </AccordionDetails>
      </Accordion>
    );
  }
);

AccordionQbvTFTP.displayName = 'AccordionQbvTFTP';
