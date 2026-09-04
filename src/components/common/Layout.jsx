import { Outlet, useLocation } from 'react-router-dom';
import { Box, Container } from '@mui/material';
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
      <ScrollToTop />
    </Box>
  );
}
