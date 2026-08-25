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
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {mode === 'followers' ? 'Followers' : 'Following'}
        <IconButton onClick={onClose} size="small" aria-label="Close">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <Box sx={{ px: 1, pb: 2, minHeight: 120 }}>
        {loading && (
          <Box sx={{ px: 2 }}>
            {[1, 2, 3].map((key) => (
              <Skeleton key={key} height={56} />
            ))}
          </Box>
        )}

        {!loading && error && (
          <Typography variant="body2" color="error" sx={{ px: 2 }}>
            {error}
          </Typography>
        )}

        {!loading && !error && users.length === 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ px: 2 }}>
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
              >
                <ListItemAvatar>
                  <Avatar src={person.profile_picture_url || undefined} alt={person.username}>
                    {person.username?.charAt(0)?.toUpperCase()}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={person.username} secondary={person.email} />
              </ListItemButton>
            ))}
          </List>
        )}
      </Box>
    </Dialog>
  );
}
