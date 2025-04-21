import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import apiClient from "../utils/apiClient"; 
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
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Button,
  useMediaQuery,
  CssBaseline,
  Badge,
  Avatar
} from '@mui/material';
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  Dashboard as DashboardIcon,
  Settings as SettingsIcon,
  People as PeopleIcon,
  Build as BuildIcon,
  Home as HomeIcon,
  Logout as LogoutIcon,
  ViewList as BacklogIcon
} from '@mui/icons-material';

import logo from '../assets/logo.png'; // Using the existing logo

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
    fontSize: 12,
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
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          padding: 6,
        },
        sizeSmall: {
          padding: 4,
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          paddingTop: 6,
          paddingBottom: 6,
          '&.Mui-selected': {
            backgroundColor: 'rgba(25, 118, 210, 0.12)',
          }
        },
      },
    },
  },
});

const Layout = ({ children }) => {
  const [open, setOpen] = useState(true);
  const user = JSON.parse(localStorage.getItem("user")) || { name: "User", role: "user" };
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Automatically collapse sidebar on mobile
  useEffect(() => {
    if (isMobile) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  }, [isMobile]);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleLogout = async () => {
    try {
      await apiClient.post("auth/logout");
      localStorage.removeItem("user");
      localStorage.removeItem("role");
      localStorage.removeItem("mustChangePassword");
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
    }
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
              sx={{ 
                marginRight: '10px', 
                ...(open && { display: 'none' }), 
                p: 0.5,
                width: 28,
                height: 28,
                borderRadius: '4px',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                }
              }}
              size="small"
            >
              <MenuIcon fontSize="small" />
            </IconButton>
            
            {/* Xumane Logo */}
            <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
              <img src={logo} alt="App Logo" height="30" />
            </Box>
            
            <Typography component="h1" variant="subtitle1" color="inherit" noWrap sx={{ flexGrow: 1, fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.25px' }}>
              Task Management
            </Typography>
            
            {/* User Profile and Logout */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Link to="/change-password" style={{ textDecoration: 'none' }}>
                <Button 
                  variant="contained" 
                  color="secondary"
                  size="small"
                  sx={{ 
                    mr: 1,
                    textTransform: 'none', 
                    py: 0.25, 
                    px: 1,
                    backgroundColor: 'rgba(255,255,255,0.15)',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.25)',
                    }
                  }}
                >
                  Reset Password
                </Button>
              </Link>
              <Button 
                variant="contained" 
                color="secondary"
                size="small"
                startIcon={<LogoutIcon fontSize="small" />}
                onClick={handleLogout}
                sx={{ 
                  textTransform: 'none', 
                  py: 0.25, 
                  px: 1,
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.25)',
                  }
                }}
              >
                Logout
              </Button>
            </Box>
          </Toolbar>
        </AppBarStyled>
        
        {/* Drawer / Sidebar */}
        <DrawerStyled variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              px: open ? 1.5 : 0,
              minHeight: '48px !important',
              backgroundColor: 'rgba(25, 118, 210, 0.03)'
            }}
          >
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              width: '100%',
              overflow: 'hidden',
              justifyContent: open ? 'flex-start' : 'center'
            }}>
              <StyledBadge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                variant="dot"
              >
                <Avatar 
                  alt={user.name}
                  src="/static/images/avatar/1.jpg" 
                  sx={{ width: 24, height: 24, mr: open ? 1.5 : 0 }}
                />
              </StyledBadge>
              {open && (
                <Typography variant="body2" fontWeight="600" fontSize="0.75rem" noWrap>
                  {user.name}
                </Typography>
              )}
            </Box>
            {open && (
              <IconButton 
                onClick={handleDrawerToggle} 
                size="small"
                sx={{ 
                  width: 24, 
                  height: 24, 
                  p: 0.5,
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  }
                }}
              >
                <ChevronLeftIcon fontSize="small" />
              </IconButton>
            )}
          </Toolbar>
          <Divider />
          <List component="nav" dense sx={{ py: 0.5 }}>
            <ListItemButton 
              component={Link} 
              to="/user-dashboard" 
              selected={location.pathname === '/user-dashboard'} 
              dense 
              sx={{ 
                py: 0.75, 
                px: open ? 1.5 : 0,
                minHeight: '36px',
                borderRadius: open ? '0 8px 8px 0' : 0,
                mr: open ? 0.5 : 0,
                ...(location.pathname === '/user-dashboard' && {
                  bgcolor: 'rgba(25, 118, 210, 0.12)',
                  '&:hover': {
                    bgcolor: 'rgba(25, 118, 210, 0.15)',
                  }
                })
              }}
            >
              <ListItemIcon sx={{ 
                minWidth: open ? 32 : 48, 
                display: 'flex', 
                justifyContent: 'center'
              }}>
                <HomeIcon color={location.pathname === '/user-dashboard' ? 'primary' : 'inherit'} fontSize="small" />
              </ListItemIcon>
              <ListItemText 
                primary="Home" 
                primaryTypographyProps={{ 
                  fontSize: '0.75rem',
                  noWrap: true,
                  fontWeight: location.pathname === '/user-dashboard' ? 600 : 400,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }} 
                sx={{ opacity: open ? 1 : 0 }}
              />
            </ListItemButton>
            
            <ListItemButton 
              component={Link} 
              to="/dashboard" 
              selected={location.pathname === '/dashboard'} 
              dense 
              sx={{ 
                py: 0.75, 
                px: open ? 1.5 : 0,
                minHeight: '36px',
                borderRadius: open ? '0 8px 8px 0' : 0,
                mr: open ? 0.5 : 0,
                ...(location.pathname === '/dashboard' && {
                  bgcolor: 'rgba(25, 118, 210, 0.12)',
                  '&:hover': {
                    bgcolor: 'rgba(25, 118, 210, 0.15)',
                  }
                })
              }}
            >
              <ListItemIcon sx={{ 
                minWidth: open ? 32 : 48,
                display: 'flex', 
                justifyContent: 'center' 
              }}>
                <DashboardIcon color={location.pathname === '/dashboard' ? 'primary' : 'inherit'} fontSize="small" />
              </ListItemIcon>
              <ListItemText 
                primary="Dashboard" 
                primaryTypographyProps={{ 
                  fontSize: '0.75rem',
                  noWrap: true,
                  fontWeight: location.pathname === '/dashboard' ? 600 : 400,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }} 
                sx={{ opacity: open ? 1 : 0 }}
              />
            </ListItemButton>
            
            <ListItemButton 
              component={Link} 
              to="/backlog" 
              selected={location.pathname === '/backlog'} 
              dense 
              sx={{ 
                py: 0.75, 
                px: open ? 1.5 : 0,
                minHeight: '36px',
                borderRadius: open ? '0 8px 8px 0' : 0,
                mr: open ? 0.5 : 0,
                ...(location.pathname === '/backlog' && {
                  bgcolor: 'rgba(25, 118, 210, 0.12)',
                  '&:hover': {
                    bgcolor: 'rgba(25, 118, 210, 0.15)',
                  }
                })
              }}
            >
              <ListItemIcon sx={{ 
                minWidth: open ? 32 : 48,
                display: 'flex', 
                justifyContent: 'center' 
              }}>
                <BacklogIcon color={location.pathname === '/backlog' ? 'primary' : 'inherit'} fontSize="small" />
              </ListItemIcon>
              <ListItemText 
                primary="Backlog" 
                primaryTypographyProps={{ 
                  fontSize: '0.75rem',
                  noWrap: true,
                  fontWeight: location.pathname === '/backlog' ? 600 : 400,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }} 
                sx={{ opacity: open ? 1 : 0 }}
              />
            </ListItemButton>
            
          {user.role === "admin" && (
            <>
                <ListItemButton 
                  component={Link} 
                  to="/settings" 
                  selected={location.pathname === '/settings'} 
                  dense 
                  sx={{ 
                    py: 0.75, 
                    px: open ? 1.5 : 0,
                    minHeight: '36px',
                    borderRadius: open ? '0 8px 8px 0' : 0,
                    mr: open ? 0.5 : 0,
                    ...(location.pathname === '/settings' && {
                      bgcolor: 'rgba(25, 118, 210, 0.12)',
                      '&:hover': {
                        bgcolor: 'rgba(25, 118, 210, 0.15)',
                      }
                    })
                  }}
                >
                  <ListItemIcon sx={{ 
                    minWidth: open ? 32 : 48,
                    display: 'flex', 
                    justifyContent: 'center' 
                  }}>
                    <SettingsIcon color={location.pathname === '/settings' ? 'primary' : 'inherit'} fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Settings" 
                    primaryTypographyProps={{ 
                      fontSize: '0.75rem',
                      noWrap: true,
                      fontWeight: location.pathname === '/settings' ? 600 : 400,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }} 
                    sx={{ opacity: open ? 1 : 0 }}
                  />
                </ListItemButton>
                
                <ListItemButton 
                  component={Link} 
                  to="/config" 
                  selected={location.pathname === '/config'} 
                  dense 
                  sx={{ 
                    py: 0.75, 
                    px: open ? 1.5 : 0,
                    minHeight: '36px',
                    borderRadius: open ? '0 8px 8px 0' : 0,
                    mr: open ? 0.5 : 0,
                    ...(location.pathname === '/config' && {
                      bgcolor: 'rgba(25, 118, 210, 0.12)',
                      '&:hover': {
                        bgcolor: 'rgba(25, 118, 210, 0.15)',
                      }
                    })
                  }}
                >
                  <ListItemIcon sx={{ 
                    minWidth: open ? 32 : 48,
                    display: 'flex', 
                    justifyContent: 'center' 
                  }}>
                    <BuildIcon color={location.pathname === '/config' ? 'primary' : 'inherit'} fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Configuration" 
                    primaryTypographyProps={{ 
                      fontSize: '0.75rem',
                      noWrap: true,
                      fontWeight: location.pathname === '/config' ? 600 : 400,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }} 
                    sx={{ opacity: open ? 1 : 0 }}
                  />
                </ListItemButton>
                
                <ListItemButton 
                  component={Link} 
                  to="/users" 
                  selected={location.pathname === '/users'} 
                  dense 
                  sx={{ 
                    py: 0.75, 
                    px: open ? 1.5 : 0,
                    minHeight: '36px',
                    borderRadius: open ? '0 8px 8px 0' : 0,
                    mr: open ? 0.5 : 0,
                    ...(location.pathname === '/users' && {
                      bgcolor: 'rgba(25, 118, 210, 0.12)',
                      '&:hover': {
                        bgcolor: 'rgba(25, 118, 210, 0.15)',
                      }
                    })
                  }}
                >
                  <ListItemIcon sx={{ 
                    minWidth: open ? 32 : 48,
                    display: 'flex', 
                    justifyContent: 'center' 
                  }}>
                    <PeopleIcon color={location.pathname === '/users' ? 'primary' : 'inherit'} fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Users" 
                    primaryTypographyProps={{ 
                      fontSize: '0.75rem',
                      noWrap: true,
                      fontWeight: location.pathname === '/users' ? 600 : 400,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }} 
                    sx={{ opacity: open ? 1 : 0 }}
                  />
                </ListItemButton>
            </>
          )}
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
              flexGrow: 1,
              py: 2
            }}
          >
            {children}
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Layout;
