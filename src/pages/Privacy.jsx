import { Box, Button, Container, Paper, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';

export default function PrivacyPage() {
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
              Privacy Policy
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
                1. Information We Collect
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.75 }}>
                We collect information you provide directly to us, including when you create
                an account, publish essays and comments, or interact with fellow members.
                This includes your username, email address, profile avatar, and any content
                you submit.
              </Typography>
            </Box>

            <Box>
              <Typography
                variant="h6"
                component="h2"
                gutterBottom
                sx={{ fontWeight: 650 }}
              >
                2. How We Use Your Information
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.75 }}>
                We use the collected information solely to provide, maintain, and enrich your
                reading and writing experience on Commonplace, to authenticate sessions, and
                to preserve your bookmarks and interactions.
              </Typography>
            </Box>

            <Box>
              <Typography
                variant="h6"
                component="h2"
                gutterBottom
                sx={{ fontWeight: 650 }}
              >
                3. Information Sharing
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.75 }}>
                We do not sell, trade, or monetize your personal data. We do not track you
                across third-party applications or serve targeted advertising.
              </Typography>
            </Box>

            <Box>
              <Typography
                variant="h6"
                component="h2"
                gutterBottom
                sx={{ fontWeight: 650 }}
              >
                4. Data Security
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.75 }}>
                We utilize industry-standard cryptographic practices (including Bcrypt salted
                password hashing and secure JWT authentication) to protect your personal
                information from unauthorized access or exposure.
              </Typography>
            </Box>

            <Box>
              <Typography
                variant="h6"
                component="h2"
                gutterBottom
                sx={{ fontWeight: 650 }}
              >
                5. Your Rights
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.75 }}>
                You have full autonomy over your data. You may update your profile or delete
                your account and associated posts at any time directly through your account
                settings.
              </Typography>
            </Box>

            <Box>
              <Typography
                variant="h6"
                component="h2"
                gutterBottom
                sx={{ fontWeight: 650 }}
              >
                6. Policy Revisions
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.75 }}>
                If we make material adjustments to this Privacy Policy, we will update the
                revision date at the top of this document.
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