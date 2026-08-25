import { useState } from 'react';
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
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import CommentOutlinedIcon from '@mui/icons-material/CommentOutlined';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import api, { getErrorMessage } from '../../api/axios';
import { useAuth } from '../../hooks/useAuth';

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function PostCard({ item, onUpdate, onDelete, showFullContent = false }) {
  const { post, votes, comments_count: commentsCount } = item;
  const { user } = useAuth();
  const [voteCount, setVoteCount] = useState(votes);
  const [userVote, setUserVote] = useState(null);
  const [saved, setSaved] = useState(false);
  const [actionError, setActionError] = useState('');
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [voting, setVoting] = useState(false);
  const [saving, setSaving] = useState(false);

  const isOwner = user?.id === post.owner_id;
  const contentPreview =
    post.content.length > 280 && !showFullContent
      ? `${post.content.slice(0, 280).trim()}...`
      : post.content;

  const handleVote = async (dir) => {
    if (voting) return;
    setVoting(true);
    setActionError('');

    const previousVote = userVote;
    const previousCount = voteCount;

    const togglingOff = previousVote === dir;
    const newVote = togglingOff ? null : dir;
    const apiDir = togglingOff ? 0 : dir;

    let delta = 0;
    if (previousVote === null && newVote === 1) delta = 1;
    else if (previousVote === null && newVote === 0) delta = -1;
    else if (previousVote === 1 && newVote === null) delta = -1;
    else if (previousVote === 0 && newVote === null) delta = 1;
    else if (previousVote === 1 && newVote === 0) delta = -2;
    else if (previousVote === 0 && newVote === 1) delta = 2;

    setUserVote(newVote);
    setVoteCount(previousCount + delta);

    try {
      await api.post('/vote', { post_id: post.id, dir: apiDir });
      onUpdate?.({ ...item, votes: previousCount + delta });
    } catch (err) {
      setUserVote(previousVote);
      setVoteCount(previousCount);
      setActionError(getErrorMessage(err, 'Vote failed.'));
    } finally {
      setVoting(false);
    }
  };

  const handleSave = async () => {
    if (saving) return;
    setSaving(true);
    setActionError('');

    const wasSaved = saved;

    try {
      if (wasSaved) {
        await api.delete(`/saved/${post.id}`);
        setSaved(false);
      } else {
        await api.post(`/saved/${post.id}`);
        setSaved(true);
      }
    } catch (err) {
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
        elevation={0}
        sx={{
          borderRadius: '4px',
          bgcolor: 'transparent',
          borderLeft: '3px solid',
          borderColor: 'divider',
          pl: { xs: 1.5, sm: 2 },
          transition: 'border-color 0.25s ease',
          '&:hover': {
            borderColor: 'warning.main',
          },
        }}
      >
        <CardContent sx={{ pb: 1, pl: { xs: 0.5, sm: 1 } }}>
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.5 }}>
            <Avatar
              src={post.owner?.profile_picture_url || undefined}
              alt={post.owner?.username}
              sx={{ width: 36, height: 36 }}
            >
              {post.owner?.username?.charAt(0)?.toUpperCase()}
            </Avatar>
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography variant="subtitle2" noWrap>
                {post.owner?.username}
              </Typography>
              <Typography variant="caption" color="text.secondary">
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
              mb: 1,
              fontSize: '1.125rem',
              textDecoration: 'none',
              color: 'text.primary',
              '&:hover': showFullContent ? undefined : { color: 'primary.main' },
            }}
          >
            {post.title}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
          >
            {contentPreview}
          </Typography>

          {!showFullContent && post.content.length > 280 && (
            <Button
              component={RouterLink}
              to={`/post/${post.id}`}
              size="small"
              sx={{ mt: 0.5, p: 0, minWidth: 'auto' }}
            >
              Read more
            </Button>
          )}
        </CardContent>

        {post.image_url && (
          <CardMedia
            component="img"
            image={post.image_url}
            alt={post.title}
            sx={{ maxHeight: 360, objectFit: 'cover' }}
          />
        )}

        {actionError && (
          <Typography variant="caption" color="error" sx={{ px: 2, pb: 1, display: 'block' }}>
            {actionError}
          </Typography>
        )}

        <CardActions sx={{ px: 2, pb: 2, pt: 0, flexWrap: 'wrap', gap: 0.5 }}>
          <Tooltip title="Upvote">
            <span>
              <IconButton
                size="small"
                color={userVote === 1 ? 'primary' : 'default'}
                aria-label="Upvote"
                onClick={() => handleVote(1)}
                disabled={voting}
              >
                {userVote === 1 ? <ThumbUpIcon fontSize="small" /> : <ThumbUpOutlinedIcon fontSize="small" />}
              </IconButton>
            </span>
          </Tooltip>
          <Typography
            variant="body2"
            sx={{
              minWidth: 24,
              textAlign: 'center',
              fontFamily: '"IBM Plex Mono", monospace',
              fontWeight: 500,
            }}
          >
            {voteCount}
          </Typography>
          <Tooltip title="Downvote">
            <span>
              <IconButton
                size="small"
                color={userVote === 0 ? 'secondary' : 'default'}
                aria-label="Downvote"
                onClick={() => handleVote(0)}
                disabled={voting}
              >
                {userVote === 0 ? <ThumbDownIcon fontSize="small" /> : <ThumbDownOutlinedIcon fontSize="small" />}
              </IconButton>
            </span>
          </Tooltip>

          <Button
            component={RouterLink}
            to={`/post/${post.id}`}
            size="small"
            color="inherit"
            startIcon={<CommentOutlinedIcon fontSize="small" />}
            sx={{ ml: 1 }}
          >
            {commentsCount}
          </Button>

          <Tooltip title={saved ? 'Remove from saved' : 'Save post'}>
            <span>
              <IconButton
                size="small"
                color={saved ? 'primary' : 'default'}
                aria-label={saved ? 'Remove from saved' : 'Save post'}
                onClick={handleSave}
                disabled={saving}
                sx={{ ml: 'auto' }}
              >
                {saved ? <BookmarkIcon fontSize="small" /> : <BookmarkBorderIcon fontSize="small" />}
              </IconButton>
            </span>
          </Tooltip>
        </CardActions>
      </Card>

      <Dialog open={deleteOpen} onClose={() => !deleting && setDeleteOpen(false)} aria-labelledby="delete-post-title">
        <DialogTitle id="delete-post-title">Delete post?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This action cannot be undone. The post &quot;{post.title}&quot; will be permanently removed.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteOpen(false)} disabled={deleting}>
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained" disabled={deleting}>
            {deleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
