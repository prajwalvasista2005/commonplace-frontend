import { useState } from 'react';
import { Link as RouterLink, Navigate, useNavigate } from 'react-router-dom';
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
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useAuth } from '../hooks/useAuth';

export default function Register() {
  const { register: registerUser, isAuthenticated, loading, getErrorMessage } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
        <CircularProgress aria-label="Loading" size={36} />
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
      setTimeout(() => navigate('/login'), 1500);
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
        minHeight: 'calc(100vh - 140px)',
        px: { xs: 2, sm: 3 },
        py: { xs: 4, sm: 6 },
      }}
    >
      <Paper
        variant="outlined"
        sx={{
          width: '100%',
          maxWidth: 440,
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
            Create an account
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Join Commonplace to share and save ideas
          </Typography>
        </Stack>

        {success && (
          <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
            Account created successfully! Redirecting to sign in...
          </Alert>
        )}

        {submitError && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
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
              helperText={errors.username?.message || '3–30 characters, letters, numbers, underscores'}
              {...register('username', {
                required: 'Username is required',
                minLength: { value: 3, message: 'Username must be at least 3 characters' },
                maxLength: { value: 30, message: 'Username must be under 30 characters' },
                pattern: {
                  value: /^[a-zA-Z0-9_]+$/,
                  message: 'Only letters, numbers, and underscores are allowed',
                },
              })}
            />

            <TextField
              label="Email address"
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
              helperText={errors.password?.message || 'Must be at least 8 characters'}
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
                minLength: { value: 8, message: 'Password must be at least 8 characters' },
                maxLength: { value: 128, message: 'Password must be under 128 characters' },
              })}
            />

            <TextField
              label="Confirm password"
              type={showConfirmPassword ? 'text' : 'password'}
              fullWidth
              autoComplete="new-password"
              error={Boolean(errors.confirmPassword)}
              helperText={errors.confirmPassword?.message}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      edge="end"
                      size="small"
                      sx={{ color: 'text.secondary' }}
                    >
                      {showConfirmPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
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
              endIcon={isSubmitting ? <CircularProgress size={18} color="inherit" /> : <PersonAddIcon />}
              disabled={isSubmitting || success}
              sx={{ py: 1.35, mt: 0.5, fontWeight: 650 }}
            >
              {isSubmitting ? 'Creating account...' : 'Create account'}
            </Button>
          </Stack>
        </Box>

        <Divider sx={{ my: 3.5 }} />

        <Typography variant="body2" color="text.secondary" textAlign="center">
          Already have an account?{' '}
          <Link
            component={RouterLink}
            to="/login"
            underline="hover"
            sx={{ fontWeight: 650, color: 'primary.main' }}
          >
            Sign in
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}

