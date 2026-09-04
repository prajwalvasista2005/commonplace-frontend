import { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Card,
  Skeleton,
  Stack,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import api, { getErrorMessage } from '../api/axios';
import PostCard from '../components/posts/PostCard';
import CommentSection from '../components/comments/CommentSection';

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [postData, setPostData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await api.get(`/posts/${id}`);
        setPostData(data);
      } catch (err) {
        setError(getErrorMessage(err, 'Post not found or unavailable.'));
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ maxWidth: 760, mx: 'auto' }}>
        <Skeleton variant="rounded" width={110} height={36} sx={{ mb: 2.5 }} />
        <Card sx={{ p: { xs: 2, sm: 3 }, mb: 3 }}>
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
            <Skeleton variant="circular" width={40} height={40} />
            <Box sx={{ flex: 1 }}>
              <Skeleton variant="text" width="30%" height={20} />
              <Skeleton variant="text" width="18%" height={16} />
            </Box>
          </Stack>
          <Skeleton variant="text" width="70%" height={32} sx={{ mb: 1.5 }} />
          <Skeleton variant="text" width="100%" height={22} />
          <Skeleton variant="text" width="90%" height={22} />
          <Skeleton variant="text" width="80%" height={22} sx={{ mb: 3 }} />
          <Skeleton variant="rounded" width="100%" height={240} sx={{ mb: 2 }} />
        </Card>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ maxWidth: 760, mx: 'auto' }}>
        <Button
          component={RouterLink}
          to="/"
          startIcon={<ArrowBackIcon />}
          sx={{ mb: 2.5 }}
        >
          Back to feed
        </Button>
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={() => window.location.reload()}>
              Retry
            </Button>
          }
          sx={{ borderRadius: 2 }}
        >
          {error}
        </Alert>
      </Box>
    );
  }

  const feedItem = {
    post: postData.post,
    votes: postData.votes,
    comments_count: postData.comments_count,
    user_vote: postData.user_vote ?? false,
    saved: postData.saved ?? false,
  };

  return (
    <Box sx={{ maxWidth: 760, mx: 'auto' }}>
      <Button
        component={RouterLink}
        to="/"
        startIcon={<ArrowBackIcon />}
        sx={{
          mb: 2.5,
          color: 'text.secondary',
          fontWeight: 600,
          '&:hover': { color: 'text.primary' },
        }}
      >
        Back to feed
      </Button>

      <PostCard
        item={feedItem}
        showFullContent
        onUpdate={(updated) =>
          setPostData((prev) => ({
            ...prev,
            votes: updated.votes,
            user_vote: updated.user_vote,
            saved: updated.saved,
          }))
        }
        onDelete={() => navigate('/')}
      />

      <CommentSection
        postId={postData.post.id}
        initialComments={postData.comments}
        onCommentAdded={() =>
          setPostData((prev) => ({
            ...prev,
            comments_count: (prev.comments_count || 0) + 1,
          }))
        }
        onCommentDeleted={() =>
          setPostData((prev) => ({
            ...prev,
            comments_count: Math.max(0, (prev.comments_count || 1) - 1),
          }))
        }
      />
    </Box>
  );
}

