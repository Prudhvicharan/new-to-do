import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log(
      `🔄 API Request: ${config.method?.toUpperCase()} ${config.url}`
    );
    return config;
  },
  (error) => {
    console.error("❌ Request Error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error("❌ API Error:", {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      url: error.config?.url,
    });

    // Handle specific error cases
    if (error.code === "ECONNREFUSED") {
      throw new Error(
        "Backend server is not running. Please start the server on port 5000."
      );
    }

    if (error.response?.status === 404) {
      throw new Error(
        "API endpoint not found. Please check the server configuration."
      );
    }

    if (error.response?.status >= 500) {
      throw new Error("Server error. Please try again later.");
    }

    throw error;
  }
);

export const taskApi = {
  // Test connection
  testConnection: async () => {
    try {
      const response = await api.get("/test");
      return response.data;
    } catch (error) {
      throw new Error(`Connection test failed: ${error.message}`);
    }
  },

  // Get all tasks with optional filters
  getAllTasks: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append("status", filters.status);
      if (filters.priority) params.append("priority", filters.priority);

      const response = await api.get(`/tasks?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch tasks: ${error.message}`);
    }
  },

  // Get single task
  getTask: async (id) => {
    try {
      const response = await api.get(`/tasks/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch task: ${error.message}`);
    }
  },

  // Create new task
  createTask: async (taskData) => {
    try {
      // Ensure dueDate is properly formatted
      const formattedTask = {
        ...taskData,
        dueDate:
          taskData.dueDate instanceof Date
            ? taskData.dueDate.toISOString()
            : taskData.dueDate,
      };

      const response = await api.post("/tasks", formattedTask);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to create task: ${error.message}`);
    }
  },

  // Update task
  updateTask: async (id, taskData) => {
    try {
      // Ensure dueDate is properly formatted
      const formattedTask = {
        ...taskData,
        dueDate:
          taskData.dueDate instanceof Date
            ? taskData.dueDate.toISOString()
            : taskData.dueDate,
      };

      const response = await api.put(`/tasks/${id}`, formattedTask);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to update task: ${error.message}`);
    }
  },

  // Delete task
  deleteTask: async (id) => {
    try {
      const response = await api.delete(`/tasks/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to delete task: ${error.message}`);
    }
  },

  // Update task status
  updateTaskStatus: async (id, status) => {
    try {
      const response = await api.patch(`/tasks/${id}/status`, { status });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to update task status: ${error.message}`);
    }
  },
};
