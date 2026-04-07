# Gomcaddy Render Deployment Guide

This repo should be deployed to Render using **one Blueprint** so both apps are created together from the same repository.

That means:

- one `render.yaml` file in the repo root
- one Blueprint setup flow in Render
- two services managed together by Render:
  - `frontend`
  - `backend`

This is the best match for Render's current monorepo and Blueprint setup.

Official references:

- Monorepo support: https://render.com/docs/monorepo-support
- Blueprints overview: https://render.com/docs/infrastructure-as-code
- Blueprint spec: https://render.com/docs/blueprint-spec

## How this works

Your repository has two apps:

- [frontend](C:/Users/adama/mcaddytechsolutions/mcaddytechsolutions/gomcaddy/frontend)
- [backend](C:/Users/adama/mcaddytechsolutions/mcaddytechsolutions/gomcaddy/backend)

Render will read the root [render.yaml](C:/Users/adama/mcaddytechsolutions/mcaddytechsolutions/gomcaddy/render.yaml) file and create both services together in one Blueprint deployment.

## Step 1. Push the repo to GitHub

Render deploys from a Git provider, so first push this repository to GitHub, GitLab, or Bitbucket.

## Step 2. Create the Blueprint on Render

In Render:

1. Click **New**
2. Click **Blueprint**
3. Connect your repository
4. Render will detect the `render.yaml`
5. Review the services and continue

Render will create both services from the same Blueprint.

## Step 3. Add required environment variable values

The Blueprint file defines the variable names, but you must provide the values in Render.

### Backend variables

Set these for the backend service:

- `MONGODB_URI`
- `JWT_SECRET`
- `NODE_ENV`

Recommended values:

```env
NODE_ENV=production
JWT_SECRET=your-long-random-secret
MONGODB_URI=your-mongodb-atlas-connection-string
```

### Frontend variables

Set this for the frontend service:

- `BACKEND_API_URL`

Use your backend Render URL, for example:

```env
BACKEND_API_URL=https://gomcaddy-backend.onrender.com
```

## Step 4. Let Render deploy both services

After env vars are filled in, Render will build and deploy:

- the backend from `backend/`
- the frontend from `frontend/`

Both are managed from the same Blueprint.

## Step 5. Verify deployment

After deployment:

1. Open the frontend URL
2. Confirm the homepage loads
3. Confirm restaurants and menu items load
4. Confirm login and signup work
5. Confirm the cart flow works

## Notes

- This is a **single Render Blueprint deployment**, not one single process running both apps.
- Render still creates **two services**, because your frontend and backend are separate applications.
- The advantage is that they are provisioned and managed together from one `render.yaml`.
- This is the clean Render-native way to deploy a monorepo like this.

## If MongoDB Atlas blocks Render

If the backend cannot connect to MongoDB Atlas after deployment:

1. Open MongoDB Atlas
2. Go to **Network Access**
3. Allow Render to connect

For testing, some teams temporarily allow `0.0.0.0/0`, but for production you should lock access down properly.
