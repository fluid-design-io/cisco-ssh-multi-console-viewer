import { AppBar, Box, Button, IconButton, Modal, Paper, Toolbar, Typography } from '@mui/material';
import { QBVconfig } from 'lib/qbvDefaultConfig';
import LaunchIcon from '@mui/icons-material/Launch';
import { useState } from 'react';
import Close from '@mui/icons-material/Close';

export const RawConfiguration = ({ config }: { config: QBVconfig }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant='text' onClick={() => setOpen(true)} endIcon={<LaunchIcon />} sx={{ mt: 2 }}>
        View raw configuration
      </Button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <Paper className='max-h-screen overflow-auto'>
          <Box className='mx-auto max-w-6xl p-4'>
            <AppBar>
              <Toolbar>
                <Typography variant='h6' sx={{ flexGrow: 1 }} id='modal-modal-title'>
                  Qbv Doc
                </Typography>
                <IconButton edge='end' color='inherit' onClick={() => setOpen(false)}>
                  <Close />
                </IconButton>
              </Toolbar>
            </AppBar>
            <pre className='whitespace-pre-wrap text-xs mt-16'>{JSON.stringify(config, null, 2)}</pre>
          </Box>
        </Paper>
      </Modal>
    </>
  );
};
