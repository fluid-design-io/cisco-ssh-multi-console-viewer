'use client';

import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Collapse,
  Fade,
  FormHelperText,
  LinearProgress,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import clsx from 'clsx';
import { Fragment, useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import InsertDriveFileTwoToneIcon from '@mui/icons-material/InsertDriveFileTwoTone';
import * as FileSaver from 'file-saver';

export default function Page() {
  const [fileRejected, setFileRejected] = useState(false);
  const [fileAccepted, setFileAccepted] = useState(false);
  const [acceptedFiles, setAcceptedFiles] = useState<File[]>([]);
  const [newImageVersion, setNewImageVersion] = useState('17.9.0.0');
  const [newFileName, setNewFileName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const versionTemplate = `image_family: ap1g6a
ws_management_version: ${newImageVersion}
info_end:
altboot_fallback: 1`;
  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    // Handle accepted files
    setFileAccepted(true);
    setFileRejected(false);
    //Do something with the accepted files
    setAcceptedFiles(acceptedFiles);
  }, []);

  const onDropRejected = useCallback(() => {
    // Handle rejected files
    setFileAccepted(false);
    setFileRejected(true);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected,
    accept: {
      'application/tar': ['.tar', '.tar.gz', '.tgz'],
    },
    maxFiles: 1,
  });

  const todayLocalized = new Date()
    .toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    })
    .replace(/ /g, '-')
    .replace(/,/g, '');
  useEffect(() => {
    // Set default file name with todayLocalized + newImageVersion
    setNewFileName(`${todayLocalized}-${newImageVersion}.tar`);
  }, [newImageVersion, todayLocalized]);

  const handleForm = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', acceptedFiles[0]);
    formData.append('newImageVersion', newImageVersion);
    formData.append('newFileName', newFileName);
    formData.append('versionTemplate', versionTemplate);

    try {
      const res = await axios.post('http://localhost:8000/ap-convert', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        responseType: 'arraybuffer',
      });
      // We got the application/octet-stream, so we can download it
      const blob = new Blob([res.data], { type: 'application/tar;charset=utf-8' });
      FileSaver.saveAs(blob, newFileName);
      setIsComplete(true);
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };
  return (
    <Box component='main' sx={{ p: 2 }} className='max-w-[90rem] mx-auto'>
      <Collapse in={isComplete}>
        <Alert
          variant='filled'
          severity='success'
          sx={{ mb: 2 }}
          onClose={() => {
            setIsComplete(false);
          }}
        >
          <AlertTitle>Success</AlertTitle>
          Your download is on the way!
        </Alert>
      </Collapse>
      <Grid2 container spacing={2} component='form' onSubmit={handleForm}>
        <Grid2 xs={12} md={6} lg={4} order={{ xs: '1', md: '0' }}>
          <Paper sx={{ p: 2 }}>
            <Stack spacing={2}>
              <Box>
                <TextField
                  required
                  fullWidth
                  id={`new-image-version`}
                  name={`new-image-version`}
                  label='New image version'
                  type='text'
                  autoComplete='off'
                  value={newImageVersion}
                  onChange={(e) => setNewImageVersion(e.target.value)}
                />
                <FormHelperText>E.g. 17.9.0.1</FormHelperText>
              </Box>

              <TextField
                required
                fullWidth
                id={`new-file-name`}
                name={`new-file-name`}
                label='File name'
                type='text'
                autoComplete='off'
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
              />
            </Stack>
            <Box mt={2}>
              <Typography variant='h6'>Preview</Typography>
              <Typography variant='inherit' color='text.secondary' component='pre'>
                {versionTemplate}
              </Typography>
            </Box>
            <Box flex={1} display='flex' justifyContent='flex-end' mt={2}>
              <LoadingButton
                type='submit'
                variant='contained'
                disabled={acceptedFiles.length === 0 || fileRejected}
                loading={isLoading}
              >
                Convert
              </LoadingButton>
            </Box>
          </Paper>
        </Grid2>
        <Grid2 xs={12} md={6} lg={8}>
          {isLoading && <LinearProgress />}
          <Stack spacing={2}>
            <Paper sx={{ p: 2 }}>
              <div
                {...getRootProps()}
                className={clsx(
                  'p-6',
                  'border-2 border-gray-600',
                  'border-dashed',
                  'rounded',
                  { 'border-red-600': fileRejected },
                  { 'border-green-600': fileAccepted }
                )}
              >
                <input {...getInputProps()} />
                {acceptedFiles.length === 0 &&
                  (isDragActive ? (
                    <p className='text-center text-gray-300'>Drop the files here ...</p>
                  ) : (
                    <p className='text-center text-gray-300'>Drag and drop some files here, or click to select files</p>
                  ))}
                {acceptedFiles.map((file) => (
                  <Fragment key={file.name}>
                    <Typography variant='h5'>{file.name}</Typography>
                    <Typography variant='body2' color='text.secondary'>
                      {Math.round((file.size / 1024 / 1024) * 100) / 100} MB
                    </Typography>
                    <Typography variant='caption' color='text.secondary'>
                      {new Date(file.lastModified).toLocaleString()}
                    </Typography>
                  </Fragment>
                ))}
              </div>
            </Paper>
            <Fade in={isComplete}>
              <Paper sx={{ p: 2 }}>
                <Stack direction='row' alignItems='center' spacing={1}>
                  <InsertDriveFileTwoToneIcon />
                  <Typography variant='h5'>{newFileName}</Typography>
                </Stack>
                <Box mt={2}>
                  <Button
                    href={`http://localhost:8000/download/${newFileName}?folder=output`}
                    variant='contained'
                    color='success'
                    disabled={acceptedFiles.length === 0 || fileRejected || !isComplete}
                  >
                    Download
                  </Button>
                </Box>
              </Paper>
            </Fade>
          </Stack>
        </Grid2>
      </Grid2>
    </Box>
  );
}
