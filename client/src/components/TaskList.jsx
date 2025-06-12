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
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as UncheckedIcon,
} from "@mui/icons-material";
import { format } from "date-fns";
import TaskForm from "./TaskForm";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { taskApi } from "../services/api";

const priorityColors = {
  low: "success",
  medium: "warning",
  high: "error",
};

const TaskList = () => {
  const [filters, setFilters] = useState({ status: "", priority: "" });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [connectionError, setConnectionError] = useState(null);
  const queryClient = useQueryClient();

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
    enabled: !connectionError, // Only fetch if connection is OK
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
      <Box>
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
        >
          <Typography variant="h6">Backend Connection Error</Typography>
          <Typography>{connectionError}</Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Make sure the backend server is running on port 5000.
          </Typography>
        </Alert>
      </Box>
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading tasks...</Typography>
      </Box>
    );
  }

  // Show query error
  if (error) {
    return (
      <Alert
        severity="error"
        action={
          <Button color="inherit" size="small" onClick={() => refetch()}>
            Retry
          </Button>
        }
      >
        <Typography variant="h6">Error Loading Tasks</Typography>
        <Typography>{error.message}</Typography>
      </Alert>
    );
  }

  return (
    <Box>
      <Box
        sx={{
          mb: 3,
          display: "flex",
          gap: 2,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={filters.status}
            label="Status"
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Priority</InputLabel>
          <Select
            value={filters.priority}
            label="Priority"
            onChange={(e) =>
              setFilters({ ...filters, priority: e.target.value })
            }
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="low">Low</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="high">High</MenuItem>
          </Select>
        </FormControl>

        <Button
          variant="contained"
          color="primary"
          onClick={() => setIsFormOpen(true)}
          disabled={createMutation.isLoading}
        >
          {createMutation.isLoading ? "Creating..." : "CREATE TASK"}
        </Button>
      </Box>

      {tasks.length === 0 ? (
        <Alert severity="info">
          <Typography>
            No tasks found. Create your first task to get started!
          </Typography>
        </Alert>
      ) : (
        <Stack spacing={2}>
          {tasks.map((task) => (
            <Card
              key={task._id}
              sx={{ opacity: task.status === "completed" ? 0.7 : 1 }}
            >
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        textDecoration:
                          task.status === "completed" ? "line-through" : "none",
                        mb: 1,
                      }}
                    >
                      {task.title}
                    </Typography>
                    {task.description && (
                      <Typography color="text.secondary" sx={{ mb: 1 }}>
                        {task.description}
                      </Typography>
                    )}
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                      <Chip
                        label={task.priority.toUpperCase()}
                        color={priorityColors[task.priority]}
                        size="small"
                      />
                      <Chip
                        label={format(new Date(task.dueDate), "MMM dd, yyyy")}
                        variant="outlined"
                        size="small"
                      />
                      <Chip
                        label={task.status.toUpperCase()}
                        color={
                          task.status === "completed" ? "success" : "default"
                        }
                        variant="outlined"
                        size="small"
                      />
                    </Stack>
                  </Box>
                  <Box sx={{ display: "flex", flexDirection: "column", ml: 2 }}>
                    <IconButton
                      onClick={() => handleStatusToggle(task._id, task.status)}
                      disabled={statusMutation.isLoading}
                      title={
                        task.status === "completed"
                          ? "Mark as pending"
                          : "Mark as completed"
                      }
                    >
                      {task.status === "completed" ? (
                        <CheckCircleIcon color="success" />
                      ) : (
                        <UncheckedIcon />
                      )}
                    </IconButton>
                    <IconButton
                      onClick={() => handleEditClick(task)}
                      disabled={updateMutation.isLoading}
                      title="Edit task"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeleteTask(task._id)}
                      disabled={deleteMutation.isLoading}
                      title="Delete task"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}

      <TaskForm
        open={isFormOpen}
        handleClose={handleFormClose}
        onSubmit={selectedTask ? handleUpdateTask : handleCreateTask}
        initialData={selectedTask}
      />
    </Box>
  );
};

export default TaskList;
