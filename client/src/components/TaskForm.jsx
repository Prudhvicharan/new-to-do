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
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const TaskForm = ({ open, handleClose, onSubmit, initialData }) => {
  const safeInitialData = initialData || {};

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
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
    <Dialog open={open} onClose={handleFormClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {safeInitialData._id ? "Edit Task" : "Create New Task"}
      </DialogTitle>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
            <TextField
              label="Title"
              fullWidth
              {...register("title", {
                required: "Title is required",
                minLength: {
                  value: 3,
                  message: "Title must be at least 3 characters long",
                },
              })}
              error={!!errors.title}
              helperText={errors.title?.message}
            />

            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              {...register("description")}
            />

            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Controller
                name="dueDate"
                control={control}
                rules={{ required: "Due date is required" }}
                render={({ field, fieldState: { error } }) => (
                  <DatePicker
                    label="Due Date"
                    value={field.value}
                    onChange={(newValue) => field.onChange(newValue)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!error,
                        helperText: error?.message,
                      },
                    }}
                  />
                )}
              />
            </LocalizationProvider>

            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                label="Priority"
                {...register("priority")}
                defaultValue="medium"
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleFormClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            {safeInitialData._id ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default TaskForm;
