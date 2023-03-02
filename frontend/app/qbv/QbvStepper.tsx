import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
import Button from '@mui/material/Button';
import { useEffect } from 'react';
import { useQbvSteps } from 'lib/useStore';
import clsx from 'clsx';
import { AppBar, Toolbar } from '@mui/material';

export const QbvStepper = ({ spline, triggers }: { spline: any; triggers: any[] }) => {
  const { qbvSteps, handleStep } = useQbvSteps();
  const currentStep = qbvSteps.findIndex((step) => step.isCurrent);
  useEffect(() => {
    if (spline.current && triggers[currentStep]) {
      spline.current.emitEvent('mouseDown', triggers[currentStep]);
    }
  }, [currentStep]);
  // set to first trigger after 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      spline?.current?.emitEvent('mouseDown', triggers[0]);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);
  return (
    <Box sx={{ width: '100%' }} className='pt-4 md:pt-0 md:absolute md:bottom-4 md:inset-x-0 z-10'>
      <Stepper nonLinear alternativeLabel activeStep={currentStep}>
        {qbvSteps.map(({ name, isCompleted, isCurrent }, index) => (
          <Step key={`qbv-step-${name}`} completed={isCompleted}>
            <StepButton
              color='inherit'
              onClick={() => handleStep(index)}
              sx={{
                '& .MuiStepLabel-label': {
                  mt: 1,
                },
              }}
            >
              {name}
            </StepButton>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};

export const QbvStepperControls = ({ className = '' }: { className?: string }) => {
  const { qbvSteps, handleNext, handlePrevious, handleStart, handleStop, isStarted } = useQbvSteps();
  const totalSteps = qbvSteps.length;
  const currentStep = qbvSteps.findIndex((step) => step.isCurrent);
  const isEveryStepCompleted = qbvSteps.every((step) => step.isCompleted);
  return (
    <AppBar elevation={4} position='static' className={clsx(className)}>
      <Toolbar>
        <Box sx={{ display: 'flex', flexDirection: 'row' }} className='w-full'>
          <Button color='inherit' disabled={currentStep === 0} onClick={() => handlePrevious()}>
            Back
          </Button>
          <Box sx={{ flex: '1 1 auto' }} />
          {currentStep === totalSteps - 1 || isEveryStepCompleted ? (
            <Button
              color={qbvSteps.slice(0, 3).every((step) => step.isCompleted) ? 'success' : 'primary'}
              variant='contained'
              disabled={!qbvSteps.slice(0, 3).every((step) => step.isCompleted)}
              onClick={isStarted ? handleStop : handleStart}
            >
              {isStarted ? 'Stop' : 'Start'}
            </Button>
          ) : (
            <Button onClick={handleNext}>Save and Continue</Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};
