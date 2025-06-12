import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Chip,
  Stack,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Paper,
  Grid,
  Fade,
  Grow,
  Tooltip,
  LinearProgress,
  Avatar,
  Divider,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as UncheckedIcon,
  Add as AddIcon,
  TrendingUp as TrendingUpIcon,
  Schedule as ScheduleIcon,
  Assignment as AssignmentIcon,
  FilterList as FilterIcon,
  Dashboard as DashboardIcon,
  PriorityHigh as HighPriorityIcon,
  Remove as MediumPriorityIcon,
  KeyboardArrowDown as LowPriorityIcon,
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon,
} from "@mui/icons-material";
import {
  format,
  isToday,
  isTomorrow,
  isPast,
  differenceInDays,
} from "date-fns";
import TaskForm from "./TaskForm";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { taskApi } from "../services/api";
import { useThemeMode } from "../App";
import { useTheme } from "@mui/material/styles";

const priorityConfig = {
  high: {
    color: "error",
    icon: HighPriorityIcon,
    gradient: "linear-gradient(135deg, #ef4444, #dc2626)",
    bgColor: "rgba(239, 68, 68, 0.1)",
  },
  medium: {
    color: "warning",
    icon: MediumPriorityIcon,
    gradient: "linear-gradient(135deg, #f59e0b, #d97706)",
    bgColor: "rgba(245, 158, 11, 0.1)",
  },
  low: {
    color: "success",
    icon: LowPriorityIcon,
    gradient: "linear-gradient(135deg, #10b981, #059669)",
    bgColor: "rgba(16, 185, 129, 0.1)",
  },
};

