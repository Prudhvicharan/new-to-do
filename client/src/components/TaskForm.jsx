import React from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Paper,
  Avatar,
  Stack,
  Divider,
  Fade,
  Slide,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Close as CloseIcon,
  Save as SaveIcon,
  Edit as EditIcon,
  Add as AddIcon,
  Title as TitleIcon,
  Description as DescriptionIcon,
  Schedule as ScheduleIcon,
  PriorityHigh as HighPriorityIcon,
  Remove as MediumPriorityIcon,
  KeyboardArrowDown as LowPriorityIcon,
} from "@mui/icons-material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useTheme } from "@mui/material/styles";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const priorityOptions = [
  {
    value: "high",
    label: "High Priority",
    icon: HighPriorityIcon,
    color: "#ef4444",
    gradient: "linear-gradient(135deg, #ef4444, #dc2626)",
    description: "Urgent and important tasks",
  },
  {
    value: "medium",
    label: "Medium Priority",
    icon: MediumPriorityIcon,
    color: "#f59e0b",
    gradient: "linear-gradient(135deg, #f59e0b, #d97706)",
    description: "Important but not urgent",
  },
  {
    value: "low",
    label: "Low Priority",
    icon: LowPriorityIcon,
    color: "#10b981",
    gradient: "linear-gradient(135deg, #10b981, #059669)",
    description: "Nice to have tasks",
  },
];

const TaskForm = ({ open, handleClose, onSubmit, initialData, isLoading }) => {
  const theme = useTheme();
  const safeInitialData = initialData || {};

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    defaultValues: {
      title: safeInitialData.title || "",
      description: safeInitialData.description || "",
      dueDate: safeInitialData.dueDate
        ? new Date(safeInitialData.dueDate)
        : new Date(),
      priority: safeInitialData.priority || "medium",
    },
  });

  const selectedPriority = watch("priority");
  const selectedPriorityConfig = priorityOptions.find(
    (p) => p.value === selectedPriority
  );

  const handleFormSubmit = (data) => {
    try {
      onSubmit(data);
      reset();
      handleClose();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleFormClose = () => {
    reset();
    handleClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleFormClose}
      maxWidth="sm"
      fullWidth
      TransitionComponent={Transition}
      PaperProps={{
        sx: {
          borderRadius: 4,
          overflow: "hidden",
          background: theme.palette.background.paper,
        },
      }}
    >
      {/* Header with gradient */}
      <DialogTitle sx={{ p: 0, position: "relative" }}>
        <Paper
          sx={{
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            color: "white",
            p: 3,
            m: 0,
            borderRadius: 0,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar
                sx={{
                  background: "rgba(255, 255, 255, 0.2)",
                  backdropFilter: "blur(10px)",
                }}
              >
                {safeInitialData._id ? <EditIcon /> : <AddIcon />}
              </Avatar>
              <Box>
                <Typography variant="h5" fontWeight={700}>
                  {safeInitialData._id ? "Edit Task" : "Create New Task"}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  {safeInitialData._id
                    ? "Update your task details"
                    : "Add a new task to your list"}
                </Typography>
              </Box>
            </Box>

            <Tooltip title="Close">
              <IconButton
                onClick={handleFormClose}
                sx={{
                  color: "white",
                  "&:hover": {
                    background: "rgba(255, 255, 255, 0.1)",
                  },
                }}
              >
                <CloseIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Paper>
      </DialogTitle>

      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent sx={{ p: 0 }}>
          <Box sx={{ p: 3 }}>
            <Stack spacing={3}>
              {/* Title Field */}
              <Box>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
                >
                  <TitleIcon color="primary" fontSize="small" />
                  <Typography variant="subtitle2" fontWeight={600}>
                    Task Title *
                  </Typography>
                </Box>
                <TextField
                  fullWidth
                  placeholder="Enter a descriptive title for your task"
                  {...register("title", {
                    required: "Title is required",
                    minLength: {
                      value: 3,
                      message: "Title must be at least 3 characters long",
                    },
                  })}
                  error={!!errors.title}
                  helperText={errors.title?.message}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                />
              </Box>

              {/* Description Field */}
              <Box>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
                >
                  <DescriptionIcon color="primary" fontSize="small" />
                  <Typography variant="subtitle2" fontWeight={600}>
                    Description
                  </Typography>
                </Box>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  placeholder="Add more details about your task (optional)"
                  {...register("description")}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                />
              </Box>

              {/* Due Date Field */}
              <Box>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
                >
                  <ScheduleIcon color="primary" fontSize="small" />
                  <Typography variant="subtitle2" fontWeight={600}>
                    Due Date *
                  </Typography>
                </Box>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <Controller
                    name="dueDate"
                    control={control}
                    rules={{ required: "Due date is required" }}
                    render={({ field, fieldState: { error } }) => (
                      <DatePicker
                        label="Select due date"
                        value={field.value}
                        onChange={(newValue) => field.onChange(newValue)}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            error: !!error,
                            helperText: error?.message,
                            sx: {
                              "& .MuiOutlinedInput-root": {
                                borderRadius: 2,
                              },
                            },
                          },
                        }}
                      />
                    )}
                  />
                </LocalizationProvider>
              </Box>

              {/* Priority Field */}
              <Box>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
                >
                  <HighPriorityIcon color="primary" fontSize="small" />
                  <Typography variant="subtitle2" fontWeight={600}>
                    Priority Level
                  </Typography>
                </Box>
                <FormControl fullWidth>
                  <InputLabel>Select priority</InputLabel>
                  <Select
                    label="Select priority"
                    {...register("priority")}
                    defaultValue="medium"
                    sx={{
                      borderRadius: 2,
                      "& .MuiSelect-select": {
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      },
                    }}
                  >
                    {priorityOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                            width: "100%",
                          }}
                        >
                          <Avatar
                            sx={{
                              width: 32,
                              height: 32,
                              background: option.gradient,
                            }}
                          >
                            <option.icon sx={{ fontSize: 18 }} />
                          </Avatar>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="body1" fontWeight={600}>
                              {option.label}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {option.description}
                            </Typography>
                          </Box>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              {/* Priority Preview */}
              {/* {selectedPriorityConfig && (
                <Fade in>
                  <Paper
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      background: `${selectedPriorityConfig.color}10`,
                      border: `1px solid ${selectedPriorityConfig.color}30`,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar
                        sx={{
                          width: 40,
                          height: 40,
                          background: selectedPriorityConfig.gradient,
                        }}
                      >
                        <selectedPriorityConfig.icon />
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1" fontWeight={600}>
                          {selectedPriorityConfig.label}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {selectedPriorityConfig.description}
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                </Fade>
              )} */}
            </Stack>
          </Box>
        </DialogContent>

        <Divider />

        <DialogActions sx={{ p: 3, gap: 2 }}>
          <Button
            onClick={handleFormClose}
            variant="outlined"
            size="large"
            sx={{
              borderRadius: 2,
              px: 3,
              borderColor: theme.palette.divider,
              "&:hover": {
                borderColor: theme.palette.text.secondary,
              },
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={isLoading}
            startIcon={
              isLoading ? (
                <SaveIcon />
              ) : safeInitialData._id ? (
                <SaveIcon />
              ) : (
                <AddIcon />
              )
            }
            sx={{
              borderRadius: 2,
              px: 4,
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              "&:hover": {
                background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
              },
              "&:disabled": {
                background: theme.palette.action.disabledBackground,
              },
            }}
          >
            {isLoading
              ? "Saving..."
              : safeInitialData._id
              ? "Update Task"
              : "Create Task"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default TaskForm;
