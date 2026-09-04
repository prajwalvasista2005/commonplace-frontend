import { Link as RouterLink, Outlet, useLocation } from 'react-router-dom';
import { Box, Container, Divider, Link, Stack, Typography } from '@mui/material';
import Navbar from './Navbar';
import ScrollToTop from './ScrollToTop';

export default function Layout() {
  const location = useLocation();
  const isAuthPage = ['/login', '/register'].includes(location.pathname);
  const isLegalPage = ['/terms', '/privacy'].includes(location.pathname);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <Navbar />
      <Box
        component="main"
        id="main-content"
        sx={{
          flexGrow: 1,
          py: isAuthPage || isLegalPage ? 0 : 3,
        }}
      >
        {isAuthPage ? (
          <Outlet />
        ) : isLegalPage ? (
          <Outlet />
        ) : (
          <Container maxWidth="md">
            <Outlet />
          </Container>
        )}
      </Box>
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          borderTop: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper',
          mt: 'auto',
        }}
      >
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          justifyContent="center"
          alignItems="center"
          divider={<Divider orientation="vertical" flexItem />}
          sx={{ opacity: 0.7 }}
        >
          <Typography variant="caption" color="text.secondary">
            &copy; {new Date().getFullYear()} Commonplace
          </Typography>
          <Link component={RouterLink} to="/terms" underline="hover" color="text.secondary">
            <Typography variant="caption">Terms</Typography>
          </Link>
          <Link component={RouterLink} to="/privacy" underline="hover" color="text.secondary">
            <Typography variant="caption">Privacy</Typography>
          </Link>
        </Stack>
      </Box>
      <ScrollToTop />
    </Box>
  );
}
