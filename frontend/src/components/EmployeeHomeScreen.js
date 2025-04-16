import React, { useState, useEffect } from "react";
import { Form, Button as BootstrapButton, Modal, Dropdown, OverlayTrigger, Tooltip } from "react-bootstrap";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { format } from 'date-fns';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Chip,
  Avatar,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useMediaQuery,
  Tabs,
  Tab
} from '@mui/material';
import {
  Add as AddIcon,
  AccessTime as AccessTimeIcon,
  Event as EventIcon,
  EventNote as EventNoteIcon,
  EventBusy as EventBusyIcon,
  CalendarMonth as CalendarMonthIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  AssignmentLate as AssignmentLateIcon,
  Person as PersonIcon,
  Group as GroupIcon,
  ViewList as ViewListIcon
} from '@mui/icons-material';
import { useApi } from "../hooks/useApi";
import apiClient from "../utils/apiClient";
import { toast } from "react-toastify";
import CustomDateRangePicker from "./CustomDateRangePicker";
import { InputBase, IconButton } from '@mui/material';
import { TextField, InputAdornment, Menu, MenuList, MenuItem, FormControlLabel, RadioGroup, Radio } from '@mui/material';

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

const EmployeeHomeScreen = () => {
  const [dateRange, setDateRange] = useState([new Date(), new Date()]);
  const [tasks, setTasks] = useState([]);
  const [workingHours, setWorkingHours] = useState({ total: 8, planned: 0, actual: 0 });
  const [showModal, setShowModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [taskForm, setTaskForm] = useState({
    title: "",
    details: "",
    client: "",
    module: "",
    resource: "",
    type: "",
    subType: "",
    hoursSpent: ""
  });
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [dropdownOptions, setDropdownOptions] = useState({
    clients: [],
    modules: [],
    users: [],
    types: [],
    subtypes: []
  });

  const [filteredTasks, setFilteredTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState("All");
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);

  const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem("user")));
