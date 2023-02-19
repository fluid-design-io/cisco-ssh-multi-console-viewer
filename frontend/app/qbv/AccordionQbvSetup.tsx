import { Accordion, AccordionDetails, AccordionSummary, Box, Stack, Typography } from '@mui/material';
import { QBVcommand, QBVconfig } from 'lib/qbvDefaultConfig';
import { useQbvSteps } from 'lib/useStore';
import { Dispatch, SetStateAction, memo } from 'react';
import { IperfCommands } from './iPerfCommands';

export const AccordionQbvSetup = memo(
  ({
    serverCommands,
    setServerCommands,
    stationCommands,
    setStationCommands,
  }: {
    serverCommands: QBVconfig['server_commands'];
    setServerCommands: Dispatch<SetStateAction<QBVcommand[]>>;
    stationCommands: QBVconfig['station_commands'];
    setStationCommands: Dispatch<SetStateAction<QBVcommand[]>>;
  }) => {
    const { qbvSteps, handleStep } = useQbvSteps();
    const currentStep = qbvSteps.findIndex((step) => step.isCurrent);
    return (
      <Accordion
        elevation={4}
        expanded={currentStep === 5}
        TransitionProps={{ unmountOnExit: true }}
        onClick={() => handleStep(5)}
      >
        <AccordionSummary aria-controls='qbv-ap-accordion' id='qbv-ap-accordion'>
          <Stack width={1}>
            <Typography>Setup</Typography>
            {currentStep !== 5 && (
              <Box className='flex justify-between w-full flex-wrap'>
                <Box className='flex flex-col flex-shrink-0'>
                  {serverCommands.map(({ type, command }) => (
                    <Typography variant='caption' key={`server-${type}`}>
                      {type}: {command}
                    </Typography>
                  ))}
                </Box>
                <Box className='flex flex-col'>
                  {stationCommands.map(({ type, command }) => (
                    <Typography variant='caption' key={`station-${type}`}>
                      {type}: {command}
                    </Typography>
                  ))}
                </Box>
              </Box>
            )}
          </Stack>
        </AccordionSummary>
        <AccordionDetails>
          <Box>
            {/* <QbvDirection
          direction={qbvConfig.options.direction}
          setDirection={(driection) => setQbvOptions({ ...qbvConfig.options, direction: driection })}
        /> */}
            <IperfCommands
              serverCommands={serverCommands}
              stationCommands={stationCommands}
              updateServerCommands={setServerCommands}
              updateStationCommands={setStationCommands}
            />
          </Box>
        </AccordionDetails>
      </Accordion>
    );
  }
);

AccordionQbvSetup.displayName = 'AccordionQbvSetup';
