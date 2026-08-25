import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  Alert,
  Box,
  Button,
  FormControlLabel,
  IconButton,
  Paper,
  Skeleton,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import CloseIcon from '@mui/icons-material/Close';
import api, { getErrorMessage } from '../api/axios';
import {
  deletePostImage,
  updatePost,
  uploadPostImage,
  validateImageFile,
} from '../api/services';
import { useAuth } from '../hooks/useAuth';

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [imageError, setImageError] = useState('');
  const [removeExistingImage, setRemoveExistingImage] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { title: '', content: '', published: true },
  });

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      setLoadError('');
      try {
        const { data } = await api.get(`/posts/${id}`);
        setPost(data.post);
        reset({
          title: data.post.title,
          content: data.post.content,
          published: data.post.published,
        });
      } catch (err) {
        setLoadError(getErrorMessage(err, 'Post not found or unavailable.'));
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, reset]);

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
    setRemoveExistingImage(false);
  };

  const clearImage = () => {
    setImageFile(null);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview('');
    setImageError('');
    if (post?.image_url) setRemoveExistingImage(true);
  };

  const onSubmit = async (data) => {
    setSubmitError('');
    try {
      await updatePost(id, {
        title: data.title.trim(),
        content: data.content.trim(),
        published: data.published,
        image_url: removeExistingImage ? null : post.image_url,
        image_public_id: removeExistingImage ? null : post.image_public_id,
      });

      if (removeExistingImage && post.image_url && !imageFile) {
        await deletePostImage(id);
      }

      if (imageFile) {
        await uploadPostImage(id, imageFile);
      }

      navigate(`/post/${id}`);
    } catch (err) {
      setSubmitError(getErrorMessage(err, 'Failed to update post.'));
    }
  };

  if (loading) {
    return (
      <Box>
        <Skeleton variant="rounded" height={48} sx={{ mb: 2, maxWidth: 200 }} />
        <Skeleton variant="rounded" height={320} />
      </Box>
    );
  }

  if (loadError) {
    return <Alert severity="error">{loadError}</Alert>;
  }

  if (post && user?.id !== post.owner_id) {
    return <Alert severity="error">You can only edit your own posts.</Alert>;
  }

  const currentImage = !removeExistingImage ? post?.image_url : null;

  return (
    <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 } }}>
      <Typography variant="h5" component="h1" gutterBottom>
        Edit post
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
              id="post-image-edit-upload"
              type="file"
              hidden
              onChange={handleImageChange}
            />
            <label htmlFor="post-image-edit-upload">
              <Button
                component="span"
                variant="outlined"
                startIcon={<ImageOutlinedIcon />}
                disabled={isSubmitting}
              >
                {imageFile || currentImage ? 'Change image' : 'Add image'}
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

          {(imagePreview || currentImage) && (
            <Box sx={{ position: 'relative', display: 'inline-block', maxWidth: '100%' }}>
              <Box
                component="img"
                src={imagePreview || currentImage}
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
            control={
              <Switch
                defaultChecked={post?.published}
                {...register('published')}
              />
            }
            label="Published"
          />

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button variant="outlined" onClick={() => navigate(`/post/${id}`)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              endIcon={<SaveIcon />}
              disabled={isSubmitting || Boolean(imageError)}
            >
              {isSubmitting ? 'Saving...' : 'Save changes'}
            </Button>
          </Box>
        </Stack>
      </Box>
    </Paper>
  );
}
