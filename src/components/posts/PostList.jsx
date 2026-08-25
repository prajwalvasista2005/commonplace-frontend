import { useCallback, useEffect, useState } from 'react';
import { Alert, Box, Button, Skeleton, Stack, Typography } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import api, { getErrorMessage } from '../../api/axios';
import PostCard from './PostCard';

const PAGE_SIZE = 10;

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
      setError(getErrorMessage(err, 'Failed to load posts.'));
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
      <Stack spacing={2}>
        {[1, 2, 3].map((key) => (
          <Skeleton key={key} variant="rounded" height={180} />
        ))}
      </Stack>
    );
  }

  if (error) {
    return (
      <Alert
        severity="error"
        action={
          <Button color="inherit" size="small" startIcon={<RefreshIcon />} onClick={() => fetchPosts()}>
            Retry
          </Button>
        }
      >
        {error}
      </Alert>
    );
  }

  if (posts.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No posts yet
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Be the first to share something with the community.
        </Typography>
      </Box>
    );
  }

  return (
    <Stack spacing={2}>
      {posts.map((item, index) => (
        <Box
          key={item.post.id}
          sx={{
            animation: 'entry-rise 0.4s ease both',
            animationDelay: `${Math.min(index, 8) * 40}ms`,
          }}
        >
          <PostCard item={item} onUpdate={handlePostUpdate} onDelete={handlePostDelete} />
        </Box>
      ))}

      {hasMore && (
        <Box sx={{ display: 'flex', justifyContent: 'center', pt: 1 }}>
          <Button
            variant="outlined"
            onClick={() => fetchPosts(skip, true)}
            disabled={loadingMore}
          >
            {loadingMore ? 'Loading...' : 'Load more'}
          </Button>
        </Box>
      )}
    </Stack>
  );
}
