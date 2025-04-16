import React, { useState, useEffect } from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  Container,
  Paper,
  Grid,
  Card,
  CardContent,
  Chip,
  Avatar,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useMediaQuery,
  CssBaseline,
  Badge
} from '@mui/material';
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  Dashboard as DashboardIcon,
  Settings as SettingsIcon,
  People as PeopleIcon,
  Assessment as AssessmentIcon,
  Build as BuildIcon,
  Add as AddIcon,
  AccessTime as AccessTimeIcon,
  Event as EventIcon,
  EventNote as EventNoteIcon,
  EventBusy as EventBusyIcon,
  Logout as LogoutIcon,
  CalendarMonth as CalendarMonthIcon
} from '@mui/icons-material';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import apiClient from '../utils/apiClient';
import CustomDateRangePicker from './CustomDateRangePicker';

// Styled components
const drawerWidth = 240;

const AppBarStyled = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerStyled = styled(Drawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(6),
        },
      }),
    },
  }),
);

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}));

// Create a theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#f50057',
    },
    success: {
      main: '#4caf50',
    },
    warning: {
      main: '#ff9800',
    },
    info: {
      main: '#03a9f4'
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    text: {
      primary: '#263238',
      secondary: '#546e7a',
    },
  },
  typography: {
    fontFamily: [
      'Poppins',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif'
    ].join(','),
    fontSize: 12, // Reduce base font size
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          textTransform: 'none',
          fontWeight: 600,
          padding: '3px 8px',
          fontSize: '0.7rem',
          minWidth: '60px',
          lineHeight: 1.2,
          boxShadow: 'none',
        },
        contained: {
          boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
          '&:hover': {
            boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        elevation1: {
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
        },
        root: {
          borderRadius: '4px',
        }
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          overflow: 'hidden',
          border: '1px solid rgba(0,0,0,0.03)',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: '6px 8px',
          fontSize: '0.7rem',
          lineHeight: 1.2,
          whiteSpace: 'nowrap',
          borderColor: 'rgba(224, 224, 224, 0.4)',
        },
        head: {
          fontWeight: 600,
          backgroundColor: '#f9f9f9',
          paddingTop: 6,
          paddingBottom: 6,
          color: '#546e7a',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          height: '20px',
          transition: 'all 0.2s',
          '&:hover': {
            boxShadow: '0px 1px 2px rgba(0,0,0,0.1)',
          }
        },
        label: {
          fontSize: '0.65rem',
          padding: '0 6px',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          padding: 6,
          transition: 'all 0.2s',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
          }
        },
        sizeSmall: {
          padding: 4,
        },
      },
    },
    MuiSvgIcon: {
      styleOverrides: {
        fontSizeSmall: {
          fontSize: '1rem',
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          minHeight: '48px !important',
          padding: '0 8px !important',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          paddingTop: 6,
          paddingBottom: 6,
          transition: 'all 0.2s',
          '&:hover': {
            backgroundColor: 'rgba(25, 118, 210, 0.08)',
          },
          '&.Mui-selected': {
            backgroundColor: 'rgba(25, 118, 210, 0.12)',
            '&:hover': {
              backgroundColor: 'rgba(25, 118, 210, 0.18)',
            }
          }
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingLeft: '12px !important',
          paddingRight: '12px !important',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: 'rgba(0, 0, 0, 0.06)',
        }
      }
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.01) !important',
          }
        }
      }
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          fontWeight: 600,
        }
      }
    }
  },
});

