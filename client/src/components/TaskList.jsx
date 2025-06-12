import React, { useState } from "react";
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
  const queryClient = useQueryClient();

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["tasks", filters],
    queryFn: () => taskApi.getAllTasks(filters),
  });

  const createMutation = useMutation({
    mutationFn: taskApi.createTask,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => taskApi.updateTask(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: taskApi.deleteTask,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => taskApi.updateTaskStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });

  const handleCreateTask = (data) => {
    createMutation.mutate(data);
  };

  const handleUpdateTask = (data) => {
    updateMutation.mutate({ id: selectedTask.id, data });
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

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box>
      <Box sx={{ mb: 3, display: "flex", gap: 2, alignItems: "center" }}>
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
        >
          Create Task
        </Button>
      </Box>

      <Stack spacing={2}>
        {tasks.map((task) => (
          <Card key={task._id}>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <Box>
                  <Typography
                    variant="h6"
                    sx={{
                      textDecoration:
                        task.status === "completed" ? "line-through" : "none",
                    }}
                  >
                    {task.title}
                  </Typography>
                  <Typography color="text.secondary" sx={{ mb: 1 }}>
                    {task.description}
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    <Chip
                      label={task.priority}
                      color={priorityColors[task.priority]}
                      size="small"
                    />
                    <Chip
                      label={format(new Date(task.dueDate), "MMM dd, yyyy")}
                      variant="outlined"
                      size="small"
                    />
                  </Stack>
                </Box>
                <Box>
                  <IconButton
                    onClick={() => handleStatusToggle(task._id, task.status)}
                  >
                    {task.status === "completed" ? (
                      <CheckCircleIcon color="success" />
                    ) : (
                      <UncheckedIcon />
                    )}
                  </IconButton>
                  <IconButton onClick={() => handleEditClick(task)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteTask(task._id)}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Stack>

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
