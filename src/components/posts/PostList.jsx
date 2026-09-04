import { useCallback, useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Card,
  CircularProgress,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import api, { getErrorMessage } from '../../api/axios';
import PostCard from './PostCard';

const PAGE_SIZE = 10;

function PostSkeleton() {
  return (
    <Card sx={{ p: { xs: 2, sm: 2.5 } }}>
      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
        <Skeleton variant="circular" width={38} height={38} />
        <Box sx={{ flex: 1 }}>
          <Skeleton variant="text" width="28%" height={20} />
          <Skeleton variant="text" width="16%" height={16} />
        </Box>
      </Stack>
      <Skeleton variant="text" width="65%" height={28} sx={{ mb: 1 }} />
      <Skeleton variant="text" width="100%" height={20} />
      <Skeleton variant="text" width="85%" height={20} sx={{ mb: 2 }} />
      <Stack direction="row" spacing={2} sx={{ pt: 1, borderTop: 1, borderColor: 'divider' }}>
        <Skeleton variant="rounded" width={52} height={28} />
        <Skeleton variant="rounded" width={52} height={28} />
        <Skeleton variant="circular" width={28} height={28} sx={{ ml: 'auto !important' }} />
      </Stack>
    </Card>
  );
}

export default function PostList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchPosts = useCallback(async (offset = 0, append = false) => {
    if (append) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }
    setError('');

    try {
      const { data } = await api.get('/posts', {
        params: { limit: PAGE_SIZE, skip: offset },
      });

      setPosts((prev) => (append ? [...prev, ...data] : data));
      setHasMore(data.length === PAGE_SIZE);
      setSkip(offset + data.length);
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to load posts. Please try again.'));
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts(0, false);
  }, [fetchPosts]);

  const handlePostUpdate = (updatedItem) => {
    setPosts((prev) =>
      prev.map((item) => (item.post.id === updatedItem.post.id ? updatedItem : item))
    );
  };

  const handlePostDelete = (postId) => {
    setPosts((prev) => prev.filter((item) => item.post.id !== postId));
  };

  if (loading) {
    return (
      <Stack spacing={2.5}>
        {[1, 2, 3].map((key) => (
          <PostSkeleton key={key} />
        ))}
      </Stack>
    );
  }

  if (error) {
    return (
      <Alert
        severity="error"
        action={
          <Button
            color="inherit"
            size="small"
            startIcon={<RefreshIcon />}
            onClick={() => fetchPosts(0, false)}
          >
            Retry
          </Button>
        }
        sx={{ borderRadius: 2 }}
      >
        {error}
      </Alert>
    );
  }

  if (posts.length === 0) {
    return (
      <Card
        sx={{
          textAlign: 'center',
          py: 8,
          px: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            bgcolor: (theme) =>
              theme.palette.mode === 'light' ? 'rgba(14, 77, 85, 0.08)' : 'rgba(27, 106, 117, 0.15)',
            color: 'primary.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 2,
          }}
        >
          <AutoAwesomeOutlinedIcon sx={{ fontSize: 28 }} />
        </Box>
        <Typography variant="h5" component="h2" sx={{ fontWeight: 650, mb: 1 }}>
          No posts yet
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400, mb: 3 }}>
          Commonplace is a quiet space for thoughtful observations and ideas worth remembering. Start the conversation.
        </Typography>
        <Button
          component={RouterLink}
          to="/create-post"
          variant="contained"
          startIcon={<CreateOutlinedIcon />}
        >
          Create first post
        </Button>
      </Card>
    );
  }

  return (
    <Stack spacing={2.5}>
      {posts.map((item, index) => (
        <Box
          key={item.post.id}
          sx={{
            animation: 'entry-rise 0.35s ease both',
            animationDelay: `${Math.min(index, 6) * 40}ms`,
          }}
        >
          <PostCard item={item} onUpdate={handlePostUpdate} onDelete={handlePostDelete} />
        </Box>
      ))}

      {hasMore && (
        <Box sx={{ display: 'flex', justifyContent: 'center', pt: 2, pb: 1 }}>
          <Button
            variant="outlined"
            onClick={() => fetchPosts(skip, true)}
            disabled={loadingMore}
            startIcon={loadingMore ? <CircularProgress size={16} color="inherit" /> : null}
            sx={{ px: 4, py: 1 }}
          >
            {loadingMore ? 'Loading more...' : 'Load more posts'}
          </Button>
        </Box>
      )}
    </Stack>
  );
}

