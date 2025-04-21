import React, { useState, useEffect } from 'react';
import Layout from "../components/Layout";
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  TextField, 
  IconButton, 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid,
  Card,
  CardContent,
  Chip,
  Divider,
  Menu,
  List,
  ListItem,
  ListItemText,
  Drawer,
  AppBar,
  Toolbar
} from '@mui/material';
import { 
  Add as AddIcon, 
  MoreVert as MoreVertIcon,
  FilterList as FilterListIcon,
  Search as SearchIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  DragIndicator as DragIndicatorIcon
} from '@mui/icons-material';
import axios from 'axios';

// Mock data for development
const MOCK_ITEMS = [
  { 
    id: 'TASK-1', 
    title: 'Create user authentication flow', 
    description: 'Implement login, register and password reset functionality',
    status: 'To Do', 
    priority: 'High',
    assignee: 'John Doe',
    type: 'Task',
    subtype: 'Backend'
  },
  { 
    id: 'TASK-2', 
    title: 'Design dashboard layout', 
    description: 'Create responsive layout for the main dashboard',
    status: 'In Progress', 
    priority: 'Medium',
    assignee: 'Jane Smith',
    type: 'Design',
    subtype: 'UI/UX'
  },
  { 
    id: 'TASK-3', 
    title: 'API integration for user data', 
    description: 'Connect frontend to backend API for user management',
    status: 'Done', 
    priority: 'Medium',
    assignee: 'Mike Johnson',
    type: 'Task',
    subtype: 'Frontend'
  },
  { 
    id: 'TASK-4', 
    title: 'Fix sidebar navigation bug', 
    description: 'Resolve issue with sidebar navigation not working on mobile',
    status: 'To Do', 
    priority: 'Low',
    assignee: 'Unassigned',
    type: 'Bug',
    subtype: 'UI'
  }
];

const PRIORITY_COLORS = {
  'High': '#ef5350',
  'Medium': '#fb8c00',
  'Low': '#66bb6a'
};

const TYPE_COLORS = {
  'Bug': '#e91e63',
  'Task': '#2196f3',
  'Story': '#9c27b0',
  'Epic': '#6d4c41',
  'Design': '#009688',
  'Documentation': '#795548',
  'Testing': '#ff9800'
};

const TYPE_SUBTYPES = {
  'Bug': ['UI', 'Functionality', 'Performance', 'Security', 'Compatibility'],
  'Task': ['Frontend', 'Backend', 'Database', 'DevOps', 'Configuration'],
  'Story': ['User Journey', 'Feature Enhancement', 'New Feature'],
  'Epic': ['Platform', 'Integration', 'Architecture', 'Release'],
  'Design': ['UI/UX', 'Wireframes', 'Prototypes', 'Graphics'],
  'Documentation': ['User Guide', 'API Docs', 'Technical Specs', 'Requirements'],
  'Testing': ['Unit Tests', 'Integration Tests', 'E2E Tests', 'Performance Tests']
};

