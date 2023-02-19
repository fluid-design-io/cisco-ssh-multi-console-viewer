import { Box } from '@mui/material';
import { Fragment, memo } from 'react';
import Spline from '@splinetool/react-spline';
import { QbvStepper, QbvStepperControls } from './QbvStepper';
import clsx from 'clsx';

export const SplineRender = memo(({ spline, className = '' }: { [key: string]: any }) => {
  const triggerNames = ['AP Trigger', 'WiFi Trigger', 'Eth Trigger', 'Sniffer Trigger', 'TFTP Trigger', 'Home Trigger'];
  const onLoad = (splineApp) => {
    // save the app in a ref for later use
    spline.current = splineApp;
  };
  console.log('SplineRender');
  return (
    <Fragment>
      <Box
        height='100%'
        width='100%'
        position='relative'
        className={clsx('max-h-[38vh] md:max-h-none flex-grow flex flex-col gap-4 md:gap-0', className)}
      >
        <Spline scene='/assets/cisco_qbv_flow.splinecode' onLoad={onLoad} />
        {/* <Spline scene='https://prod.spline.design/AvBq6qyr6zV0-0UT/scene.splinecode' onLoad={onLoad} /> */}
      </Box>
      <QbvStepper spline={spline} triggers={triggerNames} />
      <Box className='flex-grow bg-yellow-200 md:hidden' />
      <QbvStepperControls className='md:hidden' />
    </Fragment>
  );
});

SplineRender.displayName = 'SplineRender';
