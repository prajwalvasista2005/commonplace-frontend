import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import CommentOutlinedIcon from '@mui/icons-material/CommentOutlined';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import api, { getErrorMessage } from '../../api/axios';
import { useAuth } from '../../hooks/useAuth';

function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffHours = diffMs / (1000 * 60 * 60);

  if (diffHours < 24 && diffHours >= 0) {
    if (diffHours < 1) {
      const mins = Math.max(1, Math.floor(diffMs / (1000 * 60)));
      return `${mins}m ago`;
    }
    return `${Math.floor(diffHours)}h ago`;
  }

  return date.toLocaleDateString(undefined, {
    year: date.getFullYear() === now.getFullYear() ? undefined : 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function PostCard({ item, onUpdate, onDelete, showFullContent = false }) {
  const { post, votes, comments_count: commentsCount } = item;
  const { user } = useAuth();

  const [voteCount, setVoteCount] = useState(() => votes ?? 0);
  const [liked, setLiked] = useState(() => Boolean(item.user_vote));
  const [saved, setSaved] = useState(() => Boolean(item.saved));
  const [actionError, setActionError] = useState('');
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [voting, setVoting] = useState(false);
  const [saving, setSaving] = useState(false);

  // Synchronize state if props update from parent
  useEffect(() => {
    setVoteCount(item.votes ?? 0);
    setLiked(Boolean(item.user_vote));
    setSaved(Boolean(item.saved));
  }, [item.votes, item.user_vote, item.saved]);

  const isOwner = user?.id === post.owner_id;
  const contentPreview =
    post.content.length > 280 && !showFullContent
      ? `${post.content.slice(0, 280).trim()}...`
      : post.content;

  const handleLike = async () => {
    if (voting) return;
    setVoting(true);
    setActionError('');

    const willLike = !liked;
    const nextCount = willLike ? voteCount + 1 : Math.max(0, voteCount - 1);
    const apiDir = willLike ? 1 : 0;

    // Optimistic state update
    setLiked(willLike);
    setVoteCount(nextCount);

    try {
      await api.post('/vote', { post_id: post.id, dir: apiDir });
      onUpdate?.({
        ...item,
        votes: nextCount,
        user_vote: willLike,
      });
    } catch (err) {
      // Rollback on network or API failure
      setLiked(!willLike);
      setVoteCount(voteCount);
      setActionError(getErrorMessage(err, 'Could not update like. Please try again.'));
    } finally {
      setVoting(false);
    }
  };

  const handleSave = async () => {
    if (saving) return;
    setSaving(true);
    setActionError('');

    const willSave = !saved;
    setSaved(willSave);

    try {
      if (willSave) {
        await api.post(`/saved/${post.id}`);
      } else {
        await api.delete(`/saved/${post.id}`);
      }
      onUpdate?.({
        ...item,
        saved: willSave,
      });
    } catch (err) {
      setSaved(!willSave);
      setActionError(getErrorMessage(err, 'Could not update saved status.'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/posts/${post.id}`);
      onDelete?.(post.id);
      setDeleteOpen(false);
    } catch (err) {
      setActionError(getErrorMessage(err, 'Failed to delete post.'));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <Card
        sx={{
          transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
          '&:hover': {
            borderColor: (theme) =>
              theme.palette.mode === 'light' ? 'rgba(14, 77, 85, 0.25)' : 'rgba(237, 243, 243, 0.2)',
          },
        }}
      >
        <CardContent sx={{ pb: 1, pt: { xs: 2, sm: 2.5 }, px: { xs: 2, sm: 2.5 } }}>
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.5 }}>
            <Avatar
              component={RouterLink}
              to={`/profile/${post.owner_id}`}
              src={post.owner?.profile_picture_url || undefined}
              alt={post.owner?.username}
              sx={{
                width: 38,
                height: 38,
                textDecoration: 'none',
                bgcolor: 'primary.main',
                fontSize: '0.95rem',
                fontWeight: 600,
                color: 'primary.contrastText',
                transition: 'opacity 0.2s ease',
                '&:hover': { opacity: 0.85 },
              }}
            >
              {post.owner?.username?.charAt(0)?.toUpperCase()}
            </Avatar>
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography
                variant="subtitle2"
                component={RouterLink}
                to={`/profile/${post.owner_id}`}
                noWrap
                sx={{
                  color: 'text.primary',
                  textDecoration: 'none',
                  fontWeight: 650,
                  display: 'inline-block',
                  '&:hover': {
                    color: 'primary.main',
                  },
                }}
              >
                {post.owner?.username}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: '0.75rem' }}>
                {formatDate(post.created_at)}
                {!post.published && ' · Draft'}
              </Typography>
            </Box>

            {isOwner && (
              <Stack direction="row" spacing={0.5}>
                <Tooltip title="Edit post">
                  <IconButton
                    size="small"
                    component={RouterLink}
                    to={`/post/${post.id}/edit`}
                    aria-label="Edit post"
                    sx={{ color: 'text.secondary', '&:hover': { color: 'text.primary' } }}
                  >
                    <EditOutlinedIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete post">
                  <IconButton
                    size="small"
                    color="error"
                    aria-label="Delete post"
                    onClick={() => setDeleteOpen(true)}
                    sx={{ opacity: 0.8, '&:hover': { opacity: 1 } }}
                  >
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Stack>
            )}
          </Stack>

          <Typography
            variant="h6"
            component={showFullContent ? 'h1' : RouterLink}
            to={showFullContent ? undefined : `/post/${post.id}`}
            sx={{
              mb: 1.25,
              fontSize: { xs: '1.05rem', sm: '1.15rem' },
              fontWeight: 650,
              textDecoration: 'none',
              color: 'text.primary',
              display: 'block',
              lineHeight: 1.35,
              '&:hover': showFullContent ? undefined : { color: 'primary.main' },
            }}
          >
            {post.title}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              lineHeight: 1.65,
              fontSize: '0.925rem',
            }}
          >
            {contentPreview}
          </Typography>

          {!showFullContent && post.content.length > 280 && (
            <Button
              component={RouterLink}
              to={`/post/${post.id}`}
              size="small"
              sx={{
                mt: 1,
                p: 0,
                minWidth: 'auto',
                fontWeight: 600,
                color: 'primary.main',
                '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' },
              }}
            >
              Continue reading &rarr;
            </Button>
          )}
        </CardContent>

        {post.image_url && (
          <Box sx={{ px: { xs: 2, sm: 2.5 }, pb: 1.5 }}>
            <CardMedia
              component="img"
              image={post.image_url}
              alt={post.title}
              sx={{
                maxHeight: 420,
                width: '100%',
                borderRadius: 2,
                objectFit: 'cover',
                border: 1,
                borderColor: 'divider',
              }}
            />
          </Box>
        )}

        {actionError && (
          <Typography variant="caption" color="error" sx={{ px: 2.5, pb: 1, display: 'block' }}>
            {actionError}
          </Typography>
        )}

        <CardActions
          sx={{
            px: { xs: 2, sm: 2.5 },
            pb: 2,
            pt: 0.5,
            borderTop: 1,
            borderColor: 'divider',
            mt: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          {/* Unified Like / Unlike Button */}
          <Tooltip title={liked ? 'Unlike' : 'Like'}>
            <span>
              <Button
                size="small"
                aria-label={liked ? 'Unlike post' : 'Like post'}
                onClick={handleLike}
                disabled={voting}
                startIcon={
                  liked ? (
                    <FavoriteIcon sx={{ color: 'error.main', fontSize: '1.2rem !important' }} />
                  ) : (
                    <FavoriteBorderIcon sx={{ fontSize: '1.2rem !important' }} />
                  )
                }
                sx={{
                  minWidth: 'auto',
                  px: 1.25,
                  py: 0.5,
                  color: liked ? 'text.primary' : 'text.secondary',
                  fontWeight: liked ? 650 : 500,
                  borderRadius: 2,
                  '&:hover': {
                    bgcolor: (t) =>
                      t.palette.mode === 'light' ? 'rgba(184, 58, 56, 0.08)' : 'rgba(184, 58, 56, 0.15)',
                    color: 'error.main',
                  },
                }}
              >
                <Typography
                  component="span"
                  variant="body2"
                  sx={{
                    fontFamily: '"IBM Plex Mono", monospace',
                    fontSize: '0.85rem',
                    fontWeight: liked ? 600 : 500,
                  }}
                >
                  {voteCount}
                </Typography>
              </Button>
            </span>
          </Tooltip>

          {/* Comment Counter / Link */}
          <Button
            component={RouterLink}
            to={`/post/${post.id}`}
            size="small"
            color="inherit"
            startIcon={<CommentOutlinedIcon sx={{ fontSize: '1.15rem !important' }} />}
            sx={{
              minWidth: 'auto',
              px: 1.25,
              py: 0.5,
              borderRadius: 2,
              color: 'text.secondary',
              '&:hover': {
                color: 'primary.main',
                bgcolor: (t) =>
                  t.palette.mode === 'light' ? 'rgba(14, 77, 85, 0.05)' : 'rgba(27, 106, 117, 0.12)',
              },
            }}
          >
            <Typography
              component="span"
              variant="body2"
              sx={{
                fontFamily: '"IBM Plex Mono", monospace',
                fontSize: '0.85rem',
              }}
            >
              {commentsCount}
            </Typography>
          </Button>

          {/* Bookmark / Save Button */}
          <Tooltip title={saved ? 'Remove from saved' : 'Save post'}>
            <span>
              <IconButton
                size="small"
                aria-label={saved ? 'Remove from saved' : 'Save post'}
                onClick={handleSave}
                disabled={saving}
                sx={{
                  ml: 'auto',
                  color: saved ? 'secondary.main' : 'text.secondary',
                  '&:hover': {
                    color: 'secondary.main',
                    bgcolor: (t) =>
                      t.palette.mode === 'light' ? 'rgba(192, 125, 43, 0.08)' : 'rgba(192, 125, 43, 0.15)',
                  },
                }}
              >
                {saved ? <BookmarkIcon fontSize="small" /> : <BookmarkBorderIcon fontSize="small" />}
              </IconButton>
            </span>
          </Tooltip>
        </CardActions>
      </Card>

      {/* Delete Confirmation Modal */}
      <Dialog
        open={deleteOpen}
        onClose={() => !deleting && setDeleteOpen(false)}
        aria-labelledby="delete-post-title"
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle id="delete-post-title" sx={{ fontWeight: 600 }}>
          Delete post?
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: 'text.secondary' }}>
            This action cannot be undone. &quot;{post.title}&quot; will be permanently deleted from the platform.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setDeleteOpen(false)} disabled={deleting} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained" disabled={deleting}>
            {deleting ? 'Deleting...' : 'Delete post'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

