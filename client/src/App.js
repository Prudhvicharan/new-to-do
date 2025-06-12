import React, { useState, createContext, useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Box,
  Container,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Switch,
  FormControlLabel,
  Tooltip,
  Paper,
  useMediaQuery,
} from "@mui/material";
import {
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  Task as TaskIcon,
  Dashboard as DashboardIcon,
} from "@mui/icons-material";
import TaskList from "./components/TaskList";

// Theme Context
const ThemeContext = createContext();
export const useThemeMode = () => useContext(ThemeContext);

// Enhanced Theme Configuration
const getDesignTokens = (mode) => ({
  palette: {
    mode,
    ...(mode === "light"
      ? {
          // Light theme colors
          primary: {
            main: "#6366f1",
            light: "#818cf8",
            dark: "#4f46e5",
          },
          secondary: {
            main: "#ec4899",
            light: "#f472b6",
            dark: "#db2777",
          },
          background: {
            default: "#f8fafc",
            paper: "#ffffff",
          },
          text: {
            primary: "#1e293b",
            secondary: "#64748b",
          },
        }
      : {
          // Dark theme colors
          primary: {
            main: "#818cf8",
            light: "#a5b4fc",
            dark: "#6366f1",
          },
          secondary: {
            main: "#f472b6",
            light: "#fbbf24",
            dark: "#ec4899",
          },
          background: {
            default: "#0f172a",
            paper: "#1e293b",
          },
          text: {
            primary: "#f1f5f9",
            secondary: "#cbd5e1",
          },
          success: {
            main: "#10b981",
            light: "#34d399",
            dark: "#059669",
          },
          warning: {
            main: "#f59e0b",
            light: "#fbbf24",
            dark: "#d97706",
          },
          error: {
            main: "#ef4444",
            light: "#f87171",
            dark: "#dc2626",
          },
        }),
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
      letterSpacing: "-0.025em",
    },
    h6: {
      fontWeight: 600,
      letterSpacing: "-0.015em",
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarWidth: "thin",
          scrollbarColor:
            mode === "dark" ? "#6b7280 #374151" : "#d1d5db #f3f4f6",
          "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
            width: 8,
          },
          "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
            borderRadius: 8,
            backgroundColor: mode === "dark" ? "#6b7280" : "#d1d5db",
            minHeight: 24,
            border: `2px solid ${mode === "dark" ? "#374151" : "#f3f4f6"}`,
          },
          "&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus":
            {
              backgroundColor: mode === "dark" ? "#9ca3af" : "#9ca3af",
            },
          "&::-webkit-scrollbar-thumb:active, & *::-webkit-scrollbar-thumb:active":
            {
              backgroundColor: mode === "dark" ? "#9ca3af" : "#6b7280",
            },
          "&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover":
            {
              backgroundColor: mode === "dark" ? "#9ca3af" : "#9ca3af",
            },
          "&::-webkit-scrollbar-corner, & *::-webkit-scrollbar-corner": {
            backgroundColor: mode === "dark" ? "#374151" : "#f3f4f6",
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: mode === "dark" ? "#1e293b" : "#ffffff",
          boxShadow:
            mode === "dark"
              ? "0 1px 3px 0 rgba(0, 0, 0, 0.2), 0 1px 2px 0 rgba(0, 0, 0, 0.12)"
              : "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
          borderBottom: `1px solid ${mode === "dark" ? "#334155" : "#e2e8f0"}`,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: "10px 20px",
          fontWeight: 600,
          textTransform: "none",
          boxShadow: "none",
          "&:hover": {
            boxShadow:
              "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            transform: "translateY(-1px)",
          },
          transition: "all 0.2s ease-in-out",
        },
        contained: {
          "&:hover": {
            boxShadow:
              "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          border: `1px solid ${mode === "dark" ? "#334155" : "#e2e8f0"}`,
          boxShadow:
            mode === "dark"
              ? "0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.12)"
              : "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
          "&:hover": {
            boxShadow:
              mode === "dark"
                ? "0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.15)"
                : "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            transform: "translateY(-2px)",
          },
          transition: "all 0.3s ease-in-out",
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          "&:hover": {
            transform: "scale(1.05)",
          },
          transition: "all 0.2s ease-in-out",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
          border: `1px solid ${mode === "dark" ? "#334155" : "#e2e8f0"}`,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
          },
        },
      },
    },
  },
});

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [mode, setMode] = useState(prefersDarkMode ? "dark" : "light");

  const theme = React.useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  const toggleColorMode = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ mode, toggleColorMode }}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Router>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                minHeight: "100vh",
                background:
                  mode === "dark"
                    ? "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)"
                    : "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)",
              }}
            >
              <AppBar position="static" elevation={0}>
                <Toolbar sx={{ justifyContent: "space-between" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Paper
                      sx={{
                        p: 1,
                        borderRadius: 2,
                        background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      }}
                    >
                      <TaskIcon sx={{ color: "white", fontSize: 28 }} />
                    </Paper>
                    <Box>
                      <Typography
                        variant="h6"
                        component="div"
                        sx={{
                          fontWeight: 700,
                          color: theme.palette.text.primary,
                          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                          backgroundClip: "text",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                        }}
                      >
                        TaskFlow Pro
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: theme.palette.text.secondary,
                          fontWeight: 500,
                        }}
                      >
                        Organize • Prioritize • Achieve
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Tooltip
                      title={`Switch to ${
                        mode === "dark" ? "light" : "dark"
                      } mode`}
                    >
                      <FormControlLabel
                        control={
                          <Switch
                            checked={mode === "dark"}
                            onChange={toggleColorMode}
                            icon={<LightModeIcon />}
                            checkedIcon={<DarkModeIcon />}
                            sx={{
                              "& .MuiSwitch-switchBase.Mui-checked": {
                                color: theme.palette.primary.main,
                              },
                              "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                                {
                                  backgroundColor: theme.palette.primary.main,
                                },
                            }}
                          />
                        }
                        label=""
                        sx={{ m: 0 }}
                      />
                    </Tooltip>
                  </Box>
                </Toolbar>
              </AppBar>

              <Container
                component="main"
                maxWidth="lg"
                sx={{
                  mt: 4,
                  mb: 4,
                  flex: 1,
                  px: { xs: 2, sm: 3 },
                }}
              >
                <Routes>
                  <Route path="/" element={<TaskList />} />
                </Routes>
              </Container>
            </Box>
          </Router>
        </ThemeProvider>
      </QueryClientProvider>
    </ThemeContext.Provider>
  );
}

export default App;
