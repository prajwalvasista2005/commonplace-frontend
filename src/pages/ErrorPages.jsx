import { Box, Button, Container, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';

function ErrorLayout({ code, title, message }) {
  return (
    <Container maxWidth="sm" sx={{ py: { xs: 8, sm: 12 }, textAlign: 'center' }}>
      <Stack spacing={3} alignItems="center">
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: '5rem', sm: '7rem' },
            fontFamily: '"Fraunces", Georgia, serif',
            fontWeight: 700,
            color: 'primary.main',
            lineHeight: 1,
            letterSpacing: '-0.04em',
            opacity: 0.85,
          }}
        >
          {code}
        </Typography>
        <Box>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{ fontFamily: '"Fraunces", Georgia, serif', fontWeight: 600 }}
          >
            {title}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 420, mx: 'auto' }}>
            {message}
          </Typography>
        </Box>
        <Button
          component={RouterLink}
          to="/"
          variant="contained"
          startIcon={<HomeOutlinedIcon />}
          sx={{ mt: 2, px: 3, py: 1, textTransform: 'none' }}
        >
          Back to home
        </Button>
      </Stack>
    </Container>
  );
}

export function ForbiddenPage() {
  return (
    <ErrorLayout
      code="403"
      title="Access restricted"
      message="You don't have permission to view this page or resource."
    />
  );
}

export function ServerErrorPage() {
  return (
    <ErrorLayout
      code="500"
      title="Unexpected error"
      message="Something went wrong on our end. Please refresh or try again in a few moments."
    />
  );
}

export default function NotFoundPage() {
  return (
    <ErrorLayout
      code="404"
      title="Page not found"
      message="The page you're looking for doesn't exist, may have moved, or is no longer available."
    />
  );
}