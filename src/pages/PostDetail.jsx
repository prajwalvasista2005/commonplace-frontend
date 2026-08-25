import { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Skeleton,
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
      <Box>
        <Skeleton variant="rounded" height={48} sx={{ mb: 2, maxWidth: 120 }} />
        <Skeleton variant="rounded" height={240} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
          sx={{ mb: 2 }}
        >
          Back to feed
        </Button>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  const feedItem = {
    post: postData.post,
    votes: postData.votes,
    comments_count: postData.comments_count,
  };

  return (
    <Box>
      <Button
        component={RouterLink}
        to="/"
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 2 }}
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
            comments_count: prev.comments_count + 1,
          }))
        }
      />
    </Box>
  );
}
