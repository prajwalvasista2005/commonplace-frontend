import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Alert,
  Avatar,
  Box,
  Button,
  ButtonBase,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  IconButton,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import PhotoCameraOutlinedIcon from '@mui/icons-material/PhotoCameraOutlined';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import PersonRemoveOutlinedIcon from '@mui/icons-material/PersonRemoveOutlined';
import { useAuth } from '../hooks/useAuth';
import api, { getErrorMessage } from '../api/axios';
import {
  fetchUserPosts,
  followUser,
  getUserProfile,
  unfollowUser,
  uploadProfilePicture,
  validateImageFile,
} from '../api/services';
import PostCard from '../components/posts/PostCard';
import FollowListDialog from '../components/profile/FollowListDialog';

export default function Profile() {
  const { id: routeId } = useParams();
  const { user: currentUser, logout, refreshUser } = useAuth();
  const navigate = useNavigate();

  const viewingOwnProfile = !routeId || Number(routeId) === currentUser?.id;
  const profileId = viewingOwnProfile ? currentUser?.id : Number(routeId);

  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(true);
  const [error, setError] = useState('');

  const [isFollowing, setIsFollowing] = useState(false);
  const [followBusy, setFollowBusy] = useState(false);
  const [followError, setFollowError] = useState('');

  const [avatarError, setAvatarError] = useState('');
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [listDialog, setListDialog] = useState(null); // 'followers' | 'following' | null

  const loadProfile = useCallback(async () => {
    if (!profileId) return;
    setLoading(true);
    setError('');
    try {
      const data = await getUserProfile(profileId);
      setProfile(data);
    } catch (err) {
      setError(getErrorMessage(err, 'Could not load this profile.'));
    } finally {
      setLoading(false);
    }
  }, [profileId]);

  const loadPosts = useCallback(async () => {
    if (!profileId) return;
    setPostsLoading(true);
    try {
      const data = await fetchUserPosts(profileId);
      setPosts(data);
    } catch {
      // Non-fatal — profile still renders without posts
    } finally {
      setPostsLoading(false);
    }
  }, [profileId]);

  const checkFollowing = useCallback(async () => {
    if (!profileId || viewingOwnProfile || !currentUser) return;
    try {
      const { data } = await api.get(`/users/${currentUser.id}/following`, {
        params: { limit: 100 },
      });
      setIsFollowing(data.some((person) => person.id === profileId));
    } catch {
      // If this fails, the follow button just starts in a neutral state
    }
  }, [profileId, viewingOwnProfile, currentUser]);

  useEffect(() => {
    loadProfile();
    loadPosts();
    checkFollowing();
  }, [loadProfile, loadPosts, checkFollowing]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleDeleteAccount = async () => {
    if (!currentUser?.id) return;
    setDeleting(true);
    try {
      await api.delete(`/users/${currentUser.id}`);
      await logout();
      navigate('/register');
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to delete account.'));
    } finally {
      setDeleting(false);
      setDeleteOpen(false);
    }
  };

  const handleAvatarChange = async (event) => {
    const file = event.target.files?.[0];
    setAvatarError('');
    if (!file) return;

    const validationError = validateImageFile(file);
    if (validationError) {
      setAvatarError(validationError);
      return;
    }

    setUploadingAvatar(true);
    try {
      await uploadProfilePicture(file);
      await refreshUser();
      await loadProfile();
    } catch (err) {
      setAvatarError(getErrorMessage(err, 'Failed to upload image.'));
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleFollowToggle = async () => {
    if (!profileId || followBusy) return;
    setFollowBusy(true);
    setFollowError('');

    const wasFollowing = isFollowing;
    setIsFollowing(!wasFollowing);
    setProfile((prev) =>
      prev
        ? { ...prev, followers_count: prev.followers_count + (wasFollowing ? -1 : 1) }
        : prev
    );

    try {
      if (wasFollowing) {
        await unfollowUser(profileId);
      } else {
        await followUser(profileId);
      }
    } catch (err) {
      setIsFollowing(wasFollowing);
      setProfile((prev) =>
        prev
          ? { ...prev, followers_count: prev.followers_count + (wasFollowing ? 1 : -1) }
          : prev
      );
      setFollowError(getErrorMessage(err, 'Could not update follow status.'));
    } finally {
      setFollowBusy(false);
    }
  };

  if (loading) {
    return (
      <Box>
        <Skeleton variant="rounded" height={160} sx={{ mb: 2 }} />
        <Stack spacing={2}>
          {[1, 2].map((key) => (
            <Skeleton key={key} variant="rounded" height={140} />
          ))}
        </Stack>
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!profile) return null;

  return (
    <Box>
      <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 }, mb: 3 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems={{ sm: 'center' }}>
          <Box sx={{ position: 'relative', alignSelf: { xs: 'center', sm: 'flex-start' } }}>
            <Avatar
              src={profile.profile_picture_url || undefined}
              alt={profile.username}
              sx={{ width: 88, height: 88, fontSize: '2.25rem' }}
            >
              {profile.username?.charAt(0)?.toUpperCase()}
            </Avatar>
            {viewingOwnProfile && (
              <>
                <input
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  id="profile-avatar-upload"
                  type="file"
                  hidden
                  onChange={handleAvatarChange}
                />
                <label htmlFor="profile-avatar-upload">
                  <IconButton
                    component="span"
                    size="small"
                    disabled={uploadingAvatar}
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      bgcolor: 'background.paper',
                      border: 1,
                      borderColor: 'divider',
                      '&:hover': { bgcolor: 'background.paper' },
                    }}
                    aria-label="Change profile picture"
                  >
                    <PhotoCameraOutlinedIcon fontSize="small" />
                  </IconButton>
                </label>
              </>
            )}
          </Box>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              alignItems={{ sm: 'center' }}
              justifyContent="space-between"
              spacing={1.5}
            >
              <Box>
                <Typography variant="h5" component="h1" sx={{ fontWeight: 600 }}>
                  {profile.username}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {profile.email}
                </Typography>
              </Box>

              {viewingOwnProfile ? (
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<EditOutlinedIcon />}
                  onClick={() => navigate('/edit-profile')}
                >
                  Edit profile
                </Button>
              ) : (
                <Button
                  variant={isFollowing ? 'outlined' : 'contained'}
                  size="small"
                  startIcon={isFollowing ? <PersonRemoveOutlinedIcon /> : <PersonAddOutlinedIcon />}
                  onClick={handleFollowToggle}
                  disabled={followBusy}
                >
                  {isFollowing ? 'Unfollow' : 'Follow'}
                </Button>
              )}
            </Stack>

            {followError && (
              <Typography variant="caption" color="error" sx={{ display: 'block', mt: 0.5 }}>
                {followError}
              </Typography>
            )}
            {avatarError && (
              <Typography variant="caption" color="error" sx={{ display: 'block', mt: 0.5 }}>
                {avatarError}
              </Typography>
            )}

            <Stack direction="row" spacing={3} sx={{ mt: 1.5 }}>
              <Typography variant="body2" color="text.secondary">
                <strong>{posts.length}</strong> posts
              </Typography>
              <ButtonBase onClick={() => setListDialog('followers')} disableRipple>
                <Typography variant="body2" color="text.secondary">
                  <strong>{profile.followers_count}</strong> followers
                </Typography>
              </ButtonBase>
              <ButtonBase onClick={() => setListDialog('following')} disableRipple>
                <Typography variant="body2" color="text.secondary">
                  <strong>{profile.following_count}</strong> following
                </Typography>
              </ButtonBase>
            </Stack>
          </Box>
        </Stack>

        {viewingOwnProfile && (
          <>
            <Divider sx={{ my: 3 }} />
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Button variant="outlined" startIcon={<LogoutOutlinedIcon />} onClick={handleLogout}>
                Log out
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteOutlineIcon />}
                onClick={() => setDeleteOpen(true)}
              >
                Delete account
              </Button>
            </Stack>
          </>
        )}
      </Paper>

      <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
        {viewingOwnProfile ? 'Your posts' : `Posts by ${profile.username}`}
      </Typography>

      {postsLoading ? (
        <Stack spacing={2}>
          {[1, 2].map((key) => (
            <Skeleton key={key} variant="rounded" height={140} />
          ))}
        </Stack>
      ) : posts.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <Typography variant="body2" color="text.secondary">
            {viewingOwnProfile ? "You haven't posted anything yet." : 'No posts yet.'}
          </Typography>
        </Box>
      ) : (
        <Stack spacing={2}>
          {posts.map((item) => (
            <PostCard
              key={item.post.id}
              item={item}
              onDelete={() => setPosts((prev) => prev.filter((p) => p.post.id !== item.post.id))}
            />
          ))}
        </Stack>
      )}

      <FollowListDialog
        open={Boolean(listDialog)}
        onClose={() => setListDialog(null)}
        userId={profileId}
        mode={listDialog}
      />

      <Dialog
        open={deleteOpen}
        onClose={() => !deleting && setDeleteOpen(false)}
        aria-labelledby="delete-account-title"
      >
        <DialogTitle id="delete-account-title">Delete account?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This will permanently delete your account and all associated data. This action cannot
            be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteOpen(false)} disabled={deleting}>
            Cancel
          </Button>
          <Button onClick={handleDeleteAccount} color="error" variant="contained" disabled={deleting}>
            {deleting ? 'Deleting...' : 'Delete account'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