const MuiDashboard = () => {
  const [open, setOpen] = useState(true);
  const [dateRange, setDateRange] = useState([new Date(), new Date()]);
  const [tasks, setTasks] = useState([]);
  const [workingHours, setWorkingHours] = useState({ total: 8, planned: 0, actual: 0 });
  const [showModal, setShowModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Automatically collapse sidebar on mobile
  useEffect(() => {
    if (isMobile) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  }, [isMobile]);

  const fetchTasks = async () => {
    try {
      let url = '/tasks';
      
      if (dateRange[0] && dateRange[1]) {
        const formattedStartDate = dateRange[0].toISOString().split('T')[0];
        const formattedEndDate = dateRange[1].toISOString().split('T')[0];
        url += `?startDate=${formattedStartDate}&endDate=${formattedEndDate}`;
      } else if (dateRange[0]) {
        url += `?date=${dateRange[0].toISOString().split('T')[0]}`;
      }
      
      const response = await apiClient.get(url);
      console.log("Tasks Response:", response.data);
      setTasks(response.data.tasks.tasks || []);
      
      const actual = (response.data.tasks.tasks || []).reduce(
        (total, task) => total + (parseFloat(task.hours_spent) || 0), 
        0
      );
      setWorkingHours(prev => ({...prev, actual}));
      
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Failed to load tasks");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [dateRange]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleDateRangeSelect = (start, end) => {
    setDateRange([start, end]);
    setShowDatePicker(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        
        {/* App Bar */}
        <AppBarStyled position="absolute" open={open} elevation={1}>
          <Toolbar sx={{ 
            minHeight: '40px !important', 
            backgroundImage: 'linear-gradient(90deg, #1976d2 0%, #2196f3 100%)'
          }}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerToggle}
              sx={{ marginRight: '10px', ...(open && { display: 'none' }), p: 0.5 }}
              size="small"
            >
              <MenuIcon fontSize="small" />
            </IconButton>
            
            <Typography component="h1" variant="subtitle1" color="inherit" noWrap sx={{ flexGrow: 1, fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.25px' }}>
              Task Management
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="caption" color="inherit" sx={{ mr: 1, fontSize: '0.65rem', opacity: 0.9 }}>
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric'
                })}
              </Typography>
              
              <Button 
                color="inherit" 
                size="small"
                sx={{ 
                  borderRadius: 4,
                  textTransform: 'none',
                  fontWeight: 600,
                  backgroundColor: 'rgba(255, 255, 255, 0.12)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.25)',
                  },
                  py: 0.25,
                  px: 1,
                  fontSize: '0.65rem',
                  display: 'flex',
                  alignItems: 'center',
                  height: '20px'
                }}
                endIcon={<LogoutIcon fontSize="small" sx={{ fontSize: '0.9rem', ml: 0.25 }} />}
              >
                Logout
              </Button>
            </Box>
          </Toolbar>
        </AppBarStyled>
        
        {/* Sidebar */}
        <DrawerStyled variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              px: 1.5,
              minHeight: '48px !important'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <StyledBadge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                variant="dot"
              >
                <Avatar 
                  alt="Avinash" 
                  src="/static/images/avatar/1.jpg" 
                  sx={{ width: 24, height: 24, mr: 1.5 }}
                />
              </StyledBadge>
              <Typography variant="body2" fontWeight="600" fontSize="0.75rem">
                Avinash Gautam
              </Typography>
            </Box>
            <IconButton onClick={handleDrawerToggle} size="small">
              <ChevronLeftIcon fontSize="small" />
            </IconButton>
          </Toolbar>
          <Divider />
          <List component="nav" dense sx={{ py: 0.5 }}>
            <ListItemButton selected dense sx={{ py: 0.75 }}>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <DashboardIcon color="primary" fontSize="small" />
              </ListItemIcon>
              <ListItemText 
                primary="Dashboard" 
                primaryTypographyProps={{ 
                  fontSize: '0.75rem',
                  noWrap: true,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }} 
                sx={{ opacity: open ? 1 : 0 }}
              />
            </ListItemButton>
            <ListItemButton dense sx={{ py: 0.75 }}>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <AssessmentIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText 
                primary="Reports" 
                primaryTypographyProps={{ 
                  fontSize: '0.75rem',
                  noWrap: true,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
                sx={{ opacity: open ? 1 : 0 }}
              />
            </ListItemButton>
            <ListItemButton dense sx={{ py: 0.75 }}>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <PeopleIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText 
                primary="Users" 
                primaryTypographyProps={{ 
                  fontSize: '0.75rem',
                  noWrap: true,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
                sx={{ opacity: open ? 1 : 0 }}
              />
            </ListItemButton>
            <ListItemButton dense sx={{ py: 0.75 }}>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <BuildIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText 
                primary="Configuration" 
                primaryTypographyProps={{ 
                  fontSize: '0.75rem',
                  noWrap: true,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
                sx={{ opacity: open ? 1 : 0 }}
              />
            </ListItemButton>
            <Divider sx={{ my: 0.5 }} />
            <ListItemButton dense sx={{ py: 0.75 }}>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <SettingsIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText 
                primary="Settings" 
                primaryTypographyProps={{ 
                  fontSize: '0.75rem',
                  noWrap: true,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
                sx={{ opacity: open ? 1 : 0 }}
              />
            </ListItemButton>
          </List>
        </DrawerStyled>
        
        {/* Main Content */}
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) => theme.palette.background.default,
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
            pt: '40px',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Container 
            maxWidth="lg" 
            sx={{ 
              mt: 1.5, 
              mb: 1.5, 
              px: { xs: 1, sm: 1.5, md: 2 }, 
              display: 'flex', 
              flexDirection: 'column', 
              flexGrow: 1 
            }}
          >
            {/* Welcome Banner */}
            <Paper
              elevation={1}
              sx={{
                p: 1.5,
                mb: 1.5,
                display: 'flex',
                flexDirection: { xs: 'row', sm: 'row' },
                justifyContent: 'space-between',
                alignItems: 'center',
                borderRadius: 1,
                backgroundColor: 'primary.main',
                color: 'white',
                backgroundImage: 'linear-gradient(135deg, #1976d2 0%, #2196f3 100%)',
                position: 'relative',
                overflow: 'hidden',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  backgroundImage: 'radial-gradient(circle at 20% 150%, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 60%)',
                  pointerEvents: 'none'
                }
              }}
            >
              <Box>
                <Typography variant="subtitle2" fontWeight="600" fontSize="0.8rem">
                  {getGreeting()}, Avinash
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.85, fontSize: '0.65rem', display: 'block', mt: 0.25 }}>
                  {new Date().toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric'
                  })}
                </Typography>
              </Box>
              <Button
                variant="contained"
                size="small"
                startIcon={<AddIcon fontSize="small" sx={{ fontSize: '0.9rem' }} />}
                sx={{ 
                  bgcolor: 'white', 
                  color: 'primary.dark',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.9)',
                  },
                  py: 0.5,
                  px: 1.5,
                  height: '24px',
                  fontSize: '0.7rem',
                  borderRadius: 4
                }}
                onClick={() => setShowModal(true)}
              >
                Add Task
              </Button>
            </Paper>

            {/* Stats Cards */}
            <Grid container spacing={1.5} sx={{ mb: 1.5 }}>
              <Grid item xs={4} sm={3} md={2.5}>
                <Card elevation={0} sx={{ transition: 'all 0.2s', '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 4px 8px rgba(0,0,0,0.05)' } }}>
                  <CardContent sx={{ display: 'flex', alignItems: 'center', p: 1, '&:last-child': { pb: 1 } }}>
                    <Avatar sx={{ bgcolor: 'primary.main', width: 18, height: 18, mr: 0.75 }}>
                      <AccessTimeIcon sx={{ fontSize: 12 }} />
                    </Avatar>
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.6rem', display: 'block', lineHeight: 1 }}>
                        Total
                      </Typography>
                      <Typography variant="subtitle2" fontWeight="bold" fontSize="0.7rem">
                        {workingHours.total} hrs
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={4} sm={3} md={2.5}>
                <Card elevation={0} sx={{ transition: 'all 0.2s', '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 4px 8px rgba(0,0,0,0.05)' } }}>
                  <CardContent sx={{ display: 'flex', alignItems: 'center', p: 1, '&:last-child': { pb: 1 } }}>
                    <Avatar sx={{ bgcolor: 'info.main', width: 18, height: 18, mr: 0.75 }}>
                      <EventNoteIcon sx={{ fontSize: 12 }} />
                    </Avatar>
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.6rem', display: 'block', lineHeight: 1 }}>
                        Planned
                      </Typography>
                      <Typography variant="subtitle2" fontWeight="bold" fontSize="0.7rem">
                        {workingHours.planned} hrs
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={4} sm={3} md={2.5}>
                <Card elevation={0} sx={{ transition: 'all 0.2s', '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 4px 8px rgba(0,0,0,0.05)' } }}>
                  <CardContent sx={{ display: 'flex', alignItems: 'center', p: 1, '&:last-child': { pb: 1 } }}>
                    <Avatar 
                      sx={{ 
                        bgcolor: workingHours.actual > 0 ? 'success.main' : 'warning.main', 
                        width: 18, 
                        height: 18, 
                        mr: 0.75 
                      }}
                    >
                      {workingHours.actual > 0 ? (
                        <EventIcon sx={{ fontSize: 12 }} />
                      ) : (
                        <EventBusyIcon sx={{ fontSize: 12 }} />
                      )}
                    </Avatar>
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.6rem', display: 'block', lineHeight: 1 }}>
                        Actual
                      </Typography>
                      <Typography variant="subtitle2" fontWeight="bold" fontSize="0.7rem">
                        {workingHours.actual} hrs
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Date Range Picker and Task List */}
            <Paper elevation={1} sx={{ mb: 1.5, borderRadius: 1, overflow: 'hidden', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ p: 1.25, borderBottom: '1px solid rgba(0,0,0,0.05)', backgroundColor: 'rgba(0,0,0,0.01)' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="subtitle2" fontWeight="600" fontSize="0.75rem" sx={{ color: 'text.primary' }}>
                    My List
                    <Chip 
                      label={tasks.length} 
                      size="small" 
                      color="primary" 
                      sx={{ ml: 0.5, fontWeight: 'bold', height: 18, '& .MuiChip-label': { px: 1, fontSize: '0.65rem' } }} 
                    />
                  </Typography>
                  <Box>
                    <Button 
                      variant="outlined" 
                      size="small" 
                      sx={{ mr: 0.5, py: 0, px: 1, minWidth: 0, fontSize: '0.65rem', height: '20px', color: 'text.secondary', borderColor: 'rgba(0,0,0,0.12)' }}
                    >
                      Export
                    </Button>
                    <Button 
                      variant="outlined" 
                      size="small"
                      sx={{ py: 0, px: 1, minWidth: 0, fontSize: '0.65rem', height: '20px', color: 'text.secondary', borderColor: 'rgba(0,0,0,0.12)' }}
                    >
                      Print
                    </Button>
                  </Box>
                </Box>
                
                <Box sx={{ position: 'relative' }}>
                  <Box
                    sx={{
                      border: '1px solid rgba(0, 0, 0, 0.12)',
                      borderRadius: 4,
                      p: 0.5,
                      display: 'flex',
                      alignItems: 'center',
                      cursor: 'pointer',
                      '&:hover': {
                        borderColor: 'primary.main',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                      },
                      maxWidth: '180px',
                      backgroundColor: '#fff'
                    }}
                    onClick={() => setShowDatePicker(!showDatePicker)}
                  >
                    <CalendarMonthIcon color="primary" sx={{ fontSize: 12, mr: 0.5 }} />
                    <Typography variant="body2" sx={{ fontSize: '0.65rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'text.secondary' }}>
                      {dateRange[0] && dateRange[1]
                        ? `${dateRange[0].toLocaleDateString()} - ${dateRange[1].toLocaleDateString()}`
                        : "Select date range"}
                    </Typography>
                  </Box>
                  
                  {showDatePicker && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        mt: 0.5,
                        zIndex: 1000,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                        borderRadius: 1,
                        overflow: 'hidden',
                        border: '1px solid rgba(0,0,0,0.08)',
                        '& .shadow': {
                          boxShadow: 'none !important',
                          border: 'none !important'
                        },
                        '& .border': {
                          border: 'none !important'
                        }
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <CustomDateRangePicker onDateRangeSelect={handleDateRangeSelect} />
                    </Box>
                  )}
                </Box>
              </Box>
              
              {tasks.length > 0 ? (
                <TableContainer sx={{ flexGrow: 1 }}>
                  <Table size="small" aria-label="task table" sx={{ height: '100%' }}>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ py: 0.75, fontSize: '0.7rem', fontWeight: 600 }}>Title</TableCell>
                        <TableCell sx={{ py: 0.75, fontSize: '0.7rem', fontWeight: 600 }}>Details</TableCell>
                        <TableCell sx={{ py: 0.75, fontSize: '0.7rem', fontWeight: 600 }}>Client</TableCell>
                        <TableCell sx={{ py: 0.75, fontSize: '0.7rem', fontWeight: 600 }}>Module</TableCell>
                        <TableCell sx={{ py: 0.75, fontSize: '0.7rem', fontWeight: 600 }}>Type</TableCell>
                        <TableCell sx={{ py: 0.75, fontSize: '0.7rem', fontWeight: 600 }}>Subtype</TableCell>
                        <TableCell sx={{ py: 0.75, fontSize: '0.7rem', fontWeight: 600 }}>Resource</TableCell>
                        <TableCell sx={{ py: 0.75, fontSize: '0.7rem', fontWeight: 600 }}>Hours</TableCell>
                        <TableCell sx={{ py: 0.75, fontSize: '0.7rem', fontWeight: 600 }}>Date</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {tasks.map((task) => (
                        <TableRow 
                          key={task.id}
                          hover
                          sx={{ 
                            '&:nth-of-type(odd)': { backgroundColor: 'rgba(0,0,0,0.01)' },
                            transition: 'background-color 0.2s',
                            cursor: 'pointer'
                          }}
                        >
                          <TableCell component="th" scope="row" sx={{ py: 0.75 }}>
                            <Typography variant="body2" fontWeight="medium" sx={{ fontSize: '0.7rem' }}>
                              {task.title}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ py: 0.75 }}>
                            <Typography
                              variant="body2"
                              sx={{
                                maxWidth: '140px',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                fontSize: '0.7rem'
                              }}
                              title={task.details}
                            >
                              {task.details || '-'}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ py: 0.75 }}>
                            <Chip 
                              size="small" 
                              label={task.client_name || '-'} 
                              sx={{ 
                                bgcolor: 'rgba(3, 169, 244, 0.08)', 
                                color: 'info.main',
                                height: 18,
                                '& .MuiChip-label': { 
                                  px: 1, 
                                  fontSize: '0.65rem',
                                  fontWeight: 500
                                } 
                              }}
                            />
                          </TableCell>
                          <TableCell sx={{ py: 0.75 }}>
                            <Chip 
                              size="small" 
                              label={task.module_name || '-'} 
                              sx={{ 
                                bgcolor: 'rgba(158, 158, 158, 0.08)', 
                                color: 'text.secondary',
                                height: 18,
                                '& .MuiChip-label': { 
                                  px: 1, 
                                  fontSize: '0.65rem',
                                  fontWeight: 500
                                }
                              }}
                            />
                          </TableCell>
                          <TableCell sx={{ py: 0.75 }}>
                            <Chip 
                              size="small" 
                              label={task.type_name || '-'} 
                              sx={{ 
                                bgcolor: 'rgba(25, 118, 210, 0.08)', 
                                color: 'primary.main',
                                height: 18,
                                '& .MuiChip-label': { 
                                  px: 1, 
                                  fontSize: '0.65rem',
                                  fontWeight: 500
                                }
                              }}
                            />
                          </TableCell>
                          <TableCell sx={{ py: 0.75 }}>
                            <Chip 
                              size="small" 
                              label={task.subtype_name || '-'} 
                              sx={{ 
                                bgcolor: 'rgba(76, 175, 80, 0.08)', 
                                color: 'success.main',
                                height: 18,
                                '& .MuiChip-label': { 
                                  px: 1, 
                                  fontSize: '0.65rem',
                                  fontWeight: 500
                                }
                              }}
                            />
                          </TableCell>
                          <TableCell sx={{ py: 0.75 }}>
                            <Chip 
                              size="small" 
                              label={task.resource_name || '-'} 
                              sx={{ 
                                bgcolor: 'rgba(33, 33, 33, 0.05)', 
                                color: 'text.primary',
                                height: 18,
                                '& .MuiChip-label': { 
                                  px: 1, 
                                  fontSize: '0.65rem',
                                  fontWeight: 500
                                }
                              }}
                            />
                          </TableCell>
                          <TableCell sx={{ py: 0.75 }}>
                            <Chip 
                              size="small" 
                              label={`${task.hours_spent || '0'} hrs`} 
                              sx={{ 
                                bgcolor: 'rgba(245, 0, 87, 0.08)', 
                                color: 'secondary.main', 
                                fontWeight: 'bold',
                                height: 18,
                                '& .MuiChip-label': { 
                                  px: 1, 
                                  fontSize: '0.65rem'
                                }
                              }}
                            />
                          </TableCell>
                          <TableCell sx={{ py: 0.75, fontSize: '0.7rem' }}>{formatDate(task.date)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Box sx={{ py: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', flexGrow: 1, justifyContent: 'center' }}>
                  <EventBusyIcon sx={{ fontSize: 32, color: 'text.secondary', mb: 1, opacity: 0.7 }} />
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontSize: '0.75rem' }}>
                    No tasks found for the selected period
                  </Typography>
                  <Button
                    variant="contained"
                    size="small"
                    color="primary"
                    startIcon={<AddIcon fontSize="small" />}
                    onClick={() => setShowModal(true)}
                    sx={{ fontSize: '0.7rem', height: '24px', py: 0, borderRadius: 4 }}
                  >
                    Add Your First Task
                  </Button>
                </Box>
              )}
            </Paper>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default MuiDashboard; 