const Backlog = () => {
  const [items, setItems] = useState(MOCK_ITEMS);
  const [filteredItems, setFilteredItems] = useState(MOCK_ITEMS);
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newItem, setNewItem] = useState({
    title: '',
    description: '',
    status: 'To Do',
    priority: 'Medium',
    assignee: '',
    type: 'Task',
    subtype: 'Frontend'
  });
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    assignee: '',
    type: '',
    subtype: ''
  });
  
  // In a real app, you would fetch data from your backend
  useEffect(() => {
    // Example API call (commented out)
    // const fetchBacklogItems = async () => {
    //   try {
    //     const response = await axios.get('/api/backlog');
    //     setItems(response.data);
    //     setFilteredItems(response.data);
    //   } catch (error) {
    //     console.error('Error fetching backlog items:', error);
    //   }
    // };
    // fetchBacklogItems();
    
    // Using mock data for now
    setItems(MOCK_ITEMS);
    setFilteredItems(MOCK_ITEMS);
  }, []);
  
  useEffect(() => {
    // Apply filters and search
    let result = [...items];
    
    // Apply search
    if (searchQuery) {
      result = result.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply filters
    if (filters.status) {
      result = result.filter(item => item.status === filters.status);
    }
    if (filters.priority) {
      result = result.filter(item => item.priority === filters.priority);
    }
    if (filters.assignee) {
      result = result.filter(item => item.assignee === filters.assignee);
    }
    if (filters.type) {
      result = result.filter(item => item.type === filters.type);
    }
    if (filters.subtype) {
      result = result.filter(item => item.subtype === filters.subtype);
    }
    
    setFilteredItems(result);
  }, [items, searchQuery, filters]);
  
  const handleAddItem = () => {
    const id = `TASK-${items.length + 1}`;
    const itemWithId = { ...newItem, id };
    
    // In a real app, you would make an API call to save the new item
    // Example:
    // axios.post('/api/backlog', itemWithId)
    //   .then(response => {
    //     setItems([...items, response.data]);
    //     setIsAddItemOpen(false);
    //     setNewItem({
    //       title: '',
    //       description: '',
    //       status: 'To Do',
    //       priority: 'Medium',
    //       assignee: '',
    //       type: 'Task'
    //     });
    //   })
    //   .catch(error => console.error('Error adding backlog item:', error));
    
    // For now, just update the state
    setItems([...items, itemWithId]);
    setIsAddItemOpen(false);
    setNewItem({
      title: '',
      description: '',
      status: 'To Do',
      priority: 'Medium',
      assignee: '',
      type: 'Task',
      subtype: 'Frontend'
    });
  };
  
  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };
  
  const resetFilters = () => {
    setFilters({
      status: '',
      priority: '',
      assignee: '',
      type: '',
      subtype: ''
    });
    setSearchQuery('');
  };
  
  const getUniqueValues = (field) => {
    return [...new Set(items.map(item => item[field]))];
  };
  
  return (
    <Layout>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">Backlog</Typography>
          <Box>
            <Button 
              variant="outlined" 
              startIcon={<FilterListIcon />}
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              sx={{ mr: 1 }}
            >
              Filters
            </Button>
            <Button 
              variant="contained" 
              startIcon={<AddIcon />}
              onClick={() => setIsAddItemOpen(true)}
            >
              Create Issue
            </Button>
          </Box>
        </Box>
        
        {/* Search and Filter Bar */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search issues"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
                size="small"
              />
            </Grid>
            
            {isFilterOpen && (
              <>
                <Grid item xs={12} md={2}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Status</InputLabel>
                    <Select
                      name="status"
                      value={filters.status}
                      onChange={handleFilterChange}
                      label="Status"
                    >
                      <MenuItem value="">All</MenuItem>
                      {getUniqueValues('status').map((status) => (
                        <MenuItem key={status} value={status}>{status}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={2}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Type</InputLabel>
                    <Select
                      name="type"
                      value={filters.type}
                      onChange={handleFilterChange}
                      label="Type"
                    >
                      <MenuItem value="">All</MenuItem>
                      {Object.keys(TYPE_COLORS).map((type) => (
                        <MenuItem key={type} value={type}>{type}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={2}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Subtype</InputLabel>
                    <Select
                      name="subtype"
                      value={filters.subtype}
                      onChange={handleFilterChange}
                      label="Subtype"
                      disabled={!filters.type}
                    >
                      <MenuItem value="">All</MenuItem>
                      {filters.type && TYPE_SUBTYPES[filters.type]?.map((subtype) => (
                        <MenuItem key={subtype} value={subtype}>{subtype}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={2}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Priority</InputLabel>
                    <Select
                      name="priority"
                      value={filters.priority}
                      onChange={handleFilterChange}
                      label="Priority"
                    >
                      <MenuItem value="">All</MenuItem>
                      <MenuItem value="High">High</MenuItem>
                      <MenuItem value="Medium">Medium</MenuItem>
                      <MenuItem value="Low">Low</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={2}>
                  <Button 
                    variant="text" 
                    onClick={resetFilters}
                    fullWidth
                  >
                    Reset Filters
                  </Button>
                </Grid>
              </>
            )}
          </Grid>
        </Paper>
        
        {/* Backlog Items List */}
        <Paper>
          <List>
            {filteredItems.length === 0 ? (
              <ListItem>
                <ListItemText 
                  primary="No items found" 
                  secondary="Try adjusting your filters or create a new item" 
                  sx={{ textAlign: 'center', py: 4 }}
                />
              </ListItem>
            ) : (
              filteredItems.map((item) => (
                <React.Fragment key={item.id}>
                  <ListItem 
                    sx={{ 
                      py: 2,
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.04)'
                      }
                    }}
                    secondaryAction={
                      <IconButton edge="end">
                        <MoreVertIcon />
                      </IconButton>
                    }
                  >
                    <DragIndicatorIcon sx={{ mr: 2, color: 'text.secondary' }} />
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="subtitle1" component="span" sx={{ mr: 1 }}>
                            {item.id}
                          </Typography>
                          <Typography variant="body1" component="span">
                            {item.title}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            {item.description}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            <Chip 
                              label={item.status} 
                              size="small" 
                              variant="outlined"
                            />
                            <Chip 
                              label={item.priority} 
                              size="small"
                              sx={{ 
                                backgroundColor: PRIORITY_COLORS[item.priority],
                                color: 'white'
                              }}
                            />
                            <Chip 
                              label={item.type} 
                              size="small"
                              sx={{ 
                                backgroundColor: TYPE_COLORS[item.type],
                                color: 'white'
                              }}
                            />
                            <Chip 
                              label={item.subtype} 
                              size="small"
                              variant="outlined"
                            />
                            <Chip 
                              label={`Assignee: ${item.assignee}`} 
                              size="small" 
                              variant="outlined"
                            />
                          </Box>
                        </Box>
                      }
                    />
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))
            )}
          </List>
        </Paper>
        
        {/* Add Item Dialog */}
        <Dialog open={isAddItemOpen} onClose={() => setIsAddItemOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>Create New Issue</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Title"
                  value={newItem.title}
                  onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  multiline
                  rows={4}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={newItem.status}
                    onChange={(e) => setNewItem({ ...newItem, status: e.target.value })}
                    label="Status"
                  >
                    <MenuItem value="To Do">To Do</MenuItem>
                    <MenuItem value="In Progress">In Progress</MenuItem>
                    <MenuItem value="Done">Done</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Priority</InputLabel>
                  <Select
                    value={newItem.priority}
                    onChange={(e) => setNewItem({ ...newItem, priority: e.target.value })}
                    label="Priority"
                  >
                    <MenuItem value="High">High</MenuItem>
                    <MenuItem value="Medium">Medium</MenuItem>
                    <MenuItem value="Low">Low</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Type</InputLabel>
                  <Select
                    value={newItem.type}
                    onChange={(e) => {
                      const type = e.target.value;
                      const subtypes = TYPE_SUBTYPES[type] || [];
                      setNewItem({ 
                        ...newItem, 
                        type,
                        subtype: subtypes.length > 0 ? subtypes[0] : ''
                      });
                    }}
                    label="Type"
                  >
                    {Object.keys(TYPE_COLORS).map((type) => (
                      <MenuItem key={type} value={type}>{type}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Subtype</InputLabel>
                  <Select
                    value={newItem.subtype}
                    onChange={(e) => setNewItem({ ...newItem, subtype: e.target.value })}
                    label="Subtype"
                  >
                    {TYPE_SUBTYPES[newItem.type]?.map((subtype) => (
                      <MenuItem key={subtype} value={subtype}>{subtype}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Assignee"
                  value={newItem.assignee}
                  onChange={(e) => setNewItem({ ...newItem, assignee: e.target.value })}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsAddItemOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleAddItem}
              variant="contained"
              disabled={!newItem.title}
            >
              Create
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Layout>
  );
};

export default Backlog; 