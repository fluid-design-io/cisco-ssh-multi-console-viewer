import {
  Alert,
  Button,
  Checkbox,
  ClickAwayListener,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListSubheader,
  Popover,
  Slide,
  Snackbar,
  Stack,
} from '@mui/material';
import { Fragment, useEffect, useRef, useState } from 'react';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Paper from '@mui/material/Paper';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Typography from '@mui/material/Typography';
import DeleteIcon from '@mui/icons-material/Delete';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import * as FileSaver from 'file-saver';
import JSZip from 'jszip';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export const ResultOptions = ({ result, onClearResult }: { result: any; onClearResult: () => void }) => {
  const devices = Object.keys(result);
  const [isOpen, setIsOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [exportFormat, setExportFormat] = useState('txt');
  const [openToast, setOpenToast] = useState(false);
  const exportButtonRef = useRef<HTMLButtonElement>(null);
  const [checkedOutputs, setCheckedOutputs] = useState<string[]>(devices);
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleToggleOutputs = (value: string) => () => {
    const currentIndex = checkedOutputs.indexOf(value);
    const newChecked = [...checkedOutputs];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setCheckedOutputs(newChecked);
  };

  const handleChangeExportFormat = (event: React.ChangeEvent<HTMLInputElement>) => {
    setExportFormat((event.target as HTMLInputElement).value);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if ((e.key === 'e' && e.ctrlKey) || (e.key === 'e' && e.metaKey)) {
      exportButtonRef.current?.click();
    }
  };

  const exportMultipleFiles = async (files: { name: string; content: string }[]) => {
    console.log(`Saving ${files.length} files`);
    // create a new JSZip instance
    const zip = new JSZip();
    // add each file to the zip
    files.map((f) => zip.file(f.name, f.content));
    // generate the zip file as a blob
    const blob = await zip.generateAsync({ type: 'blob' });
    // prompt the user to save the file
    FileSaver.saveAs(blob, 'files.zip');
  };

  const EXPORT_TYPES = {
    txt: 'text/plain:charset=utf-8',
    json: 'application/json;charset=utf-8',
    csv: 'text/csv;charset=utf-8',
  };

  type ExportFormat = keyof typeof EXPORT_TYPES;

  const handleExport = async () => {
    const files = [] as { name: string; blob: Blob; content: string }[];
    const currentDateTime = new Date().toISOString().replace(/:/g, '-');
    checkedOutputs.forEach((device) => {
      const filename = `${device}-${currentDateTime}.${exportFormat}`;
      let content = '';
      if (exportFormat === 'json') {
        content = JSON.stringify(result[device], null, 2);
      } else if (exportFormat === 'txt') {
        result[device].forEach((res: any) => {
          if (res.command !== '') {
            content += `\n
!===================================
!${res.command}
!===================================\n
${res.output}
\n
        `;
          }
        });
      } else if (exportFormat === 'csv') {
        content = 'command,output\n';
        result[device].forEach((res: any) => {
          const command = JSON.stringify(res.command);
          const output = JSON.stringify(res.output);
          content += `${command},${output}\n`;
        });
      }
      const blob = new Blob([content], { type: EXPORT_TYPES[exportFormat as ExportFormat] });
      files.push({ name: filename, blob, content });
    });

    if (files.length === 1) {
      FileSaver.saveAs(files[0].blob, files[0].name);
    }
    if (files.length > 1) {
      await exportMultipleFiles(files);
    }
    setOpenToast(true);
    handleCloseModal();
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <Fragment>
      <Button color='inherit' onClick={handleOpenModal} ref={exportButtonRef}>
        Export
      </Button>
      <IconButton ref={buttonRef} onClick={() => setIsOpen(true)}>
        <MoreVertIcon />
      </IconButton>
      <Popover
        open={isOpen}
        anchorEl={buttonRef.current}
        // onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        sx={{
          width: '100%',
          maxWidth: 760,
        }}
      >
        <ClickAwayListener onClickAway={() => setIsOpen(false)}>
          <Paper sx={{ width: 320, maxWidth: '100%' }}>
            <MenuList>
              {/*  <MenuItem>
                <ListItemIcon>
                  <ContentCut fontSize='small' />
                </ListItemIcon>
                <ListItemText>Cut</ListItemText>
                <Typography variant='body2' color='text.secondary'>
                  ⌘X
                </Typography>
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <ContentCopy fontSize='small' />
                </ListItemIcon>
                <ListItemText>Copy</ListItemText>
                <Typography variant='body2' color='text.secondary'>
                  ⌘C
                </Typography>
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <ContentPaste fontSize='small' />
                </ListItemIcon>
                <ListItemText>Paste</ListItemText>
                <Typography variant='body2' color='text.secondary'>
                  ⌘V
                </Typography>
              </MenuItem>
              <Divider /> */}
              <MenuItem
                className='text-red-400'
                onClick={() => {
                  onClearResult();
                  setIsOpen(false);
                  localStorage.removeItem('command_result');
                }}
                disabled={Object.keys(result).length === 0}
              >
                <ListItemIcon>
                  <DeleteIcon fontSize='small' className='fill-red-400' />
                </ListItemIcon>
                <ListItemText>Clear Results</ListItemText>
              </MenuItem>
            </MenuList>
          </Paper>
        </ClickAwayListener>
      </Popover>
      <Modal
        aria-labelledby='transition-modal-title'
        aria-describedby='transition-modal-description'
        open={openModal}
        onClose={handleCloseModal}
        closeAfterTransition
        slots={{
          backdrop: Backdrop,
        }}
      >
        <Fade in={openModal}>
          <Box sx={style}>
            <Typography id='transition-modal-title' variant='h6' component='h2'>
              Export
            </Typography>
            <Typography id='transition-modal-description' sx={{ mt: 2 }}>
              Select the outputs you want to export, and the format you want to export them in.
            </Typography>

            <List
              subheader={
                <ListSubheader component='div' id='filter-by-cateogry-list' sx={{ mx: -2 }}>
                  Outputs
                </ListSubheader>
              }
              sx={{
                width: '100%',
                p: 0,
              }}
              aria-label='filter by category'
            >
              {devices.map((device) => (
                <ListItem key={`export-${device}`} sx={{ p: 0 }}>
                  <ListItemButton role={undefined} onClick={handleToggleOutputs(device)} dense sx={{ mx: -2 }}>
                    <ListItemIcon>
                      <Checkbox
                        edge='start'
                        checked={checkedOutputs.indexOf(device) !== -1}
                        tabIndex={-1}
                        disableRipple
                        inputProps={{ 'aria-labelledby': device }}
                      />
                    </ListItemIcon>
                    <ListItemText id={device} primary={device} className='capitalize' />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
            <FormControl>
              <FormLabel id='row-radio-buttons-group-label'>Format</FormLabel>
              <RadioGroup
                row
                aria-labelledby='row-radio-buttons-group-label'
                name='export-format'
                value={exportFormat}
                onChange={handleChangeExportFormat}
              >
                <FormControlLabel value='txt' control={<Radio />} label='Text' />
                <FormControlLabel value='json' control={<Radio />} label='JSON' />
                <FormControlLabel value='csv' control={<Radio />} label='CSV' />
              </RadioGroup>
            </FormControl>
            <Stack direction='row' justifyContent='space-between' mx={-1} mt={1}>
              <Button color='inherit' onClick={() => setOpenModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleExport} disabled={checkedOutputs.length === 0}>
                Export
              </Button>
            </Stack>
          </Box>
        </Fade>
      </Modal>
      <Snackbar open={openToast} onClose={() => setOpenToast(false)} autoHideDuration={3800}>
        <Alert onClose={() => setOpenToast(false)} severity='success' sx={{ width: '100%' }}>
          Export successful!
        </Alert>
      </Snackbar>
    </Fragment>
  );
};
