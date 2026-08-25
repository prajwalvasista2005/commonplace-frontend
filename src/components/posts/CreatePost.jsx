import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  Alert,
  Box,
  Button,
  FormControlLabel,
  IconButton,
  Paper,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import CloseIcon from '@mui/icons-material/Close';
import api, { getErrorMessage } from '../../api/axios';
import { uploadPostImage, validateImageFile } from '../../api/services';

export default function CreatePostForm() {
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [imageError, setImageError] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      title: '',
      content: '',
      published: true,
    },
  });

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    setImageError('');

    if (!file) return;

    const validationError = validateImageFile(file);
    if (validationError) {
      setImageError(validationError);
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const clearImage = () => {
    setImageFile(null);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview('');
    setImageError('');
  };

  const onSubmit = async (data) => {
    setSubmitError('');
    try {
      const { data: post } = await api.post('/posts', {
        title: data.title.trim(),
        content: data.content.trim(),
        published: data.published,
      });

      if (imageFile) {
        await uploadPostImage(post.id, imageFile);
      }

      navigate(`/post/${post.id}`);
    } catch (err) {
      setSubmitError(getErrorMessage(err, 'Failed to create post.'));
    }
  };

  return (
    <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 } }}>
      <Typography variant="h5" component="h1" gutterBottom>
        Create a post
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Share your thoughts with the community. You can attach one image.
      </Typography>

      {submitError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {submitError}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Stack spacing={2.5}>
          <TextField
            label="Title"
            fullWidth
            required
            error={Boolean(errors.title)}
            helperText={errors.title?.message}
            {...register('title', {
              required: 'Title is required',
              minLength: { value: 3, message: 'Title must be at least 3 characters' },
              maxLength: { value: 200, message: 'Title must be under 200 characters' },
            })}
          />

          <TextField
            label="Content"
            fullWidth
            required
            multiline
            minRows={6}
            error={Boolean(errors.content)}
            helperText={errors.content?.message}
            {...register('content', {
              required: 'Content is required',
              minLength: { value: 10, message: 'Content must be at least 10 characters' },
            })}
          />

          <Box>
            <input
              accept="image/jpeg,image/png,image/webp,image/gif"
              id="post-image-upload"
              type="file"
              hidden
              onChange={handleImageChange}
            />
            <label htmlFor="post-image-upload">
              <Button
                component="span"
                variant="outlined"
                startIcon={<ImageOutlinedIcon />}
                disabled={isSubmitting}
              >
                {imageFile ? 'Change image' : 'Add image'}
              </Button>
            </label>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
              JPEG, PNG, WebP, or GIF. Max 5 MB.
            </Typography>
            {imageError && (
              <Typography variant="caption" color="error" sx={{ display: 'block', mt: 0.5 }}>
                {imageError}
              </Typography>
            )}
          </Box>

          {imagePreview && (
            <Box sx={{ position: 'relative', display: 'inline-block', maxWidth: '100%' }}>
              <Box
                component="img"
                src={imagePreview}
                alt="Post preview"
                sx={{
                  maxWidth: '100%',
                  maxHeight: 280,
                  borderRadius: 1,
                  objectFit: 'cover',
                  display: 'block',
                  border: 1,
                  borderColor: 'divider',
                }}
              />
              <IconButton
                size="small"
                aria-label="Remove image"
                onClick={clearImage}
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  bgcolor: 'background.paper',
                  '&:hover': { bgcolor: 'background.paper' },
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          )}

          <FormControlLabel
            control={<Switch defaultChecked {...register('published')} />}
            label="Publish immediately"
          />

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button variant="outlined" onClick={() => navigate('/')} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              endIcon={<SendIcon />}
              disabled={isSubmitting || Boolean(imageError)}
            >
              {isSubmitting ? 'Publishing...' : 'Publish'}
            </Button>
          </Box>
        </Stack>
      </Box>
    </Paper>
  );
}
