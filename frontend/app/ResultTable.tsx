import { Box, ButtonBase, Tooltip } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { TableCellProps } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import { ChangeEvent, useState } from 'react';
import { styled } from '@mui/material/styles';

export type CommandResultType = {
  [key: string]: {
    command: string;
    output: string;
  }[];
};

export const ResultTable = ({ result }: { result: CommandResultType }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const columns = Object.keys(result).map((key) => {
    return {
      id: key,
      label: key,
      minWidth: 170,
      align: 'center' as TableCellProps['align'],
    };
  });

  const rows = result[Object.keys(result)[0]].map((_, i) => i);

  return (
    <Box>
      <TableContainer sx={{ height: '100vh', maxHeight: 'calc(100vh - 254px)' }}>
        <Table stickyHeader aria-label='result table'>
          <TableHead>
            <TableRow>
              <TableCell align={'left'} style={{ maxWidth: 120 }}>
                Commands
              </TableCell>
              {columns.map((column) => (
                <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth }}>
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, i) => {
              if (result[columns[0].id][i].command === '') return;
              return (
                <TableRow hover role='checkbox' tabIndex={-1} key={`result-row-${i}`} sx={{ height: '1px' }}>
                  <TableCell align={'left'} style={{ maxWidth: 120, height: 'inherit' }}>
                    {result[columns[0].id][i].command}
                  </TableCell>
                  {columns.map((column) => {
                    const value = result[column.id][i].output;
                    // if % Invalid is in the value
                    const isErrorRow = value.includes('% Invalid');
                    return <CommandTableCell key={column.id} {...{ value, isErrorRow }} />;
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component='div'
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
};

const CodeButton = styled(ButtonBase)(({ theme }) => ({
  position: 'relative',
  padding: theme.spacing(1),
  height: '100%',
  width: '100%',
}));

const CommandTableCell = ({ value, isErrorRow }: { value: string; isErrorRow: boolean }) => {
  const [toolTipTitle, setToolTipTitle] = useState('Copy to clipboard');
  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(value);

    setToolTipTitle('Copied to clipboard');
    setTimeout(() => {
      setToolTipTitle('Copy to clipboard');
    }, 1000);
  };
  return (
    <TableCell
      align='left'
      style={{
        verticalAlign: 'top',
        padding: 0,
        height: 'inherit',
      }}
      className={`hover:bg-sky-900/30 focus-within:bg-sky-900/30 transition-colors ${
        isErrorRow && 'bg-red-100 dark:bg-red-900/30'
      }`}
    >
      <Box className='h-full'>
        <Tooltip title={toolTipTitle} placement='top'>
          <CodeButton
            onClick={handleCopyToClipboard}
            color='inherit'
            className='grid place-items-start place-content-stretch'
          >
            <pre className='whitespace-pre-line hover:cursor-pointer text-left'>
              <code>{value}</code>
            </pre>
          </CodeButton>
        </Tooltip>
      </Box>
    </TableCell>
  );
};