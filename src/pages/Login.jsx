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
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LoginIcon from '@mui/icons-material/Login';
import { useAuth } from '../hooks/useAuth';

export default function Login() {
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
        <CircularProgress aria-label="Loading" size={36} />
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

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 140px)',
        px: { xs: 2, sm: 3 },
        py: { xs: 4, sm: 6 },
      }}
    >
      <Paper
        variant="outlined"
        sx={{
          width: '100%',
          maxWidth: 420,
          p: { xs: 3, sm: 4.5 },
          borderRadius: 3,
        }}
      >
        {/* Brand & Heading */}
        <Stack spacing={1.25} sx={{ mb: 3.5, textAlign: 'center' }}>
          <Box
            component="img"
            src="/favicon.svg"
            alt="Commonplace"
            sx={{ width: 44, height: 44, mx: 'auto', borderRadius: 1.5, mb: 0.5 }}
          />
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 650,
              fontSize: { xs: '1.5rem', sm: '1.75rem' },
              color: 'text.primary',
            }}
          >
            Welcome back
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Sign in to your Commonplace account
          </Typography>
        </Stack>

        {submitError && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
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
                      size="small"
                      sx={{ color: 'text.secondary' }}
                    >
                      {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
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
              endIcon={isSubmitting ? <CircularProgress size={18} color="inherit" /> : <LoginIcon />}
              disabled={isSubmitting}
              sx={{ py: 1.35, mt: 0.5, fontWeight: 650 }}
            >
              {isSubmitting ? 'Signing in...' : 'Sign in'}
            </Button>
          </Stack>
        </Box>

        <Divider sx={{ my: 3.5 }} />

        <Typography variant="body2" color="text.secondary" textAlign="center">
          New to Commonplace?{' '}
          <Link
            component={RouterLink}
            to="/register"
            underline="hover"
            sx={{ fontWeight: 650, color: 'primary.main' }}
          >
            Create an account
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}

