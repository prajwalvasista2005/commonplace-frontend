import api from "./axios";

export async function uploadProfilePicture(file) {
  const formData = new FormData();
  formData.append("file", file);

  return api.post("/users/me/profile-picture", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export async function uploadPostImage(postId, file) {
  const formData = new FormData();
  formData.append("file", file);

  return api.post(`/posts/${postId}/image`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export async function updatePost(
  postId,
  { title, content, published, image_url, image_public_id }
) {
  const { data } = await api.put(`/posts/${postId}`, {
    title,
    content,
    published,
    image_url: image_url ?? null,
    image_public_id: image_public_id ?? null,
  });

  return data;
}

export async function deletePostImage(postId) {
  return api.delete(`/posts/${postId}/image`);
}

export async function updateUser(userId, { email, password }) {
  const { data } = await api.put(`/users/${userId}`, {
    email,
    password,
  });

  return data;
}

export async function getUserProfile(userId) {
  const { data } = await api.get(`/users/${userId}`);
  return data;
}

export async function followUser(followingId) {
  const { data } = await api.post("/follow", {
    following_id: followingId,
  });

  return data;
}

export async function unfollowUser(followingId) {
  return api.delete(`/follow/${followingId}`);
}

export async function getFollowers(userId, limit = 20, skip = 0) {
  const { data } = await api.get(`/users/${userId}/followers`, {
    params: {
      limit,
      skip,
    },
  });

  return data;
}

export async function getFollowing(userId, limit = 20, skip = 0) {
  const { data } = await api.get(`/users/${userId}/following`, {
    params: {
      limit,
      skip,
    },
  });

  return data;
}

export async function fetchUserPosts(userId, maxPosts = 50) {
  const userPosts = [];

  let skip = 0;
  const limit = 50;

  // URL params can arrive as strings while API IDs are numbers.
  const normalizedUserId = Number(userId);

  while (userPosts.length < maxPosts) {
    const { data } = await api.get("/posts", {
      params: {
        limit,
        skip,
      },
    });

    const matchingPosts = data.filter(
      (item) => Number(item.post.owner_id) === normalizedUserId
    );

    userPosts.push(...matchingPosts);

    if (data.length < limit) {
      break;
    }

    skip += limit;

    // Safety limit to prevent excessive pagination requests.
    if (skip > 500) {
      break;
    }
  }

  return userPosts.slice(0, maxPosts);
}

export async function fetchSavedPosts(limit = 20, skip = 0) {
  const { data } = await api.get("/saved", {
    params: {
      limit,
      skip,
    },
  });

  return data.map((detail) => ({
    post: detail.post,
    votes: detail.votes,
    comments_count: detail.comments_count,
    saved: true,
  }));
}

export const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

export const MAX_IMAGE_SIZE_MB = 5;

export function validateImageFile(file) {
  if (!file) {
    return null;
  }

  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return "Image must be JPEG, PNG, WebP, or GIF.";
  }

  if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
    return `Image must be under ${MAX_IMAGE_SIZE_MB} MB.`;
  }

  return null;
}