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
  Link,
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
                wifitool apr1v0 setUnitTestCmd 0x47 13 402 <Link href='#radio_id'>{'<radio_id>'} </Link>
                <Link href='#enable_disable'>{'<enable | disable>'} </Link>
                <Link href='#epoch_id'>{'<epoch_id>'} </Link>
                <Link href='#utc_start_time_lo_us'>{'<utc_start_time_lo_us>'} </Link>
                <Link href='#utc_start_time_hi_us'>{'<utc_start_time_hi_us>'} </Link>
                <Link href='#nothing_duration_us'>{'<nothing_duration_us>'} </Link>
                <Link href='#tsn_ac'>{'<tsn_ac>'} </Link>
                <Link href='#tsn_duration_us'>{'<tsn_duration_us>'} </Link>
                <Link href='#tsn_ul_offsest_us'>{'<tsn_ul_offsest_us>'} </Link>
                <Link href='#tsn_dl_offset_us'>{'<tsn_dl_offset_us>'} </Link>
                <Link href='#tsn_ul_dl_offset_us'>{'<tsn_ul_dl_offset_us>'} </Link>
                <Link href='#epoch_duration_us'>{'<epoch_duration_us>'}</Link>
              </code>
            </Typography>
            <Typography variant='h5' gutterBottom>
              Gate Cycle Breakdown
            </Typography>
            <List>
              <ListItem>
                <ListItemText
                  className='scroll-m-20'
                  primary='radio_id:'
                  id='radio_id'
                  secondary='radio_id: 0 for 5GHz, 1 for 2.4 GHz, &gt; 1 for slot_id'
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  className='scroll-m-20'
                  primary='slot_id enable:'
                  id='enable_disable'
                  secondary='1, disable 0'
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  className='scroll-m-20'
                  primary='gate_id:'
                  id='epoch_id'
                  secondary='a monotonically increasing id to associate a gate definition.'
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  className='scroll-m-20'
                  primary='utc_start_time_lo_us:'
                  id='utc_start_time_lo_us'
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
                  className='scroll-m-20'
                  primary='utc_start_time_hi_us:'
                  id='utc_start_time_hi_us'
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
                  className='scroll-m-20'
                  primary='guard_interval_us:'
                  id='nothing_duration_us'
                  secondary='slot duration in microseconds when nothing is scheduled (I.e. guard time)'
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  className='scroll-m-20'
                  primary='tsn_ac:'
                  id='tsn_ac'
                  secondary='specific AC that will be scheduled during the TSN slots (e.g. 0=BK, 1=BE, 2=VI, 3=VO)'
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  className='scroll-m-20'
                  primary='tsn_duration_us:'
                  id='tsn_duration_us'
                  secondary='TSN slot duration in microseconds.'
                />
              </ListItem>
              <ListSubheader></ListSubheader>
              <ListItem>
                <ListItemText
                  className='scroll-m-20'
                  primary='tsn_ul_offset_us:'
                  id='tsn_ul_offset_us'
                  secondary='defines UL for specific AC’s slot start time = gate start time + guard_interval_us + tsn_ul_offset_us. This slot’s end time is defined by the next highest offset specified.'
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  className='scroll-m-20'
                  primary='tsn_dl_offset_us:'
                  id='tsn_dl_offset_us'
                  secondary='defines DL for specific AC’s slot start time = gate start time + guard_interval_us + tsn_dl_offset_us'
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  className='scroll-m-20'
                  primary='tsn_ul_dl_offset_us:'
                  id='tsn_ul_dl_offset_us'
                  secondary='defines UL+DL for specific AC slot start time = gate start time + guard_interval_us + tsn_ul_dl_offset_us'
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  className='scroll-m-20'
                  primary='Example of offset computation:'
                  secondary='tsn_duration_us = 10000, tsn_ul_offset_us = 0, tsn_dl_offset_us = 1000, tsn_ul_dl_offset_us = 3000'
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  className='scroll-m-20'
                  primary='tsn_ul slot duration:'
                  secondary='tsn_dl_offset_us – tsn_ul_offset_us = 1000 us'
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  className='scroll-m-20'
                  primary='tsn_dl slot duration:'
                  secondary='tsn_ul_dl_offset_us – tsn_dul_offset_us = 2000 us'
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  className='scroll-m-20'
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
                  className='scroll-m-20'
                  primary='e9feded2:'
                  secondary='the second half (32-bit) => it means &lt;utc_start_time_lo_us&gt;'
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  className='scroll-m-20'
                  primary='5f04d:'
                  secondary='the first half (20-bit), it will always be the same when using this command ./utc_us.sh => it means &lt;utc_start_time_hi_us&gt;'
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  className='scroll-m-20'
                  primary='We place the 2nd part before the 1st part in the command with the 0x in front'
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Code />
                </ListItemIcon>
                <ListItemText
                  className='scroll-m-20'
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
