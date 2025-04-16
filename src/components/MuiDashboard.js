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
import logo from '../assets/logo.png';

// ... existing code ...

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
            
            <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
              <img src={logo} alt="Xumane Logo" height="24" />
            </Box>
            
            <Typography component="h1" variant="subtitle1" color="inherit" noWrap sx={{ flexGrow: 1, fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.25px' }}>
              Task Dashboard
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
              minHeight: '48px !important',
              backgroundColor: 'rgba(25, 118, 210, 0.03)'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', overflow: 'hidden' }}>
              <StyledBadge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                variant="dot"
              >
                <Avatar 
                  alt="Avinash" 
                  src="/static/images/avatar/1.jpg" 
                  sx={{ width: 24, height: 24, mr: open ? 1.5 : 0 }}
                />
              </StyledBadge>
              {open && (
                <Typography variant="body2" fontWeight="600" fontSize="0.75rem" noWrap>
                  Avinash Gautam
                </Typography>
              )}
            </Box>
            {open && (
              <IconButton onClick={handleDrawerToggle} size="small">
                <ChevronLeftIcon fontSize="small" />
              </IconButton>
            )}
          </Toolbar>
          <Divider />
          <List component="nav" dense sx={{ py: 0.5 }}>
            <ListItemButton selected dense sx={{ py: 0.75 }}>
              <ListItemIcon sx={{ minWidth: open ? 32 : 36, ml: open ? 0 : 0.5, display: 'flex', justifyContent: 'center' }}>
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
              <ListItemIcon sx={{ minWidth: open ? 32 : 36, ml: open ? 0 : 0.5, display: 'flex', justifyContent: 'center' }}>
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
              <ListItemIcon sx={{ minWidth: open ? 32 : 36, ml: open ? 0 : 0.5, display: 'flex', justifyContent: 'center' }}>
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
              <ListItemIcon sx={{ minWidth: open ? 32 : 36, ml: open ? 0 : 0.5, display: 'flex', justifyContent: 'center' }}>
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
              <ListItemIcon sx={{ minWidth: open ? 32 : 36, ml: open ? 0 : 0.5, display: 'flex', justifyContent: 'center' }}>
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
// ... existing code ... 