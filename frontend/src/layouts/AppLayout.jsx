import DashboardIcon from "@mui/icons-material/Dashboard";
import DomainIcon from "@mui/icons-material/Domain";
import LogoutIcon from "@mui/icons-material/Logout";
import TaskIcon from "@mui/icons-material/Task";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import {
  AppBar,
  Box,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const drawerWidth = 240;

const navItems = [
  { label: "Dashboard", to: "/", icon: <DashboardIcon /> },
  { label: "Leads", to: "/leads", icon: <PersonAddAlt1Icon /> },
  { label: "Companies", to: "/companies", icon: <DomainIcon /> },
  { label: "Tasks", to: "/tasks", icon: <TaskIcon /> },
];

export function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            bgcolor: "#0f172a",
            color: "#fff",
          },
        }}
      >
        <Toolbar>
          <Typography variant="h5">MINI CRM</Typography>
        </Toolbar>
        <Divider sx={{ borderColor: "rgba(255,255,255,0.12)" }} />
        <List sx={{ px: 1.5, py: 2 }}>
          {navItems.map((item) => (
            <ListItemButton
              component={NavLink}
              to={item.to}
              key={item.to}
              sx={{
                borderRadius: 2,
                mb: 1,
                color: "#fff",
                "&.active": {
                  bgcolor: "rgba(255,255,255,0.12)",
                },
              }}
            >
              <ListItemIcon sx={{ color: "inherit" }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>

      <Box sx={{ flexGrow: 1 }}>
        <AppBar
          position="static"
          color="inherit"
          elevation={0}
          sx={{ borderBottom: "1px solid", borderColor: "divider" }}
        >
          <Toolbar>
            <Stack direction="row" alignItems="center" justifyContent="space-between" width="100%">
              <Typography variant="h6">{user?.name}</Typography>
              <ListItemButton
                onClick={handleLogout}
                sx={{ width: "auto", borderRadius: 2, flexGrow: 0 }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItemButton>
            </Stack>
          </Toolbar>
        </AppBar>

        <Box sx={{ p: 3 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
