import { useState } from 'react';
import { Link as RouterLink, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  InputAdornment,
  Link,
  Paper,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LoginIcon from '@mui/icons-material/Login';
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import { useAuth } from '../hooks/useAuth';

const highlights = [
  { icon: ForumOutlinedIcon, text: 'Share posts and join discussions' },
  { icon: GroupsOutlinedIcon, text: 'Connect with a growing community' },
  { icon: BookmarkBorderOutlinedIcon, text: 'Save posts to read later' },
];

export default function Login() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const { login, isAuthenticated, loading, getErrorMessage } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const from = location.state?.from?.pathname || '/';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { email: '', password: '' },
  });

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress aria-label="Loading" />
      </Box>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const onSubmit = async (data) => {
    setSubmitError('');
    try {
      await login(data.email.trim(), data.password);
      navigate(from, { replace: true });
    } catch (err) {
      setSubmitError(getErrorMessage(err, 'Invalid email or password.'));
    }
  };

  const formPanel = (
    <Box sx={{ width: '100%', maxWidth: 400 }}>
      <Stack spacing={1} sx={{ mb: 3 }}>
        {!isDesktop && (
          <Box
            component="img"
            src="/favicon.svg"
            alt=""
            sx={{ width: 44, height: 44, borderRadius: 1, mb: 1 }}
          />
        )}
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
          Sign in
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome back to Commonplace
        </Typography>
      </Stack>

      {submitError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {submitError}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Stack spacing={2.5}>
          <TextField
            label="Email address"
            type="email"
            fullWidth
            autoComplete="email"
            autoFocus
            error={Boolean(errors.email)}
            helperText={errors.email?.message}
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Enter a valid email address',
              },
            })}
          />

          <TextField
            label="Password"
            type={showPassword ? 'text' : 'password'}
            fullWidth
            autoComplete="current-password"
            error={Boolean(errors.password)}
            helperText={errors.password?.message}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    onClick={() => setShowPassword((prev) => !prev)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 6, message: 'Password must be at least 6 characters' },
            })}
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            endIcon={isSubmitting ? null : <LoginIcon />}
            disabled={isSubmitting}
            sx={{ py: 1.25, mt: 0.5 }}
          >
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </Button>
        </Stack>
      </Box>

      <Divider sx={{ my: 3 }} />

      <Typography variant="body2" color="text.secondary" textAlign="center">
        New here?{' '}
        <Link component={RouterLink} to="/register" underline="hover" fontWeight={600}>
          Create an account
        </Link>
      </Typography>
    </Box>
  );

  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 64px)',
        display: 'flex',
        alignItems: 'stretch',
      }}
    >
      {isDesktop && (
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            px: 6,
            py: 5,
            bgcolor: (t) => (t.palette.mode === 'light' ? 'primary.main' : 'primary.dark'),
            color: 'primary.contrastText',
          }}
        >
          <Stack spacing={3} sx={{ maxWidth: 420 }}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Box
                component="img"
                src="/favicon.svg"
                alt=""
                sx={{ width: 48, height: 48, borderRadius: 1 }}
              />
              <Typography variant="h5" sx={{ fontFamily: '"Fraunces", serif', fontWeight: 600 }}>
                Commonplace
              </Typography>
            </Stack>
            <Typography variant="h4" sx={{ lineHeight: 1.3 }}>
              A running record of what's worth remembering
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9, lineHeight: 1.7 }}>
              Commonplace books were how people once kept track of ideas worth returning to.
              This is that, for the web — publish, discuss, and save what matters.
            </Typography>
            <Stack spacing={2} sx={{ pt: 1 }}>
              {highlights.map(({ icon: Icon, text }) => (
                <Stack key={text} direction="row" spacing={1.5} alignItems="center">
                  <Icon sx={{ opacity: 0.9 }} />
                  <Typography variant="body2">{text}</Typography>
                </Stack>
              ))}
            </Stack>
          </Stack>
        </Box>
      )}

      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: { xs: 2, sm: 4 },
          py: { xs: 4, sm: 6 },
          bgcolor: 'background.default',
        }}
      >
        {isDesktop ? (
          formPanel
        ) : (
          <Paper variant="outlined" sx={{ width: '100%', maxWidth: 440, p: { xs: 3, sm: 4 } }}>
            {formPanel}
          </Paper>
        )}
      </Box>
    </Box>
  );
}
