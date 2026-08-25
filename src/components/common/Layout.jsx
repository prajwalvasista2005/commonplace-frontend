import { Outlet, useLocation } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import Navbar from './Navbar';
import ScrollToTop from './ScrollToTop';

export default function Layout() {
  const location = useLocation();
  const isAuthPage = ['/login', '/register'].includes(location.pathname);

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <Navbar />
      <Box
        component="main"
        id="main-content"
        sx={{
          flexGrow: 1,
          py: isAuthPage ? 0 : 3,
          minHeight: 'calc(100vh - 64px)',
        }}
      >
        {isAuthPage ? (
          <Outlet />
        ) : (
          <Container maxWidth="md">
            <Outlet />
          </Container>
        )}
      </Box>
      <ScrollToTop />
    </>
  );
}
