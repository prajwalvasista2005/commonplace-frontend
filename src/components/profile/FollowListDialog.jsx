import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Avatar,
  Box,
  Dialog,
  DialogTitle,
  IconButton,
  List,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { getFollowers, getFollowing } from '../../api/services';

export default function FollowListDialog({ open, onClose, userId, mode, onSelectUser }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open || !userId) return;

    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const fetcher = mode === 'followers' ? getFollowers : getFollowing;
        const data = await fetcher(userId);
        if (!cancelled) setUsers(data);
      } catch {
        if (!cancelled) setError('Could not load this list.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [open, userId, mode]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontFamily: '"Fraunces", Georgia, serif',
          fontWeight: 600,
          pb: 1.5,
        }}
      >
        {mode === 'followers' ? 'Followers' : 'Following'}
        <IconButton onClick={onClose} size="small" aria-label="Close">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <Box sx={{ px: 1, pb: 2, minHeight: 140, maxHeight: 420, overflowY: 'auto' }}>
        {loading && (
          <Stack spacing={1.5} sx={{ px: 2, py: 1 }}>
            {[1, 2, 3].map((key) => (
              <Stack key={key} direction="row" spacing={2} alignItems="center">
                <Skeleton variant="circular" width={40} height={40} />
                <Box sx={{ flexGrow: 1 }}>
                  <Skeleton variant="text" width="60%" height={24} />
                  <Skeleton variant="text" width="40%" height={18} />
                </Box>
              </Stack>
            ))}
          </Stack>
        )}

        {!loading && error && (
          <Typography variant="body2" color="error" sx={{ px: 2, py: 2 }}>
            {error}
          </Typography>
        )}

        {!loading && !error && users.length === 0 && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ px: 2, py: 4, textAlign: 'center' }}
          >
            {mode === 'followers' ? 'No followers yet.' : 'Not following anyone yet.'}
          </Typography>
        )}

        {!loading && !error && users.length > 0 && (
          <List disablePadding>
            {users.map((person) => (
              <ListItemButton
                key={person.id}
                component={RouterLink}
                to={`/profile/${person.id}`}
                onClick={() => {
                  onSelectUser?.(person.id);
                  onClose();
                }}
                sx={{ borderRadius: 1.5, mb: 0.5 }}
              >
                <ListItemAvatar>
                  <Avatar
                    src={person.profile_picture_url || undefined}
                    alt={person.username}
                    sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', fontWeight: 600 }}
                  >
                    {person.username?.charAt(0)?.toUpperCase()}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={person.username}
                  primaryTypographyProps={{ fontWeight: 600, variant: 'body2' }}
                  secondary={person.email}
                  secondaryTypographyProps={{ variant: 'caption' }}
                />
              </ListItemButton>
            ))}
          </List>
        )}
      </Box>
    </Dialog>
  );
}
