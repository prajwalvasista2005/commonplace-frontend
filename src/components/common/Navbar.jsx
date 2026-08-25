import { useState } from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import {
  AppBar,
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
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import { useAuth } from '../../hooks/useAuth';
import { useThemeMode } from '../../context/ThemeContext';

const navItems = [
  { label: 'Feed', path: '/', icon: HomeOutlinedIcon, protected: true },
  { label: 'Create Post', path: '/create-post', icon: AddCircleOutlineIcon, protected: true },
  { label: 'Profile', path: '/profile', icon: PersonOutlineIcon, protected: true },
];

function Logo() {
  return (
    <Box
      component={RouterLink}
      to="/"
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        textDecoration: 'none',
        color: 'inherit',
        '&:hover': { opacity: 0.9 },
      }}
      aria-label="Commonplace home"
    >
      <Box
        component="img"
        src="/favicon.svg"
        alt=""
        sx={{ width: 32, height: 32, borderRadius: 1 }}
      />
      <Typography
        variant="h6"
        component="span"
        sx={{
          fontFamily: '"Fraunces", serif',
          fontWeight: 600,
          letterSpacing: '-0.01em',
          display: { xs: 'none', sm: 'block' },
        }}
      >
        Commonplace
      </Typography>
    </Box>
  );
}

export default function Navbar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const { isDark, toggleTheme } = useThemeMode();
  const location = useLocation();
  const navigate = useNavigate();

  const visibleNavItems = navItems.filter((item) => !item.protected || isAuthenticated);

  const handleLogout = async () => {
    setDrawerOpen(false);
    await logout();
    navigate('/login');
  };

  const navLink = (path) => location.pathname === path;

  const drawerContent = (
    <Box sx={{ width: 260, pt: 1 }} role="presentation">
      <Box sx={{ px: 2, py: 1.5 }}>
        <Logo />
      </Box>
      <Divider />
      <List>
        {visibleNavItems.map(({ label, path, icon: Icon }) => (
          <ListItem key={path} disablePadding>
            <ListItemButton
              component={RouterLink}
              to={path}
              selected={navLink(path)}
              onClick={() => setDrawerOpen(false)}
            >
              <ListItemIcon>
                <Icon />
              </ListItemIcon>
              <ListItemText primary={label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={toggleTheme}>
            <ListItemIcon>
              {isDark ? <LightModeOutlinedIcon /> : <DarkModeOutlinedIcon />}
            </ListItemIcon>
            <ListItemText primary={isDark ? 'Light mode' : 'Dark mode'} />
          </ListItemButton>
        </ListItem>
        {isAuthenticated ? (
          <ListItem disablePadding>
            <ListItemButton onClick={handleLogout}>
              <ListItemIcon>
                <LogoutOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary="Log out" />
            </ListItemButton>
          </ListItem>
        ) : (
          <>
            <ListItem disablePadding>
              <ListItemButton component={RouterLink} to="/login" onClick={() => setDrawerOpen(false)}>
                <ListItemIcon>
                  <LoginOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="Log in" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={RouterLink} to="/register" onClick={() => setDrawerOpen(false)}>
                <ListItemIcon>
                  <PersonAddOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="Register" />
              </ListItemButton>
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper',
          color: 'text.primary',
        }}
      >
        <Toolbar sx={{ gap: 1 }}>
          {isMobile && (
            <IconButton
              edge="start"
              color="inherit"
              aria-label="Open navigation menu"
              onClick={() => setDrawerOpen(true)}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Logo />

          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, ml: 3, flexGrow: 1 }}>
              {visibleNavItems.map(({ label, path }) => (
                <Button
                  key={path}
                  component={RouterLink}
                  to={path}
                  color="inherit"
                  variant="text"
                  size="small"
                  sx={{
                    minWidth: 'auto',
                    px: 2,
                    borderRadius: 0,
                    borderBottom: '2px solid',
                    borderColor: navLink(path) ? 'warning.main' : 'transparent',
                    color: navLink(path) ? 'text.primary' : 'text.secondary',
                    fontWeight: navLink(path) ? 700 : 600,
                  }}
                >
                  {label}
                </Button>
              ))}
            </Box>
          )}

          <Box sx={{ flexGrow: isMobile ? 1 : 0 }} />

          <Tooltip title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}>
            <IconButton
              color="inherit"
              onClick={toggleTheme}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? <LightModeOutlinedIcon /> : <DarkModeOutlinedIcon />}
            </IconButton>
          </Tooltip>

          {!isMobile && (
            <>
              {isAuthenticated ? (
                <Button
                  color="inherit"
                  startIcon={<LogoutOutlinedIcon />}
                  onClick={handleLogout}
                  sx={{ ml: 0.5 }}
                >
                  Log out
                </Button>
              ) : (
                <Box sx={{ display: 'flex', gap: 1, ml: 0.5 }}>
                  <Button component={RouterLink} to="/login" color="inherit" variant="text">
                    Log in
                  </Button>
                  <Button component={RouterLink} to="/register" variant="contained" color="primary">
                    Register
                  </Button>
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
        ModalProps={{ keepMounted: true }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
}