const TaskCard = ({ task, onEdit, onDelete, onStatusToggle, isLoading }) => {
  const theme = useTheme();
  const { mode } = useThemeMode();
  const PriorityIcon = priorityConfig[task.priority].icon;

  const dueDate = new Date(task.dueDate);
  const isOverdue = isPast(dueDate) && task.status !== "completed";
  const isDueToday = isToday(dueDate);
  const isDueTomorrow = isTomorrow(dueDate);

  const getDueDateText = () => {
    if (isDueToday) return "Due Today";
    if (isDueTomorrow) return "Due Tomorrow";
    if (isOverdue)
      return `Overdue ${Math.abs(differenceInDays(dueDate, new Date()))} days`;
    return format(dueDate, "MMM dd, yyyy");
  };

  const getDueDateColor = () => {
    if (isOverdue) return theme.palette.error.main;
    if (isDueToday) return theme.palette.warning.main;
    if (isDueTomorrow) return theme.palette.info.main;
    return theme.palette.text.secondary;
  };

  return (
    <Grow in timeout={300}>
      <Card
        sx={{
          position: "relative",
          overflow: "hidden",
          opacity: task.status === "completed" ? 0.75 : 1,
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            width: "4px",
            height: "100%",
            background: priorityConfig[task.priority].gradient,
          },
        }}
      >
        <CardContent sx={{ pb: 2 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <Box sx={{ flex: 1, pr: 2 }}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
              >
                <Avatar
                  sx={{
                    width: 24,
                    height: 24,
                    background: priorityConfig[task.priority].gradient,
                  }}
                >
                  <PriorityIcon sx={{ fontSize: 14 }} />
                </Avatar>
                <Typography
                  variant="h6"
                  sx={{
                    textDecoration:
                      task.status === "completed" ? "line-through" : "none",
                    fontWeight: 600,
                    color:
                      task.status === "completed"
                        ? theme.palette.text.secondary
                        : theme.palette.text.primary,
                  }}
                >
                  {task.title}
                </Typography>
              </Box>

              {task.description && (
                <Typography
                  color="text.secondary"
                  sx={{
                    mb: 2,
                    lineHeight: 1.6,
                    fontSize: "0.95rem",
                  }}
                >
                  {task.description}
                </Typography>
              )}

              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                <Chip
                  icon={<PriorityIcon />}
                  label={task.priority.toUpperCase()}
                  size="small"
                  sx={{
                    background: priorityConfig[task.priority].gradient,
                    color: "white",
                    fontWeight: 600,
                    "& .MuiChip-icon": {
                      color: "white",
                    },
                  }}
                />

                <Chip
                  icon={<CalendarIcon />}
                  label={getDueDateText()}
                  size="small"
                  variant="outlined"
                  sx={{
                    borderColor: getDueDateColor(),
                    color: getDueDateColor(),
                    "& .MuiChip-icon": {
                      color: getDueDateColor(),
                    },
                  }}
                />

                <Chip
                  label={task.status.toUpperCase()}
                  size="small"
                  color={task.status === "completed" ? "success" : "default"}
                  variant={task.status === "completed" ? "filled" : "outlined"}
                />
              </Stack>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
              <Tooltip
                title={
                  task.status === "completed"
                    ? "Mark as pending"
                    : "Mark as completed"
                }
              >
                <IconButton
                  onClick={() => onStatusToggle(task._id, task.status)}
                  disabled={isLoading}
                  sx={{
                    color:
                      task.status === "completed"
                        ? theme.palette.success.main
                        : theme.palette.text.secondary,
                    "&:hover": {
                      backgroundColor:
                        task.status === "completed"
                          ? `${theme.palette.success.main}20`
                          : `${theme.palette.action.hover}`,
                    },
                  }}
                >
                  {task.status === "completed" ? (
                    <CheckCircleIcon />
                  ) : (
                    <UncheckedIcon />
                  )}
                </IconButton>
              </Tooltip>

              <Tooltip title="Edit task">
                <IconButton
                  onClick={() => onEdit(task)}
                  disabled={isLoading}
                  sx={{
                    color: theme.palette.primary.main,
                    "&:hover": {
                      backgroundColor: `${theme.palette.primary.main}20`,
                    },
                  }}
                >
                  <EditIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title="Delete task">
                <IconButton
                  onClick={() => onDelete(task._id)}
                  disabled={isLoading}
                  sx={{
                    color: theme.palette.error.main,
                    "&:hover": {
                      backgroundColor: `${theme.palette.error.main}20`,
                    },
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Grow>
  );
};

const TaskStats = ({ tasks }) => {
  const theme = useTheme();
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(
    (task) => task.status === "completed"
  ).length;
  const pendingTasks = totalTasks - completedTasks;
  const completionRate =
    totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const stats = [
    {
      label: "Total Tasks",
      value: totalTasks,
      icon: AssignmentIcon,
      color: theme.palette.primary.main,
      gradient: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
    },
    {
      label: "Completed",
      value: completedTasks,
      icon: CheckCircleIcon,
      color: theme.palette.success.main,
      gradient: `linear-gradient(135deg, ${theme.palette.success.main}, ${theme.palette.success.dark})`,
    },
    {
      label: "Pending",
      value: pendingTasks,
      icon: ScheduleIcon,
      color: theme.palette.warning.main,
      gradient: `linear-gradient(135deg, ${theme.palette.warning.main}, ${theme.palette.warning.dark})`,
    },
  ];

  return (
    <Paper sx={{ p: 3, mb: 3, borderRadius: 3 }}>
      <Typography
        variant="h6"
        gutterBottom
        sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
      >
        <DashboardIcon /> Task Overview
      </Typography>

      <Grid container spacing={3} sx={{ mb: 2 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={4} key={index}>
            <Paper
              sx={{
                p: 2,
                borderRadius: 2,
                background: stat.gradient,
                color: "white",
                textAlign: "center",
                position: "relative",
                overflow: "hidden",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: "rgba(255, 255, 255, 0.1)",
                  borderRadius: "inherit",
                },
              }}
            >
              <Box sx={{ position: "relative", zIndex: 1 }}>
                <stat.icon sx={{ fontSize: 32, mb: 1 }} />
                <Typography variant="h4" fontWeight="bold">
                  {stat.value}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  {stat.label}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Progress
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {completionRate.toFixed(0)}%
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={completionRate}
          sx={{
            height: 8,
            borderRadius: 4,
            backgroundColor: theme.palette.action.hover,
            "& .MuiLinearProgress-bar": {
              background: `linear-gradient(90deg, ${theme.palette.success.main}, ${theme.palette.primary.main})`,
              borderRadius: 4,
            },
          }}
        />
      </Box>
    </Paper>
  );
};

const TaskList = () => {
  const [filters, setFilters] = useState({ status: "", priority: "" });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [connectionError, setConnectionError] = useState(null);
  const queryClient = useQueryClient();
  const theme = useTheme();
  const { mode } = useThemeMode();

  // Test connection on component mount
  useEffect(() => {
    const testConnection = async () => {
      try {
        await taskApi.testConnection();
        setConnectionError(null);
        console.log("✅ Backend connection successful");
      } catch (error) {
        setConnectionError(error.message);
        console.error("❌ Backend connection failed:", error.message);
      }
    };

    testConnection();
  }, []);

  const {
    data: tasks = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["tasks", filters],
    queryFn: () => taskApi.getAllTasks(filters),
    enabled: !connectionError,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const createMutation = useMutation({
    mutationFn: taskApi.createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      console.log("✅ Task created successfully");
    },
    onError: (error) => {
      console.error("❌ Failed to create task:", error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => taskApi.updateTask(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      console.log("✅ Task updated successfully");
    },
    onError: (error) => {
      console.error("❌ Failed to update task:", error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: taskApi.deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      console.log("✅ Task deleted successfully");
    },
    onError: (error) => {
      console.error("❌ Failed to delete task:", error.message);
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => taskApi.updateTaskStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      console.log("✅ Task status updated successfully");
    },
    onError: (error) => {
      console.error("❌ Failed to update task status:", error.message);
    },
  });

  const handleCreateTask = (data) => {
    createMutation.mutate(data);
  };

  const handleUpdateTask = (data) => {
    updateMutation.mutate({ id: selectedTask._id, data });
  };

  const handleDeleteTask = (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleStatusToggle = (id, currentStatus) => {
    const newStatus = currentStatus === "completed" ? "pending" : "completed";
    statusMutation.mutate({ id, status: newStatus });
  };

  const handleEditClick = (task) => {
    setSelectedTask(task);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedTask(null);
  };

  const handleRetryConnection = () => {
    setConnectionError(null);
    refetch();
  };

  // Show connection error
  if (connectionError) {
    return (
      <Fade in>
        <Alert
          severity="error"
          action={
            <Button
              color="inherit"
              size="small"
              onClick={handleRetryConnection}
            >
              Retry
            </Button>
          }
          sx={{ borderRadius: 2 }}
        >
          <Typography variant="h6">Backend Connection Error</Typography>
          <Typography>{connectionError}</Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Make sure the backend server is running on port 5001.
          </Typography>
        </Alert>
      </Fade>
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <Paper sx={{ p: 4, borderRadius: 3, textAlign: "center" }}>
          <CircularProgress size={60} thickness={4} sx={{ mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            Loading your tasks...
          </Typography>
        </Paper>
      </Box>
    );
  }

  // Show query error
  if (error) {
    return (
      <Fade in>
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={() => refetch()}>
              Retry
            </Button>
          }
          sx={{ borderRadius: 2 }}
        >
          <Typography variant="h6">Error Loading Tasks</Typography>
          <Typography>{error.message}</Typography>
        </Alert>
      </Fade>
    );
  }

  const mutationLoading =
    createMutation.isLoading ||
    updateMutation.isLoading ||
    deleteMutation.isLoading ||
    statusMutation.isLoading;

  return (
    <Box>
      {/* Task Statistics */}
      <TaskStats tasks={tasks} />

      {/* Controls Section */}
      <Paper sx={{ p: 3, mb: 3, borderRadius: 3 }}>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            alignItems: "center",
            flexWrap: "wrap",
            justifyContent: "space-between",
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: 2,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <FilterIcon color="primary" />
              <Typography variant="h6" color="text.primary" fontWeight={600}>
                Filters
              </Typography>
            </Box>

            <FormControl sx={{ minWidth: 140 }} size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={filters.status}
                label="Status"
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value })
                }
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value="">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <AssignmentIcon fontSize="small" />
                    All Tasks
                  </Box>
                </MenuItem>
                <MenuItem value="pending">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <ScheduleIcon fontSize="small" color="warning" />
                    Pending
                  </Box>
                </MenuItem>
                <MenuItem value="completed">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CheckCircleIcon fontSize="small" color="success" />
                    Completed
                  </Box>
                </MenuItem>
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 140 }} size="small">
              <InputLabel>Priority</InputLabel>
              <Select
                value={filters.priority}
                label="Priority"
                onChange={(e) =>
                  setFilters({ ...filters, priority: e.target.value })
                }
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value="">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <TrendingUpIcon fontSize="small" />
                    All Priorities
                  </Box>
                </MenuItem>
                <MenuItem value="high">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <HighPriorityIcon fontSize="small" color="error" />
                    High
                  </Box>
                </MenuItem>
                <MenuItem value="medium">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <MediumPriorityIcon fontSize="small" color="warning" />
                    Medium
                  </Box>
                </MenuItem>
                <MenuItem value="low">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <LowPriorityIcon fontSize="small" color="success" />
                    Low
                  </Box>
                </MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Button
            variant="contained"
            size="large"
            startIcon={<AddIcon />}
            onClick={() => setIsFormOpen(true)}
            disabled={mutationLoading}
            sx={{
              borderRadius: 3,
              px: 3,
              py: 1.5,
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              "&:hover": {
                background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
              },
              boxShadow: `0 4px 15px ${theme.palette.primary.main}40`,
            }}
          >
            {createMutation.isLoading ? "Creating..." : "Create Task"}
          </Button>
        </Box>
      </Paper>

      {/* Tasks Section */}
      <Paper sx={{ borderRadius: 3, overflow: "hidden" }}>
        <Box
          sx={{
            p: 3,
            pb: 1,
            borderBottom: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Typography
            variant="h5"
            fontWeight={700}
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <AssignmentIcon color="primary" />
            Your Tasks
            <Chip
              label={tasks.length}
              size="small"
              color="primary"
              sx={{ ml: 1, fontWeight: 600 }}
            />
          </Typography>
        </Box>

        <Box sx={{ p: 3 }}>
          {tasks.length === 0 ? (
            <Fade in>
              <Box sx={{ textAlign: "center", py: 6 }}>
                <AssignmentIcon
                  sx={{
                    fontSize: 80,
                    color: theme.palette.text.disabled,
                    mb: 2,
                  }}
                />
                <Typography variant="h5" color="text.secondary" gutterBottom>
                  No tasks found
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mb: 3 }}
                >
                  {filters.status || filters.priority
                    ? "Try adjusting your filters or create a new task to get started!"
                    : "Create your first task to get started on your productivity journey!"}
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<AddIcon />}
                  onClick={() => setIsFormOpen(true)}
                  sx={{
                    borderRadius: 3,
                    px: 4,
                    py: 1.5,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  }}
                >
                  Create Your First Task
                </Button>
              </Box>
            </Fade>
          ) : (
            <Stack spacing={2}>
              {tasks.map((task, index) => (
                <Fade in timeout={300 + index * 100} key={task._id}>
                  <div>
                    <TaskCard
                      task={task}
                      onEdit={handleEditClick}
                      onDelete={handleDeleteTask}
                      onStatusToggle={handleStatusToggle}
                      isLoading={mutationLoading}
                    />
                  </div>
                </Fade>
              ))}
            </Stack>
          )}
        </Box>
      </Paper>

      {/* Enhanced Task Form */}
      <TaskForm
        open={isFormOpen}
        handleClose={handleFormClose}
        onSubmit={selectedTask ? handleUpdateTask : handleCreateTask}
        initialData={selectedTask}
        isLoading={mutationLoading}
      />
    </Box>
  );
};

export default TaskList;
