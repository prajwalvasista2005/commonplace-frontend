import { Box, Button, Container, Paper, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';

export default function TermsPage() {
  return (
    <Container maxWidth="md" sx={{ py: { xs: 4, sm: 8 } }}>
      <Paper
        variant="outlined"
        sx={{
          p: { xs: 3, sm: 6 },
          borderRadius: 2,
          boxShadow: '0 2px 12px rgba(14, 77, 85, 0.03)',
        }}
      >
        <Stack spacing={4}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', pb: 3 }}>
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{ fontWeight: 700 }}
            >
              Terms of Service
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Last updated: September 4, 2026
            </Typography>
          </Box>

          <Stack spacing={3}>
            <Box>
              <Typography
                variant="h6"
                component="h2"
                gutterBottom
                sx={{ fontWeight: 650 }}
              >
                1. Introduction
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.75 }}>
                Welcome to Commonplace. By accessing or using our website and services,
                you agree to be bound by these Terms of Service (&ldquo;Terms&rdquo;). Please read
                these Terms carefully before using the platform.
              </Typography>
            </Box>

            <Box>
              <Typography
                variant="h6"
                component="h2"
                gutterBottom
                sx={{ fontWeight: 650 }}
              >
                2. User Accounts
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.75 }}>
                You must be at least 13 years old to use our service. You are responsible
                for maintaining the confidentiality of your account and password and for
                restricting access to your computer or devices.
              </Typography>
            </Box>

            <Box>
              <Typography
                variant="h6"
                component="h2"
                gutterBottom
                sx={{ fontWeight: 650 }}
              >
                3. Content and Conduct
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.75 }}>
                You retain ownership of any content you post, but by submitting content
                to public areas of the site, you grant us a worldwide, royalty-free,
                non-exclusive license to use, modify, reproduce, and distribute such
                content across our platform.
              </Typography>
            </Box>

            <Box>
              <Typography
                variant="h6"
                component="h2"
                gutterBottom
                sx={{ fontWeight: 650 }}
              >
                4. Intellectual Property
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.75 }}>
                The Commonplace name, logo, typography, and all related trademarks,
                trade dress, and platform assets are the exclusive property of
                Commonplace and its contributors.
              </Typography>
            </Box>

            <Box>
              <Typography
                variant="h6"
                component="h2"
                gutterBottom
                sx={{ fontWeight: 650 }}
              >
                5. Limitation of Liability
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.75 }}>
                To the maximum extent permitted by applicable law, Commonplace shall not
                be liable for any indirect, incidental, special, consequential, or punitive
                damages, or any loss of profits, data, goodwill, or service interruptions.
              </Typography>
            </Box>

            <Box>
              <Typography
                variant="h6"
                component="h2"
                gutterBottom
                sx={{ fontWeight: 650 }}
              >
                6. Governing Law
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.75 }}>
                These Terms shall be governed by and construed in accordance with the laws
                of the United States, without regard to its conflict of law principles.
              </Typography>
            </Box>
          </Stack>

          <Box sx={{ pt: 2, borderTop: 1, borderColor: 'divider' }}>
            <Button
              component={RouterLink}
              to="/"
              variant="outlined"
              startIcon={<HomeOutlinedIcon />}
              sx={{ textTransform: 'none' }}
            >
              Back to feed
            </Button>
          </Box>
        </Stack>
      </Paper>
    </Container>
  );
}