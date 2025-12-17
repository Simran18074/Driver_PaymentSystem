# Deployment Guide

This guide outlines the steps to deploy the Driver Payment System. We recommend using **Render** for the backend and **Vercel** for the frontend.

## Prerequisites

1.  **GitHub Account**: Ensure your project is pushed to a GitHub repository.
2.  **Render Account**: Sign up at [render.com](https://render.com).
3.  **Vercel Account**: Sign up at [vercel.com](https://vercel.com).
4.  **Supabase Project**: You should already have this from your local setup.

---

## 1. Backend Deployment (Render)

1.  **Create a New Web Service**:
    -   Log in to Render.
    -   Click "New +" and select "Web Service".
    -   Connect your GitHub repository.

2.  **Configure the Service**:
    -   **Name**: `driver-payment-backend` (or similar).
    -   **Region**: Choose the one closest to you (e.g., Singapore, Frankfurt).
    -   **Branch**: `main` (or your default branch).
    -   **Root Directory**: `backend` (Important!).
    -   **Runtime**: `Node`.
    -   **Build Command**: `npm install`.
    -   **Start Command**: `npm start`.

3.  **Environment Variables**:
    -   Scroll down to "Environment Variables" and add the following:
        -   `SUPABASE_URL`: Your Supabase Project URL.
        -   `SUPABASE_KEY`: Your Supabase Anon Key.
        -   `FRONTEND_URL`: The URL of your frontend (you can update this later after deploying the frontend, e.g., `https://your-frontend.vercel.app`).
        -   `NODE_VERSION`: `20.11.0` (Optional, but good for consistency).

4.  **Deploy**:
    -   Click "Create Web Service".
    -   Wait for the deployment to finish. Render will provide a URL (e.g., `https://driver-payment-backend.onrender.com`). **Copy this URL.**

---

## 2. Frontend Deployment (Vercel)

1.  **Create a New Project**:
    -   Log in to Vercel.
    -   Click "Add New..." -> "Project".
    -   Import your GitHub repository.

2.  **Configure the Project**:
    -   **Framework Preset**: Vite (should be detected automatically).
    -   **Root Directory**: Click "Edit" and select `frontend`.

3.  **Environment Variables**:
    -   Expand the "Environment Variables" section.
    -   Add:
        -   `VITE_API_URL`: The Render Backend URL you copied earlier (e.g., `https://driver-payment-backend.onrender.com/api`). **Note: Append `/api` if your frontend calls expect it, or just the base URL depending on your axios setup.**
            -   *Check `frontend/src/api/client.js` to see how the base URL is used. If it uses `baseURL: import.meta.env.VITE_API_URL`, ensure the variable includes `/api` if your backend routes are prefixed with it.*

4.  **Deploy**:
    -   Click "Deploy".
    -   Wait for the build to complete. Vercel will provide a domain (e.g., `https://driver-payment-system.vercel.app`).

---

## 3. Post-Deployment Configuration

1.  **Update Backend CORS**:
    -   Go back to your Render dashboard.
    -   Update the `FRONTEND_URL` environment variable with your new Vercel domain (e.g., `https://driver-payment-system.vercel.app`).
    -   Render will automatically redeploy.

2.  **Verify**:
    -   Open your Vercel app URL.
    -   Try logging in or fetching data to ensure the frontend can talk to the backend.
