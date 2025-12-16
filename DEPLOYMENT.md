# Deployment Guide

This guide outlines how to deploy the **Driver Payment System** for free using **Render** (for the Backend) and **Vercel** (for the Frontend).

## Prerequisites

1.  **GitHub Account**: You need to push your code to a GitHub repository.
2.  **Supabase Project**: Your database is already hosted on Supabase.
3.  **Render Account**: Sign up at [render.com](https://render.com/).
4.  **Vercel Account**: Sign up at [vercel.com](https://vercel.com/).

---

## Part 1: Push Code to GitHub

1.  Initialize git in your project root (if not already done):
    ```bash
    git init
    ```
2.  Create a `.gitignore` file in the root if it doesn't exist, and add:
    ```
    node_modules
    .env
    dist
    ```
3.  Commit and push your code to a new GitHub repository.

---

## Part 2: Deploy Backend (Render)

1.  **Create Web Service**:
    -   Log in to Render Dashboard.
    -   Click **New +** -> **Web Service**.
    -   Connect your GitHub repository.

2.  **Configure Service**:
    -   **Name**: `driver-payment-backend` (or similar)
    -   **Root Directory**: `backend` (Important! This tells Render where the backend code lives)
    -   **Environment**: `Node`
    -   **Build Command**: `npm install`
    -   **Start Command**: `node server.js`

3.  **Environment Variables**:
    -   Scroll down to "Environment Variables".
    -   Add the following keys from your local `backend/.env` file:
        -   `SUPABASE_URL`: (Your Supabase URL)
        -   `SUPABASE_KEY`: (Your Supabase Key)
        -   `PORT`: `10000` (Render usually expects port 10000 or sets it automatically)

4.  **Deploy**:
    -   Click **Create Web Service**.
    -   Wait for the deployment to finish. You will get a URL like `https://driver-payment-backend.onrender.com`. **Copy this URL.**

---

## Part 3: Deploy Frontend (Vercel)

1.  **Import Project**:
    -   Log in to Vercel Dashboard.
    -   Click **Add New...** -> **Project**.
    -   Import your GitHub repository.

2.  **Configure Project**:
    -   **Framework Preset**: Vite (should be detected automatically).
    -   **Root Directory**: Click "Edit" and select `frontend`.

3.  **Environment Variables**:
    -   Expand "Environment Variables".
    -   Add the following key:
        -   `VITE_API_URL`: Paste your **Render Backend URL** here (e.g., `https://driver-payment-backend.onrender.com/api`).
        -   *Note: You might need to update your frontend code to use this variable if you hardcoded `localhost:3000`.*

4.  **Deploy**:
    -   Click **Deploy**.
    -   Vercel will build and deploy your site. You will get a URL like `https://driver-payment-system.vercel.app`.

---

## Part 4: Final Configuration

### Update Frontend API Client
Ensure your frontend `client.js` uses the environment variable for the base URL.

**File:** `frontend/src/api/client.js`
```javascript
import axios from 'axios';

// Use environment variable or fallback to localhost for development
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const client = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default client;
```

### Update Backend CORS
Ensure your backend allows requests from your new Vercel domain.

**File:** `backend/src/app.js`
```javascript
const cors = require('cors');

app.use(cors({
  origin: [
    'http://localhost:5173', 
    'https://your-vercel-project.vercel.app' // Add your Vercel URL here after deployment
  ],
  credentials: true
}));
```

---

## 🎉 Done!

Your application is now live!
-   **Frontend**: Accessible via the Vercel URL.
-   **Backend**: Running on Render.
-   **Database**: Hosted on Supabase.
