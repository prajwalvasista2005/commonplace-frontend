import { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import api, { getErrorMessage } from '../../api/axios';
import { useAuth } from '../../hooks/useAuth';

function formatDate(dateString) {
  return new Date(dateString).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function CommentSection({ postId, initialComments = [], onCommentAdded }) {
  const { user } = useAuth();
  const [comments, setComments] = useState(initialComments);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(!initialComments.length);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchComments = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get(`/comments/${postId}`);
      setComments(data);
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to load comments.'));
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    if (!initialComments.length) {
      fetchComments();
    }
  }, [fetchComments, initialComments.length]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const trimmed = content.trim();
    if (!trimmed || submitting) return;

    setSubmitting(true);
    setError('');

    try {
      const { data } = await api.post(`/comments/${postId}`, { content: trimmed });
      setComments((prev) => [...prev, data]);
      setContent('');
      onCommentAdded?.();
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to post comment.'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/comments/${deleteTarget.id}`);
      setComments((prev) => prev.filter((c) => c.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to delete comment.'));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 }, mt: 3 }}>
      <Typography variant="h6" component="h2" gutterBottom>
        Comments
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ mb: 3 }}>
        <TextField
          label="Write a comment"
          fullWidth
          multiline
          minRows={2}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={submitting}
          inputProps={{ maxLength: 1000 }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1.5 }}>
          <Button
            type="submit"
            variant="contained"
            endIcon={submitting ? <CircularProgress size={18} color="inherit" /> : <SendIcon />}
            disabled={submitting || !content.trim()}
          >
            {submitting ? 'Posting...' : 'Post comment'}
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress size={32} aria-label="Loading comments" />
        </Box>
      ) : comments.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
          No comments yet. Start the conversation.
        </Typography>
      ) : (
        <Stack spacing={2} divider={<Box sx={{ borderBottom: 1, borderColor: 'divider' }} />}>
          {comments.map((comment) => {
            const canDelete = user?.id === comment.user_id || user?.id === comment.owner?.id;
            return (
              <Box key={comment.id}>
                <Stack direction="row" spacing={1.5} alignItems="flex-start">
                  <Avatar
                    src={comment.owner?.profile_picture_url || undefined}
                    alt={comment.owner?.username}
                    sx={{ width: 32, height: 32 }}
                  >
                    {comment.owner?.username?.charAt(0)?.toUpperCase()}
                  </Avatar>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Typography variant="subtitle2">{comment.owner?.username}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(comment.created_at)}
                      </Typography>
                      {canDelete && (
                        <Tooltip title="Delete comment">
                          <IconButton
                            size="small"
                            color="error"
                            aria-label="Delete comment"
                            onClick={() => setDeleteTarget(comment)}
                            sx={{ ml: 'auto' }}
                          >
                            <DeleteOutlineIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Stack>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 0.5, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
                    >
                      {comment.content}
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            );
          })}
        </Stack>
      )}

      <Dialog
        open={Boolean(deleteTarget)}
        onClose={() => !deleting && setDeleteTarget(null)}
        aria-labelledby="delete-comment-title"
      >
        <DialogTitle id="delete-comment-title">Delete comment?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This comment will be permanently removed.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteTarget(null)} disabled={deleting}>
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained" disabled={deleting}>
            {deleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