console.log("currentuser",currentUser)
  // Add new state for active tab
  const [activeTab, setActiveTab] = useState('my-tasks');
  
  // Add column-specific filter states
  const [columnFilters, setColumnFilters] = useState({
    task: '',
    client: '',
    module: '',
    type: '',
    subtype: '',
    resource: ''
  });

  // Define fetchDropdownOptions properly inside the component
  const fetchDropdownOptions = async () => {
    try {
      const [clientsResponse, modulesResponse, usersResponse, typesResponse, subtypesResponse] = 
        await Promise.all([
          apiClient.get("/config/clients"),
          apiClient.get("/config/modules"),
          apiClient.get("/users"),
          apiClient.get("/config/types"),
          apiClient.get("/config/subtypes")
        ]);

      console.log("Clients Response:", clientsResponse.data);
      console.log("Modules Response:", modulesResponse.data);
      console.log("Types Response:", typesResponse.data);
      console.log("Subtypes Response:", subtypesResponse.data);

        setDropdownOptions({
        clients: clientsResponse.data.clients || [],
        modules: modulesResponse.data.modules || [],
        users: usersResponse.data || [],
        types: typesResponse.data.types || [],
        subtypes: subtypesResponse.data.subtypes || []
        });
      } catch (error) {
        console.error("Error fetching dropdown options:", error);
      toast.error("Failed to load dropdown options");
    }
  };

  // Fetch data when component mounts or dateRange changes
  useEffect(() => {
    const fetchData = async () => {
      // Debug logging for user role information
      console.log("Current User Full Object:", currentUser);
      console.log("Current User Info:", {
        id: currentUser?.id,
        name: currentUser?.first_name + " " + currentUser?.last_name,
        role: currentUser?.role,
        is_manager: currentUser?.is_manager,
        reporting_manager: currentUser?.reporting_manager
      });

      // Check if current user has any direct reports
      if (currentUser && currentUser.id) {
        try {
          // Try to find employees that have this user as reporting_manager
          const response = await apiClient.get(`/employees?reporting_manager=${currentUser.id}`);
          if (response.data && response.data.length > 0) {
            console.log("User has direct reports as reporting_manager:", response.data);
            // Update the current user with this information
            setCurrentUser(prev => ({
              ...prev,
              has_direct_reports: true,
              team_members: response.data
            }));
          } else {
            // Alternative: check if user is marked as a manager
            const userResponse = await apiClient.get(`/users/${currentUser.id}`);
            if (userResponse.data && (userResponse.data.is_manager || 
                userResponse.data.role === 'manager' || 
                userResponse.data.role === 'Manager')) {
              console.log("User is marked as a manager in user profile:", userResponse.data);
              setCurrentUser(prev => ({
                ...prev,
                is_manager: true
              }));
            }
          }
        } catch (error) {
          console.error("Error checking for direct reports:", error);
        }
      }

      await fetchDropdownOptions();
      await fetchTasks();
    };

    fetchData();
  }, [dateRange]); // Only call when dateRange changes

  // Filter tasks based on search term, priority, and column filters
  useEffect(() => {
    if (!tasks) return;
    
    let filtered = [...tasks];
    
    // Apply search filter if searchTerm exists
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(task => 
        (task.title && task.title.toLowerCase().includes(searchLower)) ||
        (task.details && task.details.toLowerCase().includes(searchLower)) ||
        (task.client_name && task.client_name.toLowerCase().includes(searchLower)) ||
        (task.module_name && task.module_name.toLowerCase().includes(searchLower))
      );
    }
    
    // Apply priority filter if not showing all
    if (selectedPriority !== 'All') {
      filtered = filtered.filter(task => {
        // Determine task priority based on your data structure
        let priority = task.priority;
        
        // If priority isn't directly available, try to infer it
        if (!priority) {
          if (task.type_name && task.type_name.includes('Urgent')) {
            priority = 'High';
          } else if (task.subtype_name && task.subtype_name.includes('Important')) {
            priority = 'Medium';
          } else {
            priority = 'Low';
          }
        }
        
        return priority === selectedPriority;
      });
    }
    
    // Apply column filters
    if (columnFilters.task) {
      const filterValue = columnFilters.task.toLowerCase();
      filtered = filtered.filter(task => 
        (task.title?.toLowerCase().includes(filterValue) || 
         task.details?.toLowerCase().includes(filterValue))
      );
    }
    
    if (columnFilters.client) {
      const filterValue = columnFilters.client.toLowerCase();
      filtered = filtered.filter(task => 
        task.client_name?.toLowerCase().includes(filterValue)
      );
    }
    
    if (columnFilters.module) {
      const filterValue = columnFilters.module.toLowerCase();
      filtered = filtered.filter(task => 
        task.module_name?.toLowerCase().includes(filterValue)
      );
    }
    
    if (columnFilters.type) {
      const filterValue = columnFilters.type.toLowerCase();
      filtered = filtered.filter(task => 
        task.type_name?.toLowerCase().includes(filterValue)
      );
    }
    
    if (columnFilters.subtype) {
      const filterValue = columnFilters.subtype.toLowerCase();
      filtered = filtered.filter(task => 
        task.subtype_name?.toLowerCase().includes(filterValue)
      );
    }
    
    if (columnFilters.resource) {
      const filterValue = columnFilters.resource.toLowerCase();
      filtered = filtered.filter(task => 
        task.resource_name?.toLowerCase().includes(filterValue)
      );
    }
    
    setFilteredTasks(filtered);
  }, [tasks, searchTerm, selectedPriority, columnFilters]);

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

  const handleDateRangeSelect = (start, end) => {
    // If both start and end are null, it means clear was clicked
    if (start === null && end === null) {
      // Set default date range (today)
      const today = new Date();
      // Set to start of day to avoid timezone issues
      today.setHours(0, 0, 0, 0);
      setDateRange([today, today]);
    } else {
      // Create new Date objects and set to start of day to avoid timezone issues
      const startDate = new Date(start);
      startDate.setHours(0, 0, 0, 0);
      
      const endDate = new Date(end);
      endDate.setHours(0, 0, 0, 0);
      
      setDateRange([startDate, endDate]);
    }
    
    setShowDatePicker(false);
    // Clear filters when changing date range
    setSearchTerm("");
    setSelectedPriority("All");
    // Reset column filters
    resetColumnFilters();
    
    // Always fetch tasks when date range changes, whether from clear or normal selection
    // Use setTimeout to ensure dateRange state is updated before fetchTasks runs
    setTimeout(() => {
      fetchTasks();
    }, 0);
  };

  // Add reset column filters function
  const resetColumnFilters = () => {
    setColumnFilters({
      task: '',
      client: '',
      module: '',
      type: '',
      subtype: '',
      resource: ''
    });
  };

  const handleTaskFormChange = (e) => {
    const { name, value } = e.target;
    setTaskForm({ ...taskForm, [name]: value });

    if (name === "type") {
      console.log("Selected Type:", value);
      console.log("Available Subtypes:", dropdownOptions.subtypes);
      setTaskForm((prevForm) => ({ ...prevForm, subType: "" }));
    }
  };

  const handleSaveTask = async () => {
    try {
      // Validate required fields
      const errors = [];
      
      if (!taskForm.title.trim()) {
        errors.push("Task title is required");
      }
      
      if (!taskForm.client) {
        errors.push("Client is required");
      }
      
      if (!taskForm.module) {
        errors.push("Module is required");
      }
      
      if (!taskForm.resource) {
        errors.push("Resource is required");
      }
      
      if (!taskForm.type) {
        errors.push("Type is required");
      }
      
      if (!taskForm.subType) {
        errors.push("Subtype is required");
      }
      
      if (!taskForm.hoursSpent || parseFloat(taskForm.hoursSpent) <= 0) {
        errors.push("Hours spent must be greater than 0");
      }

      if (errors.length > 0) {
        errors.forEach(error => toast.error(error));
        return;
      }

      const taskData = {
        title: taskForm.title.trim(),
        details: taskForm.details.trim(),
        client_id: parseInt(taskForm.client),
        module_id: parseInt(taskForm.module),
        resource_id: parseInt(taskForm.resource),
        type_id: parseInt(taskForm.type),
        subtype_id: parseInt(taskForm.subType),
        hours_spent: parseFloat(taskForm.hoursSpent),
        date: dateRange[0].toISOString().split("T")[0]
      };

      await apiClient.post("/tasks", taskData);
      toast.success("Task added successfully");
      
      // Reset form
      setTaskForm({
        title: "",
        details: "",
        client: "",
        module: "",
        resource: "",
        type: "",
        subType: "",
        hoursSpent: ""
      });
      setShowModal(false);
      
      // Refresh tasks
      fetchTasks();
      
    } catch (error) {
      console.error("Error saving task:", error);
      toast.error(error.response?.data?.message || "Failed to save task");
    }
  };
  
  // Function to determine which tabs to show based on user role
  const getAvailableTabs = () => {
    if (!currentUser) return ['my-tasks'];
    
    console.log("Determining available tabs for user:", currentUser);
    
    if (currentUser.role === 'admin') {
      console.log("User is admin, showing all tabs");
      return ['my-tasks', 'team-tasks', 'all-tasks'];
    }
    
    // Check if the user is a manager using multiple possible indicators
    const isManager = 
      currentUser.is_manager === true || 
      currentUser.role === 'manager' ||
      currentUser.role === 'Manager' ||
      currentUser.has_direct_reports === true ||
      (currentUser.team_members && currentUser.team_members.length > 0) ||
      (typeof currentUser.manager_id === 'number') ||
      (currentUser.employee_role && 
        (currentUser.employee_role.toLowerCase().includes('manager') || 
         currentUser.employee_role.toLowerCase().includes('lead')));
    
    console.log("Is user a manager?", isManager, "Reasons:", {
      is_manager: currentUser.is_manager === true,
      role_manager: currentUser.role === 'manager' || currentUser.role === 'Manager',
      has_direct_reports: currentUser.has_direct_reports === true,
      has_team_members: currentUser.team_members && currentUser.team_members.length > 0,
      has_manager_id: typeof currentUser.manager_id === 'number',
      employee_role_check: currentUser.employee_role && 
        (currentUser.employee_role.toLowerCase().includes('manager') || 
         currentUser.employee_role.toLowerCase().includes('lead'))
    });
    
    if (isManager) {
      console.log("User is a manager, showing my-tasks and team-tasks tabs");
      return ['my-tasks', 'team-tasks'];
    }
    
    console.log("User is a regular employee, showing only my-tasks tab");
    return ['my-tasks'];
  };

  // Modify fetchTasks to handle different tab types
  const fetchTasks = async () => {
    try {
      const formatDateToYYYYMMDD = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };
      
      let url = '/tasks';
      const formattedStartDate = formatDateToYYYYMMDD(dateRange[0]);
      const formattedEndDate = formatDateToYYYYMMDD(dateRange[1]);
      
      // Base query parameters
      let queryParams = formattedStartDate === formattedEndDate 
        ? `date=${formattedStartDate}`
        : `startDate=${formattedStartDate}&endDate=${formattedEndDate}`;

      // Add tab-specific filters
      switch (activeTab) {
        case 'my-tasks':
          queryParams += `&resourceId=${currentUser.id}`;
          break;
        case 'team-tasks':
          queryParams += `&managerId=${currentUser.id}`;
          break;
        case 'all-tasks':
          // No additional filter for admin
          break;
      }

      url += `?${queryParams}`;
      console.log("Fetching tasks with URL:", url);
      
      const response = await apiClient.get(url);
      console.log("Tasks Response:", response.data);
      
      let tasksData = [];
      if (response.data && response.data.tasks) {
        tasksData = Array.isArray(response.data.tasks) ? response.data.tasks : response.data.tasks.tasks;
      }
      
      setTasks(tasksData);
      
      const actual = tasksData.reduce(
        (total, task) => total + (parseFloat(task.hours_spent) || 0), 
        0
      );
      setWorkingHours(prev => ({...prev, actual}));
      
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Failed to load tasks");
    }
  };

  // Add useEffect to fetch tasks when tab changes
  useEffect(() => {
    fetchTasks();
  }, [activeTab, dateRange]);

  // Add tab change handler
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handlePriorityFilter = (priority) => {
    setSelectedPriority(priority);
    setShowFilterMenu(false);
  };

  const getStatusColor = (status) => {
    if (!status) return theme.palette.warning.light; // Default
    
    status = status.toLowerCase();
    if (status === 'completed' || status === 'done') return theme.palette.success.main;
    if (status === 'in progress' || status === 'working') return theme.palette.info.main;
    if (status === 'on hold' || status === 'pending') return theme.palette.warning.main;
    return theme.palette.primary.main; // Default
  };

  const getPriorityColor = (task) => {
    // Determine priority based on your actual data structure
    let priority = task.priority;
    
    // If priority isn't directly available, try to infer it
    if (!priority) {
      if (task.type_name && task.type_name.includes('Urgent')) {
        priority = 'High';
      } else if (task.subtype_name && task.subtype_name.includes('Important')) {
        priority = 'Medium';
      } else {
        priority = 'Low';
      }
    }
    
    if (priority === 'High') return theme.palette.error.main;
    if (priority === 'Medium') return theme.palette.warning.main;
    if (priority === 'Low') return theme.palette.success.main;
    return theme.palette.info.main; // Default
  };

  const isTaskOverdue = (task) => {
    if (!task.end_date) return false;
    
    const dueDate = new Date(task.end_date);
    const today = new Date();
    return dueDate < today && task.status !== 'completed' && task.status !== 'done';
  };

  const handleEditClick = (task) => {
    // Implement edit functionality
  };

  const handleDeleteClick = (id) => {
    // Implement delete functionality
  };

  // Modify the resource dropdown options based on user role
  const getFilteredUsers = () => {
    if (!currentUser) return [];
    
    // If user is admin, show all users
    if (currentUser.role === "admin") {
      return dropdownOptions.users;
    }
    
    // For regular users, only show their own name
    return dropdownOptions.users.filter(user => user.id === currentUser.id);
  };

  // Update the modal show handler
  const handleShowModal = () => {
    // For regular users, automatically set the resource to themselves
    if (currentUser && currentUser.role !== "admin") {
      setTaskForm(prev => ({
        ...prev,
        resource: currentUser.id.toString()
      }));
    }
    setShowModal(true);
  };

  // Add a handler for updating column filters
  const handleColumnFilterChange = (column, value) => {
    setColumnFilters(prev => ({
      ...prev,
      [column]: value
    }));
  };

  return (
    <ThemeProvider theme={theme}>
      {/* Welcome Banner */}
      <Paper
        elevation={1}
        sx={{
          p: 1.5,
          mb: 1.5,
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
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
            {getGreeting()}, {JSON.parse(localStorage.getItem("user"))?.name || "User"}
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
            borderRadius: 4,
            mt: { xs: 1, sm: 0 }
          }}
          onClick={handleShowModal}
        >
          Add Task
        </Button>
      </Paper>

      {/* Add Tabs */}
      <Paper sx={{ mb: 2 }}>
        <Tabs 
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            minHeight: '48px',
            '& .MuiTab-root': {
              minHeight: '48px',
              fontSize: '0.8rem',
              textTransform: 'none'
            }
          }}
        >
          {getAvailableTabs().includes('my-tasks') && (
            <Tab 
              icon={<PersonIcon sx={{ fontSize: '1.2rem' }} />}
              iconPosition="start"
              label="My Tasks" 
              value="my-tasks"
            />
          )}
          {getAvailableTabs().includes('team-tasks') && (
            <Tab 
              icon={<GroupIcon sx={{ fontSize: '1.2rem' }} />}
              iconPosition="start"
              label="Team Tasks" 
              value="team-tasks"
            />
          )}
          {getAvailableTabs().includes('all-tasks') && (
            <Tab 
              icon={<ViewListIcon sx={{ fontSize: '1.2rem' }} />}
              iconPosition="start"
              label="All Tasks" 
              value="all-tasks"
            />
          )}
        </Tabs>
      </Paper>

      {/* Stats Cards */}
      <Grid container spacing={1.5} sx={{ mb: 1.5 }}>
        <Grid item xs={4} sm={3} md={2.5}>
          <Card elevation={0} sx={{ 
            transition: 'all 0.2s', 
            '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 4px 8px rgba(0,0,0,0.05)' },
            border: '1px solid rgba(0,0,0,0.03)',
          }}>
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
          <Card elevation={0} sx={{ 
            transition: 'all 0.2s', 
            '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 4px 8px rgba(0,0,0,0.05)' },
            border: '1px solid rgba(0,0,0,0.03)',
          }}>
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
          <Card elevation={0} sx={{ 
            transition: 'all 0.2s', 
            '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 4px 8px rgba(0,0,0,0.05)' },
            border: '1px solid rgba(0,0,0,0.03)',
          }}>
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

      {/* Tasks Container */}
      <Paper 
        elevation={2} 
        sx={{ 
          p: 3, 
          mb: 0,
          borderRadius: 2,
          maxWidth: '100%',
          overflow: 'hidden',
          minHeight: 'calc(100vh - 280px)',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Header with title and task count */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="h6" fontWeight="600">
              Tasks
              <Chip 
                label={filteredTasks.length} 
                size="small" 
                sx={{ ml: 1, bgcolor: theme.palette.primary.main, color: 'white' }} 
              />
            </Typography>

            {/* Add clear filters button */}
            {(columnFilters.task || columnFilters.client || columnFilters.module || 
              columnFilters.type || columnFilters.subtype || columnFilters.resource) && (
              <Button
                variant="outlined"
                size="small"
                color="primary"
                onClick={resetColumnFilters}
                sx={{ ml: 2, height: '24px', fontSize: '0.65rem', py: 0 }}
              >
                Clear Filters
              </Button>
            )}
          </Box>
          
          <Box sx={{ position: 'relative' }}>
            <Box
              sx={{
                border: '1px solid rgba(0, 0, 0, 0.12)',
                borderRadius: 1,
                p: 0.5,
                px: 1,
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                '&:hover': {
                  borderColor: 'primary.main',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                },
                minWidth: { xs: '100%', sm: '180px' },
                maxWidth: { xs: '100%', sm: '240px' },
                backgroundColor: '#fff'
              }}
              onClick={() => setShowDatePicker(!showDatePicker)}
            >
              <CalendarMonthIcon color="primary" sx={{ fontSize: 14, mr: 0.75 }} />
              <Typography variant="caption" sx={{ fontSize: '0.7rem', color: 'text.primary', fontWeight: 500 }}>
                {dateRange[0] && dateRange[1]
                  ? `${dateRange[0].toLocaleDateString('en-US', {month: 'short', day: 'numeric'})} - ${dateRange[1].toLocaleDateString('en-US', {month: 'short', day: 'numeric'})}`
                  : "Select date range"}
              </Typography>
            </Box>
            {showDatePicker && (
              <Paper 
                elevation={3} 
                sx={{ 
                  position: 'absolute', 
                  top: '100%', 
                  right: 0, 
                  zIndex: 2, 
                  mt: 0.5,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
              >
                <CustomDateRangePicker 
                  selectedStartDate={dateRange[0]} 
                  selectedEndDate={dateRange[1]} 
                  onDateRangeSelect={handleDateRangeSelect} 
                />
              </Paper>
            )}
          </Box>
        </Box>
        
        {/* Tasks List */}
        {filteredTasks.length > 0 ? (
          <TableContainer component={Paper} elevation={0} sx={{ mt: 2, flexGrow: 1 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Task</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Client</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Module</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Type</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Subtype</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Resource</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', width: '100px' }}>Actions</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <TextField
                      variant="outlined"
                      placeholder="Search task"
                      size="small"
                      fullWidth
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon fontSize="small" sx={{ fontSize: '0.8rem' }} />
                          </InputAdornment>
                        ),
                        style: { fontSize: '0.65rem', padding: '0px 4px', height: '28px' }
                      }}
                      onChange={(e) => handleColumnFilterChange('task', e.target.value)}
                      value={columnFilters.task}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': { borderColor: columnFilters.task ? 'primary.main' : 'rgba(0,0,0,0.12)' },
                          '&:hover fieldset': { borderColor: 'rgba(0,0,0,0.3)' },
                          '&.Mui-focused fieldset': { borderColor: 'primary.main' },
                          bgcolor: columnFilters.task ? 'rgba(25, 118, 210, 0.04)' : 'transparent',
                          height: '28px',
                        },
                        '& .MuiInputBase-input': {
                          padding: '4px 8px 4px 0',
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      variant="outlined"
                      placeholder="Search client"
                      size="small"
                      fullWidth
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon fontSize="small" sx={{ fontSize: '0.8rem' }} />
                          </InputAdornment>
                        ),
                        style: { fontSize: '0.65rem', padding: '0px 4px', height: '28px' }
                      }}
                      onChange={(e) => handleColumnFilterChange('client', e.target.value)}
                      value={columnFilters.client}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': { borderColor: columnFilters.client ? 'primary.main' : 'rgba(0,0,0,0.12)' },
                          '&:hover fieldset': { borderColor: 'rgba(0,0,0,0.3)' },
                          '&.Mui-focused fieldset': { borderColor: 'primary.main' },
                          bgcolor: columnFilters.client ? 'rgba(25, 118, 210, 0.04)' : 'transparent',
                          height: '28px',
                        },
                        '& .MuiInputBase-input': {
                          padding: '4px 8px 4px 0',
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      variant="outlined"
                      placeholder="Search module"
                      size="small"
                      fullWidth
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon fontSize="small" sx={{ fontSize: '0.8rem' }} />
                          </InputAdornment>
                        ),
                        style: { fontSize: '0.65rem', padding: '0px 4px', height: '28px' }
                      }}
                      onChange={(e) => handleColumnFilterChange('module', e.target.value)}
                      value={columnFilters.module}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': { borderColor: columnFilters.module ? 'primary.main' : 'rgba(0,0,0,0.12)' },
                          '&:hover fieldset': { borderColor: 'rgba(0,0,0,0.3)' },
                          '&.Mui-focused fieldset': { borderColor: 'primary.main' },
                          bgcolor: columnFilters.module ? 'rgba(25, 118, 210, 0.04)' : 'transparent',
                          height: '28px',
                        },
                        '& .MuiInputBase-input': {
                          padding: '4px 8px 4px 0',
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      variant="outlined"
                      placeholder="Search type"
                      size="small"
                      fullWidth
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon fontSize="small" sx={{ fontSize: '0.8rem' }} />
                          </InputAdornment>
                        ),
                        style: { fontSize: '0.65rem', padding: '0px 4px', height: '28px' }
                      }}
                      onChange={(e) => handleColumnFilterChange('type', e.target.value)}
                      value={columnFilters.type}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': { borderColor: columnFilters.type ? 'primary.main' : 'rgba(0,0,0,0.12)' },
                          '&:hover fieldset': { borderColor: 'rgba(0,0,0,0.3)' },
                          '&.Mui-focused fieldset': { borderColor: 'primary.main' },
                          bgcolor: columnFilters.type ? 'rgba(25, 118, 210, 0.04)' : 'transparent',
                          height: '28px',
                        },
                        '& .MuiInputBase-input': {
                          padding: '4px 8px 4px 0',
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      variant="outlined"
                      placeholder="Search subtype"
                      size="small"
                      fullWidth
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon fontSize="small" sx={{ fontSize: '0.8rem' }} />
                          </InputAdornment>
                        ),
                        style: { fontSize: '0.65rem', padding: '0px 4px', height: '28px' }
                      }}
                      onChange={(e) => handleColumnFilterChange('subtype', e.target.value)}
                      value={columnFilters.subtype}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': { borderColor: columnFilters.subtype ? 'primary.main' : 'rgba(0,0,0,0.12)' },
                          '&:hover fieldset': { borderColor: 'rgba(0,0,0,0.3)' },
                          '&.Mui-focused fieldset': { borderColor: 'primary.main' },
                          bgcolor: columnFilters.subtype ? 'rgba(25, 118, 210, 0.04)' : 'transparent',
                          height: '28px',
                        },
                        '& .MuiInputBase-input': {
                          padding: '4px 8px 4px 0',
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      variant="outlined"
                      placeholder="Search resource"
                      size="small"
                      fullWidth
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon fontSize="small" sx={{ fontSize: '0.8rem' }} />
                          </InputAdornment>
                        ),
                        style: { fontSize: '0.65rem', padding: '0px 4px', height: '28px' }
                      }}
                      onChange={(e) => handleColumnFilterChange('resource', e.target.value)}
                      value={columnFilters.resource}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': { borderColor: columnFilters.resource ? 'primary.main' : 'rgba(0,0,0,0.12)' },
                          '&:hover fieldset': { borderColor: 'rgba(0,0,0,0.3)' },
                          '&.Mui-focused fieldset': { borderColor: 'primary.main' },
                          bgcolor: columnFilters.resource ? 'rgba(25, 118, 210, 0.04)' : 'transparent',
                          height: '28px',
                        },
                        '& .MuiInputBase-input': {
                          padding: '4px 8px 4px 0',
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredTasks.map((task) => (
                  <TableRow 
                    key={task.id} 
                    sx={{ 
                      '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' },
                      bgcolor: isTaskOverdue(task) ? 'rgba(255,0,0,0.05)' : 'transparent'
                    }}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {isTaskOverdue(task) && (
                          <Tooltip title="Overdue">
                            <AssignmentLateIcon 
                              fontSize="small" 
                              color="error" 
                              sx={{ mr: 1 }} 
                            />
                          </Tooltip>
                        )}
                        <Box>
                          <Typography variant="body2" fontWeight="500">
                            {task.title}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={task.client_name || "N/A"}
                        size="small"
                        sx={{
                          bgcolor: 'rgba(25, 118, 210, 0.1)',
                          color: 'primary.main',
                          fontWeight: 500,
                          fontSize: '0.7rem',
                          border: '1px solid rgba(25, 118, 210, 0.2)'
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={task.module_name || "N/A"}
                        size="small"
                        sx={{
                          bgcolor: 'rgba(76, 175, 80, 0.1)',
                          color: 'success.main',
                          fontWeight: 500,
                          fontSize: '0.7rem',
                          border: '1px solid rgba(76, 175, 80, 0.2)'
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={task.type_name || "N/A"}
                        size="small"
                        sx={{
                          bgcolor: 'rgba(255, 152, 0, 0.1)',
                          color: 'warning.dark',
                          fontWeight: 500,
                          fontSize: '0.7rem',
                          border: '1px solid rgba(255, 152, 0, 0.2)'
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={task.subtype_name || "N/A"}
                        size="small"
                        sx={{
                          bgcolor: 'rgba(3, 169, 244, 0.1)',
                          color: 'info.main',
                          fontWeight: 500,
                          fontSize: '0.7rem',
                          border: '1px solid rgba(3, 169, 244, 0.2)'
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {task.resource_name || (task.first_name && task.last_name ? `${task.first_name} ${task.last_name}` : "N/A")}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex' }}>
                        <IconButton 
                          size="small" 
                          color="primary"
                          onClick={() => handleEditClick(task)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          color="error"
                          onClick={() => handleDeleteClick(task.id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Box 
            sx={{ 
              textAlign: 'center', 
              py: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              flexGrow: 1,
              justifyContent: 'center'
            }}
          >
            <Typography variant="body1" color="text.secondary" gutterBottom>
              No tasks found
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={() => setShowModal(true)}
              startIcon={<AddIcon />}
              size="small"
            >
              Add New Task
            </Button>
          </Box>
        )}
      </Paper>

      {/* Date Range Picker and Add Task Button */}
      <Box sx={{ 
        display: 'none'
      }}>
      
      </Box>

      {/* Task Form Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add New Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold small">Task Title <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={taskForm.title}
                    onChange={handleTaskFormChange}
                    placeholder="Enter task title"
                    required
                    size="sm"
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold small">Hours Spent <span className="text-danger">*</span></Form.Label>
                  <Form.Control 
                    type="number" 
                    name="hoursSpent" 
                    value={taskForm.hoursSpent} 
                    onChange={handleTaskFormChange}
                    placeholder="Enter hours spent"
                    min="0.5"
                    step="0.5"
                    size="sm"
                    required
                  />
            </Form.Group>
              </div>
            </div>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold small">Task Details</Form.Label>
              <Form.Control
                as="textarea"
                name="details"
                value={taskForm.details}
                onChange={handleTaskFormChange}
                placeholder="Enter task details"
                rows={2}
                size="sm"
              />
            </Form.Group>

            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold small">Client <span className="text-danger">*</span></Form.Label>
                  <Form.Select
                    name="client"
                    value={taskForm.client}
                    onChange={handleTaskFormChange}
                    className={!taskForm.client ? "border-danger" : ""}
                    size="sm"
                    required
                  >
                <option value="">Select Client</option>
                {dropdownOptions.clients.map((client) => (
                  <option key={client.id} value={client.id}>{client.name}</option>
                ))}
              </Form.Select>
            </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold small">Module <span className="text-danger">*</span></Form.Label>
                  <Form.Select
                    name="module"
                    value={taskForm.module}
                    onChange={handleTaskFormChange}
                    className={!taskForm.module ? "border-danger" : ""}
                    size="sm"
                    required
                  >
                <option value="">Select Module</option>
                {dropdownOptions.modules.map((module) => (
                  <option key={module.id} value={module.id}>{module.name}</option>
                ))}
              </Form.Select>
            </Form.Group>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold small">Type <span className="text-danger">*</span></Form.Label>
                  <Form.Select
                    name="type"
                    value={taskForm.type}
                    onChange={handleTaskFormChange}
                    className={!taskForm.type ? "border-danger" : ""}
                    size="sm"
                    required
                  >
                <option value="">Select Type</option>
                {dropdownOptions.types.map((type) => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </Form.Select>
            </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold small">Subtype <span className="text-danger">*</span></Form.Label>
              <Form.Select
                name="subType"
                    value={taskForm.subType}
                    onChange={handleTaskFormChange}
                    disabled={!taskForm.type}
                    className={!taskForm.subType ? "border-danger" : ""}
                    size="sm"
                    required
                  >
                    <option value="">Select Subtype</option>
                    {dropdownOptions.subtypes
                      .filter((subtype) => subtype.type_id === parseInt(taskForm.type))
                      .map((subtype) => (
                        <option key={subtype.id} value={subtype.id}>
                          {subtype.name}
                        </option>
                      ))}
                  </Form.Select>
                </Form.Group>
              </div>
            </div>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold small">Resource <span className="text-danger">*</span></Form.Label>
              <Form.Select 
                name="resource" 
                value={taskForm.resource} 
                onChange={handleTaskFormChange}
                className={!taskForm.resource ? "border-danger" : ""}
                size="sm"
                required
              >
                <option value="">Select Resource</option>
                {getFilteredUsers().map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.first_name} {user.last_name}
                  </option>
                  ))}
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="bg-light py-2">
          <BootstrapButton variant="secondary" size="sm" onClick={() => setShowModal(false)}>
            Cancel
          </BootstrapButton>
          <BootstrapButton variant="primary" size="sm" onClick={handleSaveTask}>
            Save Task
          </BootstrapButton>
        </Modal.Footer>
      </Modal>
    </ThemeProvider>
  );
};

export default EmployeeHomeScreen;