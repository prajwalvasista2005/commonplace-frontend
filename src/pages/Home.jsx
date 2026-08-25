import { Box, Typography } from '@mui/material';
import PostList from '../components/posts/PostList';

export default function Home() {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Feed
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Latest posts from the community
      </Typography>
      <PostList />
    </Box>
  );
}
