'use client';

import {
  Paper,
  Stack,
  Typography,
  TextField,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  FormHelperText,
  AppBar,
  Box,
  Card,
  Toolbar,
  Tooltip,
  IconButton,
  Collapse,
  Button,
} from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2';
import { defaultConfig, QBVconfig } from './page';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useQbvCollapsed } from 'lib/useStore';

export const QbvSettings = ({
  config,
  updateConfig,
}: {
  config: QBVconfig;
  updateConfig: (config: QBVconfig) => void;
}) => {
  const { qbvCollapsedSettings, toggleQbvCollapsedSettings: toggleQbvCollapsed } = useQbvCollapsed();
  return (
    <Grid2 xs={12}>
      <Card sx={{ p: 0, overflow: 'hidden' }}>
        <AppBar elevation={1} position='static' color='transparent'>
          <Toolbar variant='dense'>
            <Typography variant='h6' component='div' sx={{ flexGrow: 0, px: 1 }} className='uppercase'>
              Settings
            </Typography>

            <Box sx={{ flexGrow: 1 }} />
            <Tooltip title={'Expand/Collapse Settings'} placement='top'>
              <IconButton onClick={toggleQbvCollapsed}>
                {qbvCollapsedSettings ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </Tooltip>
          </Toolbar>
        </AppBar>
        <Collapse in={!qbvCollapsedSettings}>
          <Stack spacing={2} p={2}>
            <FormControl>
              <FormLabel id='qbv_direction'>Direction</FormLabel>
              <RadioGroup
                row
                aria-labelledby='qbv_direction'
                name='options_direction'
                value={config.options.direction}
                onChange={(e) => {
                  updateConfig({
                    ...config,
                    options: { ...config.options, direction: e.target.value as 'DL' | 'UL' | 'ULDL' },
                  });
                }}
              >
                <FormControlLabel value='DL' control={<Radio />} label='DL' />
                <FormControlLabel value='UL' control={<Radio />} label='UL' />
                {/* <FormControlLabel value='ULDL' control={<Radio />} label='ULDL' /> */}
              </RadioGroup>
              <FormHelperText>
                DL: From ETH to WiFi via AP
                <br />
                UL: From WiFi to ETH via AP
                <br />
                ULDL: Both UL and DL
              </FormHelperText>
            </FormControl>
            <TextField
              required
              fullWidth
              id='ap_command'
              name='ap_command'
              label='AP Command'
              type='text'
              autoComplete='off'
              value={config.ap_command}
              onChange={(e) => {
                updateConfig({ ...config, ap_command: e.target.value });
              }}
              helperText='This command will not effect the actual program, this is just for your reference.'
            />
            <TextField
              required
              fullWidth
              id='output'
              name='output'
              label='Output'
              type='text'
              autoComplete='off'
              value={config.options?.output || 'qbv'}
              onChange={(e) => {
                updateConfig({ ...config, options: { ...config.options, output: e.target.value } });
              }}
              helperText='The output folder for the results.'
            />
            <Box>
              <Button
                aria-label='Reset to default'
                variant='outlined'
                color='error'
                onClick={() => updateConfig(defaultConfig)}
              >
                Reset to default
              </Button>
            </Box>
          </Stack>
        </Collapse>
      </Card>
    </Grid2>
  );
};
