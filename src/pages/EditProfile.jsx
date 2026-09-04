import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  Alert,
  Avatar,
  Box,
  Button,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import PhotoCameraOutlinedIcon from '@mui/icons-material/PhotoCameraOutlined';
import { useAuth } from '../hooks/useAuth';
import { getErrorMessage } from '../api/axios';
import { updateUser, uploadProfilePicture, validateImageFile } from '../api/services';

export default function EditProfile() {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [success, setSuccess] = useState('');
  const [avatarPreview, setAvatarPreview] = useState('');
  const [avatarError, setAvatarError] = useState('');
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { email: user?.email ?? '', password: '' },
  });

  if (!user) return null;

  const handleAvatarChange = async (event) => {
    const file = event.target.files?.[0];
    setAvatarError('');
    if (!file) return;

    const validationError = validateImageFile(file);
    if (validationError) {
      setAvatarError(validationError);
      return;
    }

    setAvatarPreview(URL.createObjectURL(file));

    setUploadingAvatar(true);
    try {
      await uploadProfilePicture(file);
      await refreshUser();
      setSuccess('Profile picture updated.');
    } catch (err) {
      setAvatarError(getErrorMessage(err, 'Failed to upload image.'));
    } finally {
      setUploadingAvatar(false);
    }
  };

  const onSubmit = async (data) => {
    setSubmitError('');
    setSuccess('');
    try {
      await updateUser(user.id, { email: data.email.trim(), password: data.password });
      await refreshUser();
      setSuccess('Profile updated.');
    } catch (err) {
      setSubmitError(getErrorMessage(err, 'Failed to update profile.'));
    }
  };

  return (
    <Box sx={{ maxWidth: 480, mx: 'auto' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Edit profile
      </Typography>

      <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 } }}>
        <Stack alignItems="center" spacing={1} sx={{ mb: 3 }}>
          <Box sx={{ position: 'relative' }}>
            <Avatar
              src={avatarPreview || user.profile_picture_url || undefined}
              alt={user.username}
              sx={{ width: 96, height: 96, fontSize: '2.25rem' }}
            >
              {user.username?.charAt(0)?.toUpperCase()}
            </Avatar>
            <input
              accept="image/jpeg,image/png,image/webp,image/gif"
              id="avatar-upload"
              type="file"
              hidden
              onChange={handleAvatarChange}
            />
            <label htmlFor="avatar-upload">
              <IconButton
                component="span"
                size="small"
                disabled={uploadingAvatar}
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  bgcolor: 'background.paper',
                  border: 1,
                  borderColor: 'divider',
                  '&:hover': { bgcolor: 'background.paper' },
                }}
                aria-label="Change profile picture"
              >
                <PhotoCameraOutlinedIcon fontSize="small" />
              </IconButton>
            </label>
          </Box>
          {avatarError && (
            <Typography variant="caption" color="error">
              {avatarError}
            </Typography>
          )}
          {uploadingAvatar && (
            <Typography variant="caption" color="text.secondary">
              Uploading...
            </Typography>
          )}
        </Stack>

        {submitError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {submitError}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Stack spacing={2.5}>
            <TextField
              label="Username"
              value={user.username}
              fullWidth
              disabled
              helperText="Usernames can't be changed."
            />

            <TextField
              label="Email address"
              type="email"
              fullWidth
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
              label="New password"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              error={Boolean(errors.password)}
              helperText={errors.password?.message || 'Must be at least 8 characters to confirm changes.'}
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
                required: 'Enter your current or a new password to confirm changes',
                minLength: { value: 8, message: 'Password must be at least 8 characters' },
                maxLength: { value: 128, message: 'Password must be under 128 characters' },
              })}
            />

            <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ pt: 1 }}>
              <Button variant="outlined" onClick={() => navigate('/profile')} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" variant="contained" disabled={isSubmitting} sx={{ fontWeight: 650 }}>
                {isSubmitting ? 'Saving...' : 'Save changes'}
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
}
