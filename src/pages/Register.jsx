import { useState } from 'react';
import { Link as RouterLink, Navigate, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
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
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useAuth } from '../hooks/useAuth';

export default function Register() {
  const { register: registerUser, isAuthenticated, loading, getErrorMessage } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { email: '', username: '', password: '', confirmPassword: '' },
  });

  const password = watch('password');

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress aria-label="Loading" />
      </Box>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const onSubmit = async (data) => {
    setSubmitError('');
    try {
      await registerUser(data.email.trim(), data.password, data.username.trim());
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setSubmitError(getErrorMessage(err, 'Registration failed. Please try again.'));
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 64px)',
        px: 2,
        py: 4,
      }}
    >
      <Paper
        variant="outlined"
        sx={{
          width: '100%',
          maxWidth: 440,
          p: { xs: 3, sm: 4 },
        }}
      >
        <Stack spacing={1} sx={{ mb: 3, textAlign: 'center' }}>
          <Box
            component="img"
            src="/favicon.svg"
            alt=""
            sx={{ width: 48, height: 48, mx: 'auto', borderRadius: 1 }}
          />
          <Typography variant="h5" component="h1">
            Create an account
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Join Commonplace and start sharing
          </Typography>
        </Stack>

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Account created. Redirecting to sign in...
          </Alert>
        )}

        {submitError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {submitError}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Stack spacing={2.5}>
            <TextField
              label="Username"
              fullWidth
              autoComplete="username"
              autoFocus
              error={Boolean(errors.username)}
              helperText={errors.username?.message}
              {...register('username', {
                required: 'Username is required',
                minLength: { value: 3, message: 'Username must be at least 3 characters' },
                maxLength: { value: 30, message: 'Username must be under 30 characters' },
                pattern: {
                  value: /^[a-zA-Z0-9_]+$/,
                  message: 'Username can only contain letters, numbers, and underscores',
                },
              })}
            />

            <TextField
              label="Email"
              type="email"
              fullWidth
              autoComplete="email"
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
              autoComplete="new-password"
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

            <TextField
              label="Confirm password"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              autoComplete="new-password"
              error={Boolean(errors.confirmPassword)}
              helperText={errors.confirmPassword?.message}
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (value) => value === password || 'Passwords do not match',
              })}
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              endIcon={isSubmitting ? null : <PersonAddIcon />}
              disabled={isSubmitting || success}
            >
              {isSubmitting ? 'Creating account...' : 'Create account'}
            </Button>
          </Stack>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 3, textAlign: 'center' }}>
          Already have an account?{' '}
          <Link component={RouterLink} to="/login" underline="hover">
            Sign in
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}
