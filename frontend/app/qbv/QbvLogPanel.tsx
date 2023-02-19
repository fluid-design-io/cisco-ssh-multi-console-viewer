import { AppBar, Box, IconButton, LinearProgress, Toolbar, Typography } from '@mui/material';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import GetAppRoundedIcon from '@mui/icons-material/GetAppRounded';
import clsx from 'clsx';
import { forwardRef } from 'react';

export const QbvLogPanel = forwardRef(
  (
    {
      showLogPanel,
      isStarted,
      data,
      errorText,
      setData,
      setShowLogPanel,
    }: {
      showLogPanel: boolean;
      isStarted: boolean;
      data: string;
      errorText: string;
      setData: (data: string) => void;
      setShowLogPanel: (showLogPanel: boolean) => void;
    },
    ref
  ) => {
    return (
      <Box
        width={1}
        height={1}
        className={clsx('transition-transform duration-700 absolute inset-0')}
        style={{
          backfaceVisibility: 'hidden',
          transform: 'rotateY(180deg)',
          pointerEvents: showLogPanel ? 'auto' : 'none',
        }}
        bgcolor='grey.900'
        sx={{
          '& .md p': { my: '0 !important' },
          '& .md hr': {
            borderTop: '2px dashed rgba(255,255,255,0.15)',
            borderRadius: '0.5rem',
          },
        }}
      >
        {isStarted && <LinearProgress sx={{ position: 'absolute', top: 0, left: 0, right: 0 }} />}
        <Box
          p={2}
          ref={ref}
          className='max-h-[calc(50dvh-42px)] md:max-h-[calc(100dvh-128px)] overflow-auto scroll-smooth'
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
        </Box>
        <AppBar elevation={4} sx={{ top: 'auto', bottom: 0, zIndex: 10 }}>
          <Toolbar>
            <IconButton
              color='error'
              aria-label='clear'
              disabled={isStarted || !data}
              onClick={() => {
                setData('');
                setShowLogPanel(false);
              }}
            >
              <DeleteSweepIcon />
            </IconButton>
            <Box sx={{ flexGrow: 1 }} />
            <IconButton color='inherit' aria-label='export' disabled={isStarted || !data} onClick={() => null}>
              <GetAppRoundedIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
      </Box>
    );
  }
);

QbvLogPanel.displayName = 'QbvLogPanel';
