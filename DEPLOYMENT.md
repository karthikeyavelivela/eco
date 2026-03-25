# Deployment Guide

This document outlines the simplest and most robust way to deploy the Tourist Analytics platform, split between its Next.js Frontend and FastAPI Backend.

## 1. Deploying the Frontend (Vercel)

Vercel is the native platform for Next.js applications and provides instantaneous global CDNs.

1. **Commit your code** and push it to a GitHub, GitLab, or Bitbucket repository.
2. **Log into Vercel** (`https://vercel.com`) and click **"Add New Project"**.
3. **Import your repository**.
4. **Configure the Project Options**:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`  *(critical: point it to the frontend folder)*
   - **Build Command**: `next build`
   - **Install Command**: `npm install`
5. **Environment Variables**:
   - Expand the Environment Variables section.
   - Add any variables from your `frontend/.env.local`. 
   - Ensure you set your API URL (e.g., `NEXT_PUBLIC_API_URL`) to point to the backend URL you will create next.
6. Click **Deploy**. Vercel will install dependencies, build the Next.js app, and provide you with a live URL.

---

## 2. Deploying the Backend (Render)

Render is an effortless PaaS for Python-based web applications and background workers.

1. **Log into Render** (`https://render.com`) and click **"New +" -> "Web Service"**.
2. **Connect your repository** (the same repository hosting the entire codebase).
3. **Configure the Web Service Settings**:
   - **Name**: `tourist-backend` (or a name of your choice)
   - **Root Directory**: `backend` *(critical: point it to the backend folder)*
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. **Environment Variables**:
   - `PYTHON_VERSION`: `3.11` (or your local python version)
   - Add any required DB URIs (e.g., MongoDB credentials) present in your local `.env`.
5. Click **Create Web Service**. 
6. Render will fetch the latest commit, install requirements, and run the FastAPI server. It will provide a secure `https://your-service.onrender.com` URL.

---

## 3. Final Connection

Once both services are active:
1. Copy the backend URL from Render.
2. Go to your Vercel project's settings -> **Environment Variables**.
3. Update or add the environment variable pointing to your backend (e.g., `NEXT_PUBLIC_API_URL=https://tourist-backend.onrender.com/api`).
4. Trigger a **Redeploy** on Vercel so the frontend build picks up the new backend URL.

Your platform is now live!
