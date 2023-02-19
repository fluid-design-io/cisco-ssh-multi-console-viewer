import Code from '@mui/icons-material/Code';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  ListItemIcon,
  Button,
  Modal,
  AppBar,
  Toolbar,
  IconButton,
  Paper,
  Divider,
  Stack,
} from '@mui/material';
import { Fragment, memo, useState } from 'react';
import Close from '@mui/icons-material/Close';

export const GateCycleDoc = memo(() => {
  const [isQbvDocOpen, setIsQbvDocOpen] = useState(false);
  const handleOpenQbvDoc = () => setIsQbvDocOpen(true);
  const handleCloseQbvDoc = () => setIsQbvDocOpen(false);

  return (
    <Fragment>
      <Divider sx={{ mb: 1 }} />
      <Stack direction='row' className='items-center justify-between' spacing={1}>
        <Typography variant='caption'>
          If you need to refer to the QBV documentation, click the button to open the document.
        </Typography>
        <Button variant='text' className='flex-shrink-0' color='primary' onClick={handleOpenQbvDoc}>
          View Qbv Doc
        </Button>
      </Stack>
      <Modal
        open={isQbvDocOpen}
        onClose={handleCloseQbvDoc}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Paper className='max-h-screen overflow-auto'>
          <AppBar>
            <Toolbar>
              <Typography variant='h6' sx={{ flexGrow: 1 }} id='modal-modal-title'>
                Qbv Doc
              </Typography>
              <IconButton edge='end' color='inherit' onClick={handleCloseQbvDoc}>
                <Close />
              </IconButton>
            </Toolbar>
          </AppBar>
          <Box p={4} pt={12} maxWidth='768px' mx='auto'>
            <Typography variant='h5' gutterBottom>
              Gate Cycle setup
            </Typography>
            <Typography id='modal-modal-description' paragraph>
              <code>
                wifitool apr1v0 setUnitTestCmd 0x47 13 402 {'<radio_id>'} {'<enable | disable>'} {'<epoch_id>'}{' '}
                {'<utc_start_time_lo_us>'} {'<utc_start_time_hi_us>'} {'<nothing_duration_us>'} {'<tsn_ac>'}{' '}
                {'<tsn_duration_us>'} {'<tsn_ul_offsest_us>'} {'<tsn_dl_offset_us>'} {'<tsn_ul_dl_offset_us>'}{' '}
                {'<epoch_duration_us>'}
              </code>
            </Typography>
            <Typography variant='h5' gutterBottom>
              Gate Cycle Breakdown
            </Typography>
            <List>
              <ListItem>
                <ListItemText
                  primary='radio_id:'
                  secondary='1 (5ghz), 0 (2.4ghz), vap = wlanid, radio_id: 0 for 5GHz, 1 for 2.4 GHz, &gt; 1 for'
                />
              </ListItem>
              <ListItem>
                <ListItemText primary='slot_id enable:' secondary='1, disable 0' />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary='gate_id:'
                  secondary='a monotonically increasing id to associate a gate definition.'
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary='utc_start_time_lo_us:'
                  secondary={
                    <span>
                      &lt;32b hex&gt; when concatenated is 64b gate start time (i.e. start of first gate in cycle then
                      repeating at gate_cycle_time_us)
                    </span>
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary='utc_start_time_hi_us:'
                  secondary={
                    <span>
                      &lt;32b hex&gt; when concatenated is 64b gate start time (i.e. start of first gate in cycle then
                      repeating at gate_cycle_time_us)
                    </span>
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary='guard_interval_us:'
                  secondary='slot duration in microseconds when nothing is scheduled (I.e. guard time)'
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary='tsn_ac:'
                  secondary='specific AC that will be scheduled during the TSN slots (e.g. 0=BK, 1=BE, 2=VI, 3=VO)'
                />
              </ListItem>
              <ListItem>
                <ListItemText primary='tsn_duration_us:' secondary='TSN slot duration in microseconds.' />
              </ListItem>
              <ListSubheader></ListSubheader>
              <ListItem>
                <ListItemText
                  primary='tsn_ul_offset_us:'
                  secondary='defines UL for specific AC’s slot start time = gate start time + guard_interval_us + tsn_ul_offset_us. This slot’s end time is defined by the next highest offset specified.'
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary='tsn_dl_offset_us:'
                  secondary='defines DL for specific AC’s slot start time = gate start time + guard_interval_us + tsn_dl_offset_us'
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary='tsn_ul_dl_offset_us:'
                  secondary='defines UL+DL for specific AC slot start time = gate start time + guard_interval_us + tsn_ul_dl_offset_us'
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary='Example of offset computation:'
                  secondary='tsn_duration_us = 10000, tsn_ul_offset_us = 0, tsn_dl_offset_us = 1000, tsn_ul_dl_offset_us = 3000'
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary='tsn_ul slot duration:'
                  secondary='tsn_dl_offset_us – tsn_ul_offset_us = 1000 us'
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary='tsn_dl slot duration:'
                  secondary='tsn_ul_dl_offset_us – tsn_dul_offset_us = 2000 us'
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary='tsn_ul_dl slot duration:'
                  secondary='tsn_duration_us – tsn_ul_dl_offset_us = 7000 us'
                />
              </ListItem>
            </List>
            <Typography variant='h5' gutterBottom>
              UTC Time
            </Typography>
            <Typography paragraph>
              <span>5f04de9feded2 {'=>'} this is the full hex, which has 2 parts</span>
            </Typography>
            <Typography style={{ fontWeight: 'bold' }} paragraph>
              <span>Example time:</span> 5f04de9feded2 {'=>'} 0xe9feded2 0x5f04d
            </Typography>
            <List>
              <ListItem>
                <ListItemText
                  primary='e9feded2:'
                  secondary='the second half (32-bit) => it means &lt;utc_start_time_lo_us&gt;'
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary='5f04d:'
                  secondary='the first half (20-bit), it will always be the same when using this command ./utc_us.sh => it means &lt;utc_start_time_hi_us&gt;'
                />
              </ListItem>
              <ListItem>
                <ListItemText primary='We place the 2nd part before the 1st part in the command with the 0x in front' />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Code />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <code>
                      wifitool apr1v0 setUnitTestCmd 0x47 13 402 0 1 0 0xe9feded2 0x5f04d 35000 2 5000 0 3000 3000
                      100000
                    </code>
                  }
                />
              </ListItem>
            </List>
          </Box>
        </Paper>
      </Modal>
    </Fragment>
  );
});

GateCycleDoc.displayName = 'GateCycleDoc';
