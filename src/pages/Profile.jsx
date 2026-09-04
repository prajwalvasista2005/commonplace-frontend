import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Alert,
  Avatar,
  Box,
  Button,
  ButtonBase,
  Card,
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
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import PhotoCameraOutlinedIcon from '@mui/icons-material/PhotoCameraOutlined';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import PersonRemoveOutlinedIcon from '@mui/icons-material/PersonRemoveOutlined';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import { useAuth } from '../hooks/useAuth';
import api, { getErrorMessage } from '../api/axios';
import {
  fetchSavedPosts,
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

  // Normalize IDs for comparison
  const currentUserId = currentUser?.id != null ? String(currentUser.id) : null;
  const routeUserId = routeId != null ? String(routeId) : null;
  const viewingOwnProfile = !routeUserId || routeUserId === currentUserId;
  const profileId = viewingOwnProfile ? currentUserId : routeUserId;

  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [activeTab, setActiveTab] = useState(0); // 0: Posts, 1: Saved (if own profile)
  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(true);
  const [savedLoading, setSavedLoading] = useState(false);
  const [error, setError] = useState('');

  const [isFollowing, setIsFollowing] = useState(false);
  const [followBusy, setFollowBusy] = useState(false);
  const [followError, setFollowError] = useState('');

  const [avatarError, setAvatarError] = useState('');
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  // Clear confirmation dialog state
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

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
      // Non-fatal
    } finally {
      setPostsLoading(false);
    }
  }, [profileId]);

  const loadSavedPosts = useCallback(async () => {
    if (!viewingOwnProfile) return;
    setSavedLoading(true);
    try {
      const data = await fetchSavedPosts();
      setSavedPosts(data);
    } catch {
      // Non-fatal
    } finally {
      setSavedLoading(false);
    }
  }, [viewingOwnProfile]);

  const checkFollowing = useCallback(async () => {
    if (!profileId || viewingOwnProfile || !currentUser) return;
    try {
      const { data } = await api.get('/users/me/following-ids');
      if (Array.isArray(data)) {
        setIsFollowing(data.includes(Number(profileId)));
        return;
      }
    } catch {
      // fallback
    }

    try {
      const { data } = await api.get(`/users/${currentUser.id}/following`, {
        params: { limit: 100 },
      });
      setIsFollowing(data.some((person) => String(person.id) === String(profileId)));
    } catch {
      // neutral
    }
  }, [profileId, viewingOwnProfile, currentUser]);

  useEffect(() => {
    loadProfile();
    loadPosts();
    checkFollowing();
    if (viewingOwnProfile) {
      loadSavedPosts();
    }
  }, [loadProfile, loadPosts, checkFollowing, loadSavedPosts, viewingOwnProfile]);

  const handleDeleteAccount = async () => {
    if (!currentUserId || deleteConfirmText.trim() !== 'DELETE') return;
    setDeleting(true);
    setDeleteError('');
    try {
      await api.delete(`/users/${currentUserId}`);
      logout();
      navigate('/register');
    } catch (err) {
      setDeleteError(getErrorMessage(err, 'Failed to delete account.'));
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
      <Box sx={{ maxWidth: 760, mx: 'auto' }}>
        <Skeleton variant="rounded" height={180} sx={{ mb: 3 }} />
        <Stack spacing={2}>
          {[1, 2].map((key) => (
            <Skeleton key={key} variant="rounded" height={140} />
          ))}
        </Stack>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ maxWidth: 760, mx: 'auto' }}>
        <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>
      </Box>
    );
  }

  if (!profile) return null;

  return (
    <Box sx={{ maxWidth: 760, mx: 'auto' }}>
      {/* Profile Card */}
      <Paper variant="outlined" sx={{ p: { xs: 2.5, sm: 3.5 }, mb: 3.5, borderRadius: 3 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems={{ sm: 'center' }}>
          {/* Avatar & Upload Button */}
          <Box sx={{ position: 'relative', alignSelf: { xs: 'center', sm: 'flex-start' } }}>
            <Avatar
              src={profile.profile_picture_url || undefined}
              alt={profile.username}
              sx={{
                width: 92,
                height: 92,
                fontSize: '2.5rem',
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                fontWeight: 650,
                border: 2,
                borderColor: 'divider',
              }}
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
                    aria-label="Change profile picture"
                    sx={{
                      position: 'absolute',
                      bottom: -2,
                      right: -2,
                      bgcolor: 'background.paper',
                      border: 1,
                      borderColor: 'divider',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                      '&:hover': { bgcolor: 'background.paper' },
                    }}
                  >
                    <PhotoCameraOutlinedIcon fontSize="small" />
                  </IconButton>
                </label>
              </>
            )}
          </Box>

          {/* User Details & Action Button */}
          <Box sx={{ flex: 1, minWidth: 0, textAlign: { xs: 'center', sm: 'left' } }}>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              alignItems={{ xs: 'center', sm: 'flex-start' }}
              justifyContent="space-between"
              spacing={1.5}
            >
              <Box>
                <Typography variant="h5" component="h1" sx={{ fontWeight: 700, mb: 0.25 }}>
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
                  sx={{ borderRadius: 2, px: 2 }}
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
                  sx={{ borderRadius: 2, px: 2.5 }}
                >
                  {isFollowing ? 'Unfollow' : 'Follow'}
                </Button>
              )}
            </Stack>

            {followError && (
              <Typography variant="caption" color="error" sx={{ display: 'block', mt: 1 }}>
                {followError}
              </Typography>
            )}
            {avatarError && (
              <Typography variant="caption" color="error" sx={{ display: 'block', mt: 1 }}>
                {avatarError}
              </Typography>
            )}

            {/* Social Stats Counters */}
            <Stack
              direction="row"
              spacing={3}
              justifyContent={{ xs: 'center', sm: 'flex-start' }}
              sx={{ mt: 2.5 }}
            >
              <Typography variant="body2" color="text.secondary">
                <strong style={{ color: 'inherit' }}>{posts.length}</strong> posts
              </Typography>
              <ButtonBase
                onClick={() => setListDialog('followers')}
                disableRipple
                sx={{ '&:hover': { textDecoration: 'underline' } }}
              >
                <Typography variant="body2" color="text.secondary">
                  <strong style={{ color: 'inherit' }}>{profile.followers_count}</strong> followers
                </Typography>
              </ButtonBase>
              <ButtonBase
                onClick={() => setListDialog('following')}
                disableRipple
                sx={{ '&:hover': { textDecoration: 'underline' } }}
              >
                <Typography variant="body2" color="text.secondary">
                  <strong style={{ color: 'inherit' }}>{profile.following_count}</strong> following
                </Typography>
              </ButtonBase>
            </Stack>
          </Box>
        </Stack>

        {/* Danger Zone: Delete Account (strictly confirmation-guarded, NO redundant logout) */}
        {viewingOwnProfile && (
          <>
            <Divider sx={{ my: 2.5 }} />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                size="small"
                color="error"
                startIcon={<DeleteOutlineIcon fontSize="small" />}
                onClick={() => {
                  setDeleteConfirmText('');
                  setDeleteOpen(true);
                }}
                sx={{ opacity: 0.8, '&:hover': { opacity: 1 } }}
              >
                Delete account
              </Button>
            </Box>
          </>
        )}
      </Paper>

      {/* Tabs for Own Profile: My Posts vs Saved Posts */}
      {viewingOwnProfile ? (
        <Box sx={{ mb: 2.5 }}>
          <Tabs
            value={activeTab}
            onChange={(_, val) => setActiveTab(val)}
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.95rem',
                minWidth: 'auto',
                px: 2.5,
              },
            }}
          >
            <Tab icon={<ArticleOutlinedIcon sx={{ fontSize: '1.1rem' }} />} iconPosition="start" label={`Posts (${posts.length})`} />
            <Tab icon={<BookmarkBorderOutlinedIcon sx={{ fontSize: '1.1rem' }} />} iconPosition="start" label={`Saved (${savedPosts.length})`} />
          </Tabs>
        </Box>
      ) : (
        <Typography variant="h6" component="h2" sx={{ mb: 2, fontWeight: 650 }}>
          Posts by {profile.username}
        </Typography>
      )}

      {/* Tab 0: User Posts */}
      {activeTab === 0 && (
        <>
          {postsLoading ? (
            <Stack spacing={2}>
              {[1, 2].map((key) => (
                <Skeleton key={key} variant="rounded" height={140} />
              ))}
            </Stack>
          ) : posts.length === 0 ? (
            <Card sx={{ textAlign: 'center', py: 6, px: 2 }}>
              <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
                {viewingOwnProfile ? "You haven't posted anything yet." : 'No posts yet.'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {viewingOwnProfile
                  ? 'When you publish an observation or thought, it will appear here.'
                  : 'Check back later to see new publications from this author.'}
              </Typography>
            </Card>
          ) : (
            <Stack spacing={2.5}>
              {posts.map((item) => (
                <PostCard
                  key={item.post.id}
                  item={item}
                  onDelete={() => setPosts((prev) => prev.filter((p) => p.post.id !== item.post.id))}
                />
              ))}
            </Stack>
          )}
        </>
      )}

      {/* Tab 1: Saved Posts (Own Profile only) */}
      {viewingOwnProfile && activeTab === 1 && (
        <>
          {savedLoading ? (
            <Stack spacing={2}>
              {[1, 2].map((key) => (
                <Skeleton key={key} variant="rounded" height={140} />
              ))}
            </Stack>
          ) : savedPosts.length === 0 ? (
            <Card sx={{ textAlign: 'center', py: 6, px: 2 }}>
              <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
                No saved posts yet.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Bookmark interesting posts from your feed to revisit them here at any time.
              </Typography>
            </Card>
          ) : (
            <Stack spacing={2.5}>
              {savedPosts.map((item) => (
                <PostCard
                  key={item.post.id}
                  item={item}
                  onUpdate={(updated) => {
                    if (updated.saved === false) {
                      setSavedPosts((prev) => prev.filter((p) => p.post.id !== item.post.id));
                    } else {
                      setSavedPosts((prev) =>
                        prev.map((p) => (p.post.id === item.post.id ? updated : p))
                      );
                    }
                  }}
                  onDelete={() =>
                    setSavedPosts((prev) => prev.filter((p) => p.post.id !== item.post.id))
                  }
                />
              ))}
            </Stack>
          )}
        </>
      )}

      {/* Follow / Following Users Modal */}
      <FollowListDialog
        open={Boolean(listDialog)}
        onClose={() => setListDialog(null)}
        userId={profileId}
        mode={listDialog}
      />

      {/* Verified Account Deletion Confirmation Modal */}
      <Dialog
        open={deleteOpen}
        onClose={() => !deleting && setDeleteOpen(false)}
        aria-labelledby="delete-account-title"
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle id="delete-account-title" sx={{ fontWeight: 650, color: 'error.main' }}>
          Delete your account?
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: 'text.secondary', mb: 2.5 }}>
            This action is permanent and irreversible. All your posts, comments, likes, and profile
            information will be permanently erased.
          </DialogContentText>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: 'text.primary' }}>
            To confirm deletion, type <strong>DELETE</strong> below:
          </Typography>
          <TextField
            fullWidth
            size="small"
            value={deleteConfirmText}
            onChange={(e) => setDeleteConfirmText(e.target.value)}
            placeholder="DELETE"
            disabled={deleting}
            autoFocus
          />
          {deleteError && (
            <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>
              {deleteError}
            </Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setDeleteOpen(false)} disabled={deleting} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleDeleteAccount}
            color="error"
            variant="contained"
            disabled={deleting || deleteConfirmText.trim() !== 'DELETE'}
          >
            {deleting ? 'Deleting account...' : 'Permanently delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

