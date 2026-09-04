# Commonplace — Frontend

The frontend for **Commonplace**, a full-stack social media platform designed for sharing ideas, discussions, and content worth saving.

The application is built with React and Material UI and communicates with a FastAPI backend through a REST API.

## Live Application

**Production:**  
https://commonplace-snowy.vercel.app

**Backend API:**  
https://social-media-u3ph.onrender.com

---

## Overview

Commonplace allows users to create and interact with posts while building a small social network around shared ideas.

The frontend provides:

- User authentication
- Responsive feed
- Post creation and editing
- Likes and unlikes
- Comments
- Follow and unfollow
- Saved posts
- User profiles
- Profile editing
- Responsive navigation
- Light and dark themes
- Loading states and skeletons
- Error handling and error pages
- Terms and Privacy pages

The frontend is designed to work directly with the existing FastAPI backend without introducing separate mock APIs or duplicated business logic.

---

## Tech Stack

### Core

- React
- Vite
- JavaScript (ES6+)

### UI

- Material UI (MUI)
- Emotion

### Routing

- React Router

### Forms & Validation

- React Hook Form

### HTTP & Authentication

- Axios
- JWT-based authentication
- Access and refresh tokens
- `jwt-decode`

### Development

- ESLint / Oxlint
- Vite production builds

### Deployment

- Vercel

---

## Architecture

The frontend follows a component-based React architecture.

```text
src/
├── api/
│   ├── axios.js
│   └── services.js
│
├── components/
│   ├── comments/
│   ├── common/
│   ├── posts/
│   └── profile/
│
├── context/
│   ├── AuthContext.jsx
│   └── ThemeContext.jsx
│
├── hooks/
│
├── pages/
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Profile.jsx
│   ├── EditProfile.jsx
│   ├── CreatePost.jsx
│   ├── EditPost.jsx
│   ├── PostDetail.jsx
│   ├── NotFound.jsx
│   ├── ErrorPages.jsx
│   ├── Terms.jsx
│   └── Privacy.jsx
│
├── theme.js
├── App.jsx
├── index.css
└── main.jsx
