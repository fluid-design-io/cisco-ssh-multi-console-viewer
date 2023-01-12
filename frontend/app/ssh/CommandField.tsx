/* eslint-disable react/display-name */
import {
  AppBar,
  Box,
  Button,
  Card,
  Checkbox,
  ClickAwayListener,
  Collapse,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Paper,
  Popover,
  Stack,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import Highlight from '@tiptap/extension-highlight';
import { Content, getMarkRange } from '@tiptap/core';
import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { forwardRef, useEffect, useRef, useState } from 'react';
import { Extension } from '@tiptap/core';
import { Plugin, PluginKey, TextSelection } from 'prosemirror-state';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import Placeholder from '@tiptap/extension-placeholder';
import ViewListIcon from '@mui/icons-material/ViewList';
import SendIcon from '@mui/icons-material/Send';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';
import { Virtuoso } from 'react-virtuoso';
import { getCookie, setCookie } from 'cookies-next';
import { COMMAND_TYPE, DEVICES, presetCommands } from 'lib/presetCommands';
import { useCollapsed } from 'lib/useStore';

const convertArray = (arr: string[] | string) => {
  if (typeof arr === 'string') {
    return arr + '\n';
  }
  return arr.join('\n');
};

const inserCommand = ({ command, commandReplace }: { command: string | string[]; commandReplace: any }) => {
  const string = convertArray(command);
  const lines = string.split('\n');
  const regex = /{{(.*?)}}/g;

  const content = [] as Content[];

  // analyze the command using regex for each line

  lines.forEach((line) => {
    const paragraph = {
      type: 'paragraph',
      content: [] as any,
    };
    const matches = line.match(regex);
    if (matches) {
      // if there is a match, split the match and the text before and after the match
      // Then, make the match as a mark
      // Finally, push the text before and after the match as a text

      const stringArray = line.split(regex);

      for (let i = 0; i < stringArray.length; i++) {
        const text = stringArray[i];
        if (matches.includes(`{{${text}}}`)) {
          paragraph.content.push({
            type: 'text',
            text: text,
            marks: [
              {
                type: 'highlight',
                attrs: {
                  description: commandReplace?.[text].description,
                  color: commandReplace?.[text].color,
                },
              },
            ],
          });
        } else if (text) {
          paragraph.content.push({
            type: 'text',
            text: text,
          });
        }
      }
      paragraph.content.push({
        type: 'text',
        text: ' ',
      });
    } else {
      paragraph.content.push({
        type: 'text',
        text: line,
      });
    }
    content.push(paragraph);
  });

  return content;
};
const CommandsRow = ({ command, editor, index }: { command: any; editor: any; index: number }) => {
  return (
    <ListItem key={`${command.name}.${index}`} component='div' disablePadding>
      <ListItemButton
        onClick={() =>
          editor
            ?.chain()
            .focus()
            .insertContent(
              inserCommand({
                command: command.command,
                commandReplace: command.commandReplace as any,
              })
            )
            .run()
        }
      >
        <ListItemText primary={command.name} secondary={command.description} />
      </ListItemButton>
    </ListItem>
  );
};
export const CommandField = forwardRef(
  (
    {
      onCommandUpdate,
    }: {
      onCommandUpdate: (text: string) => void;
    },
    ref: any
  ) => {
    const { collapsed } = useCollapsed();
    const [searchCommand, setSearchCommand] = useState('');
    const searchRef = useRef<HTMLInputElement>(null);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const filterButtonRef = useRef<HTMLButtonElement>(null);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filterOptions, setFilterOptions] = useState({
      category: Object.values(COMMAND_TYPE),
      device: Object.values(DEVICES),
    });
    const [helperText, setHelperText] = useState('');
    const [checked, setChecked] = useState<string[]>([]);

    const ClickMarkEvent = Extension.create({
      name: 'clickMarkEvent',
      addProseMirrorPlugins() {
        return [
          new Plugin({
            key: new PluginKey('clickMarkEvent'),
            props: {
              handleClick(view, pos, event) {
                const range = getMarkRange(view.state.doc.resolve(pos), view.state.schema.marks.highlight);
                if (!range) return false;

                const $start = view.state.doc.resolve(range.from);
                const $end = view.state.doc.resolve(range.to);
                const transaction = view.state.tr.setSelection(new TextSelection($start, $end));
                view.dispatch(transaction);
                // get current active node
                const node = view.state.doc.nodeAt(pos);
                if (node) {
                  setHelperText(node.marks?.[0]?.attrs?.description || 'No description found');
                }
                return true;
              },
            },
          }),
        ];
      },
    });
    const editor = useEditor({
      extensions: [
        StarterKit,
        Placeholder.configure({
          placeholder: 'Type a command here...',
        }),
        Highlight.configure({
          multicolor: true,
        }).extend({
          addAttributes() {
            return {
              description: {
                default: null,
                // Take the attribute values
                renderHTML: (attributes) => {
                  // … and return an object with HTML attributes.
                  return {
                    'data-description': attributes?.description || 'No description found',
                  };
                },
              },
              color: {
                default: '#3e4b54',
                // Take the attribute values
                renderHTML: (attributes) => {
                  // … and return an object with HTML attributes.
                  return {
                    style: `background-color: ${attributes.color}; border-radius: 0.25rem; padding: 0.25rem 0.35rem; font-style: italic;`,
                    class: 'selection:bg-fuchsia-300 selection:text-fuchsia-900 text-white/90',
                  };
                },
              },
            };
          },
        }),
        ClickMarkEvent,
      ],
      editorProps: {
        attributes: {
          class: 'min-h-[215px] px-4 py-1.5 outline-none !m-0 focus:border focus:border-blue-500 h-full',
          'data-gramm': 'false',
          'data-gramm_editor': 'false',
          'data-enable-grammarly': 'false',
        },
      },
      content: getCookie('commands')?.toString() || '',
      onUpdate: ({ editor }) => {
        const text = editor.getText();
        const cookieText = text.replace(/\n/g, '<br />');
        setCookie('commands', cookieText);
        onCommandUpdate(text);
      },
    });

    const handleToggle = (value: string) => () => {
      const currentIndex = checked.indexOf(value);
      const newChecked = [...checked];

      if (currentIndex === -1) {
        newChecked.push(value);
      } else {
        newChecked.splice(currentIndex, 1);
      }

      setChecked(newChecked);
      setCookie('commandFilterChecked', newChecked.join(','));
    };

    useEffect(() => {
      const commandFilterCheckedCookie = getCookie('commandFilterChecked') as string | undefined;
      if (commandFilterCheckedCookie) {
        setChecked(commandFilterCheckedCookie.split(','));
      } else {
        const commandFilterValues = Object.values(COMMAND_TYPE).concat(Object.values(DEVICES));
        setChecked(commandFilterValues);
      }
    }, []);

    const commands = presetCommands
      .filter(
        (command) =>
          command.name.toLowerCase().includes(searchCommand.toLowerCase()) ||
          command.description.toLowerCase().includes(searchCommand.toLowerCase())
      )
      .filter((command) => {
        if (
          checked.includes(command.type as string) &&
          checked.some((c) => command.availableDevices.includes(c as string))
        ) {
          return true;
        }
      });
    return (
      <Grid2 container p={0}>
        <Grid2 xs={12} md={collapsed ? 12 : 4} order={collapsed ? 1 : 0}>
          <Card sx={{ width: '100%' }} className='relative'>
            <AppBar elevation={2} position='sticky' className='inset-x-0 z-[1] top-0' color='inherit'>
              <Toolbar variant='dense'>
                <ViewListIcon />
                <Typography variant='h6' component='div' sx={{ flexGrow: 1, pl: 1 }}>
                  Templates
                </Typography>
                <Box sx={{ flexGrow: 1 }} />
                <Box className='flex'>
                  <Collapse in={isSearchFocused} orientation='horizontal'>
                    <TextField
                      hiddenLabel
                      id='search-command'
                      variant='filled'
                      size='small'
                      value={searchCommand}
                      placeholder='Search command...'
                      onChange={(e) => setSearchCommand(e.target.value)}
                      type='search'
                      inputRef={searchRef}
                      onBlur={() => {
                        setIsSearchFocused(false);
                      }}
                    />
                  </Collapse>
                  <IconButton
                    ref={filterButtonRef}
                    id='filter-button'
                    aria-controls={isFilterOpen ? 'filter-menu' : undefined}
                    aria-expanded={isFilterOpen ? 'true' : undefined}
                    aria-haspopup='true'
                    onClick={() => {
                      setIsFilterOpen(!isFilterOpen);
                    }}
                    size='large'
                    edge='end'
                    sx={{
                      display: isSearchFocused ? 'none' : 'inline-flex',
                    }}
                  >
                    <FilterListIcon />
                  </IconButton>
                  <IconButton
                    id='search-button-clear'
                    onClick={() => {
                      setSearchCommand('');
                    }}
                    size='large'
                    edge='end'
                    sx={{
                      display: isSearchFocused ? 'inline-flex' : 'none',
                    }}
                  >
                    <ClearIcon />
                  </IconButton>

                  <Popover
                    open={isFilterOpen}
                    anchorEl={filterButtonRef.current}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'left',
                    }}
                    sx={{
                      width: '100%',
                      maxWidth: 520,
                    }}
                  >
                    <ClickAwayListener onClickAway={() => setIsFilterOpen(false)}>
                      <Stack direction='row' spacing={2} sx={{ bgcolor: 'background.paper', width: '100vw' }}>
                        <List
                          subheader={
                            <ListSubheader component='div' id='filter-by-cateogry-list'>
                              Filter by category
                            </ListSubheader>
                          }
                          sx={{
                            width: '100%',
                            maxWidth: 200,
                            bgcolor: 'background.paper',
                            maxHeight: 360,
                            overflow: 'auto',
                          }}
                          aria-label='filter by category'
                        >
                          {filterOptions.category.map((value) => {
                            return (
                              <ListItem key={value} sx={{ p: 0 }}>
                                <ListItemButton role={undefined} onClick={handleToggle(value)} dense>
                                  <ListItemIcon>
                                    <Checkbox
                                      edge='start'
                                      checked={checked.indexOf(value) !== -1}
                                      tabIndex={-1}
                                      disableRipple
                                      inputProps={{ 'aria-labelledby': value }}
                                    />
                                  </ListItemIcon>
                                  <ListItemText id={value} primary={value} className='capitalize' />
                                </ListItemButton>
                              </ListItem>
                            );
                          })}
                        </List>
                        <List
                          subheader={
                            <ListSubheader component='div' id='filter-by-device-list'>
                              Filter by device
                            </ListSubheader>
                          }
                          sx={{
                            width: '100%',
                            maxWidth: 320,
                            bgcolor: 'background.paper',
                            maxHeight: 360,
                            overflow: 'auto',
                          }}
                          aria-label='filter by category'
                        >
                          {filterOptions.device.map((value) => {
                            return (
                              <ListItem key={value} sx={{ p: 0 }}>
                                <ListItemButton role={undefined} onClick={handleToggle(value)} dense>
                                  <ListItemIcon>
                                    <Checkbox
                                      edge='start'
                                      checked={checked.indexOf(value) !== -1}
                                      tabIndex={-1}
                                      disableRipple
                                      inputProps={{ 'aria-labelledby': value }}
                                    />
                                  </ListItemIcon>
                                  <ListItemText id={value} primary={value} className='capitalize' />
                                </ListItemButton>
                              </ListItem>
                            );
                          })}
                        </List>
                      </Stack>
                    </ClickAwayListener>
                  </Popover>
                  {!isSearchFocused && (
                    <IconButton
                      aria-label='search'
                      onClick={() => {
                        setIsSearchFocused(true);
                        setTimeout(() => {
                          searchRef.current?.focus();
                        }, 200);
                      }}
                      size='large'
                      edge='end'
                    >
                      <SearchIcon />
                    </IconButton>
                  )}
                </Box>
              </Toolbar>
            </AppBar>
            <Box sx={{ width: '100%', height: 320 }}>
              <Virtuoso
                style={{ height: '400px' }}
                totalCount={commands.length}
                itemContent={(index) => <CommandsRow command={commands[index]} editor={editor} index={index} />}
              />
            </Box>
          </Card>
        </Grid2>
        <Grid2 xs={12} md={collapsed ? 12 : 8}>
          <Card
            sx={{
              width: '100%',
              height: '100%',
              '& > div[aria-expanded]': { height: '100%' },
              position: 'relative',
              overflow: 'hidden',
              pt: 5,
            }}
          >
            <AppBar elevation={2} position='absolute' className='z-[1]' color='inherit'>
              <Toolbar variant='dense'>
                <KeyboardIcon />
                <Typography variant='h6' component='div' sx={{ flexGrow: 0, px: 1 }}>
                  Commands
                </Typography>
                <Button
                  color='inherit'
                  variant='text'
                  onClick={() => {
                    editor?.chain().focus().clearContent().run();
                  }}
                  sx={{
                    ':hover': {
                      bgcolor: 'error.main',
                      color: 'white',
                    },
                    ':active': {
                      bgcolor: 'error.dark',
                      color: 'white',
                    },
                  }}
                >
                  Clear
                </Button>
                <Box sx={{ flexGrow: 1 }} />

                <Tooltip title='Send command' placement='top'>
                  <IconButton aria-label='Send' size='large' edge='end' color='inherit' type='submit'>
                    <SendIcon />
                  </IconButton>
                </Tooltip>
              </Toolbar>
            </AppBar>
            {editor && (
              <BubbleMenu
                editor={editor}
                tippyOptions={{ duration: 300, delay: [500, null], animation: 'fade' }}
                shouldShow={({ editor, view, state, oldState, from, to }) => {
                  return editor.isActive('highlight');
                }}
              >
                <Paper elevation={16} sx={{ py: 1, px: 2 }}>
                  <Typography variant='caption' sx={{ color: 'text.secondary' }}>
                    {helperText}
                  </Typography>
                </Paper>
              </BubbleMenu>
            )}
            <EditorContent editor={editor} ref={ref} allowFullScreen />
          </Card>
        </Grid2>
      </Grid2>
    );
  }
);
