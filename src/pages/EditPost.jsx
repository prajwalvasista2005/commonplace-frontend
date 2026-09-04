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
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { title: '', content: '', published: true },
  });

  const titleValue = watch('title') || '';
  const contentValue = watch('content') || '';
  const publishedValue = watch('published');

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
      <Box sx={{ maxWidth: 720, mx: 'auto', mt: 2 }}>
        <Skeleton variant="text" width={180} height={40} sx={{ mb: 1 }} />
        <Skeleton variant="rounded" height={420} sx={{ borderRadius: 2 }} />
      </Box>
    );
  }

  if (loadError) {
    return (
      <Box sx={{ maxWidth: 720, mx: 'auto', mt: 2 }}>
        <Alert severity="error" sx={{ borderRadius: 1.5 }}>
          {loadError}
        </Alert>
      </Box>
    );
  }

  if (post && user?.id !== post.owner_id) {
    return (
      <Box sx={{ maxWidth: 720, mx: 'auto', mt: 2 }}>
        <Alert severity="error" sx={{ borderRadius: 1.5 }}>
          You can only edit your own posts.
        </Alert>
      </Box>
    );
  }

  const currentImage = !removeExistingImage ? post?.image_url : null;

  return (
    <Box sx={{ maxWidth: 720, mx: 'auto' }}>
      <Paper
        variant="outlined"
        sx={{
          p: { xs: 2.5, sm: 4 },
          borderRadius: 2,
          boxShadow: '0 2px 12px rgba(14, 77, 85, 0.04)',
        }}
      >
        <Typography
          variant="h5"
          component="h1"
          gutterBottom
          sx={{ fontFamily: '"Fraunces", Georgia, serif', fontWeight: 600 }}
        >
          Edit post
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Update the title, content, image, or publication status.
        </Typography>

        {submitError && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 1.5 }}>
            {submitError}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Stack spacing={3}>
            <TextField
              label="Title"
              fullWidth
              required
              error={Boolean(errors.title)}
              helperText={
                errors.title?.message || `${titleValue.length}/200 characters`
              }
              inputProps={{ maxLength: 200 }}
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
              minRows={7}
              error={Boolean(errors.content)}
              helperText={
                errors.content?.message ||
                `${contentValue.length} characters (minimum 10)`
              }
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
              <Stack direction="row" spacing={1.5} alignItems="center">
                <label htmlFor="post-image-edit-upload">
                  <Button
                    component="span"
                    variant="outlined"
                    startIcon={<ImageOutlinedIcon />}
                    disabled={isSubmitting}
                    sx={{ textTransform: 'none' }}
                  >
                    {imageFile || currentImage ? 'Change image' : 'Add image'}
                  </Button>
                </label>
                {imageFile && (
                  <Typography variant="caption" color="text.secondary">
                    {imageFile.name} ({(imageFile.size / 1024 / 1024).toFixed(2)} MB)
                  </Typography>
                )}
              </Stack>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.75 }}>
                JPEG, PNG, WebP, or GIF. Maximum size 5 MB.
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
                    maxHeight: 320,
                    borderRadius: 1.5,
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
                    top: 10,
                    right: 10,
                    bgcolor: 'background.paper',
                    boxShadow: 1,
                    '&:hover': { bgcolor: 'action.hover' },
                  }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            )}

            <FormControlLabel
              control={
                <Switch
                  checked={Boolean(publishedValue)}
                  onChange={(e) => setValue('published', e.target.checked, { shouldDirty: true })}
                />
              }
              label={
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {publishedValue ? 'Published' : 'Draft'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {publishedValue
                      ? 'Visible to all community members in the public feed'
                      : 'Saved privately to your drafts'}
                  </Typography>
                </Box>
              }
            />

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', pt: 1 }}>
              <Button
                variant="outlined"
                onClick={() => navigate(`/post/${id}`)}
                disabled={isSubmitting}
                sx={{ textTransform: 'none' }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                endIcon={<SaveIcon />}
                disabled={isSubmitting || Boolean(imageError)}
                sx={{ textTransform: 'none', px: 3 }}
              >
                {isSubmitting ? 'Saving...' : 'Save changes'}
              </Button>
            </Box>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
}
