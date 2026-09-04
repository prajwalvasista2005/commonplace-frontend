import { useState } from "react";

import {
  Link as RouterLink,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  AppBar,
  Avatar,
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";

import { useAuth } from "../../hooks/useAuth";
import { useThemeMode } from "../../context/ThemeContext";

function Logo() {
  return (
    <Box
      component={RouterLink}
      to="/"
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.25,
        textDecoration: "none",
        color: "inherit",
        "&:hover": {
          opacity: 0.9,
        },
      }}
      aria-label="Commonplace home"
    >
      <Box
        component="img"
        src="/favicon.svg"
        alt=""
        sx={{
          width: 32,
          height: 32,
          borderRadius: 1.5,
        }}
      />

      <Typography
        variant="h6"
        component="span"
        sx={{
          fontWeight: 700,
          letterSpacing: "-0.02em",
          fontSize: "1.25rem",
          color: "text.primary",
        }}
      >
        Commonplace
      </Typography>
    </Box>
  );
}

export default function Navbar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [drawerOpen, setDrawerOpen] = useState(false);

  const { user, isAuthenticated, logout } = useAuth();
  const { isDark, toggleTheme } = useThemeMode();

  const location = useLocation();
  const navigate = useNavigate();

  const isAuthPage =
    location.pathname === "/login" ||
    location.pathname === "/register";

  const handleLogout = async () => {
    setDrawerOpen(false);

    await logout();
    navigate("/login");
  };

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }

    return location.pathname.startsWith(path);
  };

  const drawerContent = (
    <Box
      sx={{
        width: 280,
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
      role="presentation"
    >
      {/* Drawer Header */}
      <Box
        sx={{
          px: 2.5,
          py: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Logo />

        <IconButton
          size="small"
          onClick={() => setDrawerOpen(false)}
          aria-label="Close menu"
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <Divider />

      {/* User Profile */}
      {isAuthenticated && user && (
        <Box
          component={RouterLink}
          to="/profile"
          onClick={() => setDrawerOpen(false)}
          sx={{
            px: 2.5,
            py: 2,
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            textDecoration: "none",
            color: "inherit",
            transition: "background-color 0.15s ease",
            bgcolor: (t) =>
              t.palette.mode === "light"
                ? "rgba(14, 77, 85, 0.04)"
                : "rgba(237, 243, 243, 0.04)",
            "&:hover": {
              bgcolor: (t) =>
                t.palette.mode === "light"
                  ? "rgba(14, 77, 85, 0.08)"
                  : "rgba(237, 243, 243, 0.08)",
            },
          }}
        >
          <Avatar
            src={user.profile_picture_url || undefined}
            alt={user.username}
            sx={{
              width: 42,
              height: 42,
              bgcolor: "primary.main",
              fontWeight: 600,
            }}
          >
            {user.username?.charAt(0)?.toUpperCase()}
          </Avatar>

          <Box
            sx={{
              minWidth: 0,
              flex: 1,
            }}
          >
            <Typography
              variant="subtitle2"
              noWrap
              sx={{
                fontWeight: 650,
                lineHeight: 1.2,
              }}
            >
              {user.username}
            </Typography>

            <Typography
              variant="caption"
              color="text.secondary"
              noWrap
              sx={{
                display: "block",
                mt: 0.25,
              }}
            >
              View profile →
            </Typography>
          </Box>
        </Box>
      )}

      {isAuthenticated && <Divider />}

      {/* Navigation */}
      <List
        sx={{
          px: 1.5,
          py: 1.5,
        }}
      >
        {isAuthenticated && (
          <>
            <ListItem
              disablePadding
              sx={{
                mb: 0.5,
              }}
            >
              <ListItemButton
                component={RouterLink}
                to="/"
                selected={isActive("/")}
                onClick={() => setDrawerOpen(false)}
                sx={{
                  borderRadius: 2,
                  py: 1,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color: isActive("/") ? "primary.main" : "inherit",
                  }}
                >
                  <HomeOutlinedIcon />
                </ListItemIcon>

                <ListItemText
                  primary="Feed"
                  primaryTypographyProps={{
                    fontWeight: isActive("/") ? 650 : 500,
                  }}
                />
              </ListItemButton>
            </ListItem>

            <ListItem
              disablePadding
              sx={{
                mb: 0.5,
              }}
            >
              <ListItemButton
                component={RouterLink}
                to="/create-post"
                selected={isActive("/create-post")}
                onClick={() => setDrawerOpen(false)}
                sx={{
                  borderRadius: 2,
                  py: 1,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color: isActive("/create-post")
                      ? "primary.main"
                      : "inherit",
                  }}
                >
                  <AddCircleOutlineIcon />
                </ListItemIcon>

                <ListItemText
                  primary="Create post"
                  primaryTypographyProps={{
                    fontWeight: isActive("/create-post") ? 650 : 500,
                  }}
                />
              </ListItemButton>
            </ListItem>
          </>
        )}
      </List>

      <Box sx={{ flex: 1 }} />

      <Divider />

      {/* Mobile Logout */}
      {isAuthenticated && (
        <List
          sx={{
            px: 1.5,
            py: 1.5,
          }}
        >
          <ListItem disablePadding>
            <ListItemButton
              onClick={handleLogout}
              sx={{
                borderRadius: 2,
                py: 1,
                color: "error.main",
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 40,
                  color: "error.main",
                }}
              >
                <LogoutOutlinedIcon />
              </ListItemIcon>

              <ListItemText primary="Sign out" />
            </ListItemButton>
          </ListItem>
        </List>
      )}
    </Box>
  );

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          zIndex: (t) => t.zIndex.drawer + 1,
        }}
      >
        <Toolbar
          sx={{
            px: {
              xs: 2,
              sm: 3,
            },
            minHeight: {
              xs: 58,
              sm: 64,
            },
            gap: 1,
          }}
        >
          {/* Mobile Menu */}
          {isMobile && !isAuthPage && (
            <IconButton
              edge="start"
              aria-label="Open navigation menu"
              onClick={() => setDrawerOpen(true)}
              sx={{
                mr: 0.5,
                color: "text.primary",
              }}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Logo />

          {/* Desktop Primary Navigation */}
          {!isMobile && isAuthenticated && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                ml: 4,
              }}
            >
              <Button
                component={RouterLink}
                to="/"
                color="inherit"
                variant="text"
                sx={{
                  px: 2,
                  py: 0.75,
                  borderRadius: 2,
                  fontWeight: isActive("/") ? 650 : 500,
                  color: isActive("/")
                    ? "primary.main"
                    : "text.secondary",
                  bgcolor: isActive("/")
                    ? (t) =>
                        t.palette.mode === "light"
                          ? "rgba(14, 77, 85, 0.08)"
                          : "rgba(27, 106, 117, 0.15)"
                    : "transparent",
                  "&:hover": {
                    color: "text.primary",
                  },
                }}
              >
                Feed
              </Button>

              <Button
                component={RouterLink}
                to="/create-post"
                color="inherit"
                variant="text"
                sx={{
                  px: 2,
                  py: 0.75,
                  borderRadius: 2,
                  fontWeight: isActive("/create-post") ? 650 : 500,
                  color: isActive("/create-post")
                    ? "primary.main"
                    : "text.secondary",
                  bgcolor: isActive("/create-post")
                    ? (t) =>
                        t.palette.mode === "light"
                          ? "rgba(14, 77, 85, 0.08)"
                          : "rgba(27, 106, 117, 0.15)"
                    : "transparent",
                  "&:hover": {
                    color: "text.primary",
                  },
                }}
              >
                Create post
              </Button>
            </Box>
          )}

          <Box sx={{ flexGrow: 1 }} />

          {/* Theme Toggle */}
          <Tooltip
            title={
              isDark
                ? "Switch to light mode"
                : "Switch to dark mode"
            }
          >
            <IconButton
              color="inherit"
              onClick={toggleTheme}
              aria-label={
                isDark
                  ? "Switch to light mode"
                  : "Switch to dark mode"
              }
              size="small"
              sx={{
                p: 1,
                color: "text.secondary",
                "&:hover": {
                  color: "text.primary",
                },
              }}
            >
              {isDark ? (
                <LightModeOutlinedIcon fontSize="small" />
              ) : (
                <DarkModeOutlinedIcon fontSize="small" />
              )}
            </IconButton>
          </Tooltip>

          {/* Desktop Right Actions */}
          {!isMobile && !isAuthPage && (
            <>
              {isAuthenticated && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    ml: 1,
                  }}
                >
                  {/* User Profile */}
                  <Button
                    component={RouterLink}
                    to="/profile"
                    color="inherit"
                    sx={{
                      p: 0.5,
                      pr: 1.5,
                      borderRadius: 6,
                      textTransform: "none",
                      border: 1,
                      borderColor: isActive("/profile")
                        ? "primary.main"
                        : "divider",
                      bgcolor: isActive("/profile")
                        ? (t) =>
                            t.palette.mode === "light"
                              ? "rgba(14, 77, 85, 0.06)"
                              : "rgba(27, 106, 117, 0.12)"
                        : "transparent",
                    }}
                  >
                    <Avatar
                      src={user?.profile_picture_url || undefined}
                      alt={user?.username || "Profile"}
                      sx={{
                        width: 28,
                        height: 28,
                        fontSize: "0.8rem",
                        mr: 1,
                        bgcolor: "primary.main",
                        fontWeight: 600,
                      }}
                    >
                      {user?.username?.charAt(0)?.toUpperCase()}
                    </Avatar>

                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 650,
                        color: "text.primary",
                      }}
                    >
                      {user?.username}
                    </Typography>
                  </Button>

                  {/* Desktop Logout */}
                  <Tooltip title="Sign out">
                    <IconButton
                      color="inherit"
                      onClick={handleLogout}
                      aria-label="Sign out"
                      size="small"
                      sx={{
                        color: "text.secondary",
                        "&:hover": {
                          color: "error.main",
                        },
                      }}
                    >
                      <LogoutOutlinedIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              )}
            </>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        ModalProps={{
          keepMounted: true,
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
}