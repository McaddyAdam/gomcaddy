# Gomcaddy Render Deployment Guide

This project should be deployed to Render as **two separate Web Services**:

- `backend/` as a Node + Express API
- `frontend/` as a Next.js web app

This matches Render's current docs for:

- Next.js apps deployed as a **Node Web Service**
- Express apps deployed as a **Node Web Service**

## 1. Push your code to GitHub

Render deploys from a Git provider, so first make sure this repository is pushed to GitHub, GitLab, or Bitbucket.

## 2. Deploy the backend on Render

In Render:

1. Click **New**.
2. Select **Web Service**.
3. Connect your repository.
4. Set the following values:

### Backend settings

- **Name**: `gomcaddy-backend`
- **Root Directory**: `backend`
- **Environment**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`

### Backend environment variables

Add these in Render under the backend service's **Environment** tab:

- `MONGODB_URI` = your MongoDB Atlas connection string
- `JWT_SECRET` = a strong secret key
- `NODE_ENV` = `production`

You do **not** need to hardcode `PORT` on Render unless you want to override it. Render automatically provides a port for web services.

## 3. Get the backend Render URL

After the backend deploys, Render will give you a public URL such as:

```text
https://gomcaddy-backend.onrender.com
```

Copy that URL. You will use it in the frontend environment variables.

## 4. Deploy the frontend on Render

In Render:

1. Click **New**.
2. Select **Web Service**.
3. Connect the same repository.
4. Set the following values:

### Frontend settings

- **Name**: `gomcaddy-frontend`
- **Root Directory**: `frontend`
- **Environment**: `Node`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`

### Frontend environment variables

Add:

- `BACKEND_API_URL` = your backend Render URL

Example:

```text
BACKEND_API_URL=https://gomcaddy-backend.onrender.com
```

## 5. Redeploy the frontend after setting env vars

Once `BACKEND_API_URL` is saved, trigger a deploy if Render does not do it automatically.

## 6. Verify deployment

After both services are live:

- Open the frontend Render URL
- Confirm the homepage loads
- Confirm restaurants and menus load from the backend
- Test signup and login
- Test adding menu items to cart

## 7. Important production notes

- Your backend must stay publicly reachable if the frontend will call it directly through `BACKEND_API_URL`.
- MongoDB Atlas must allow Render to connect. If Atlas network rules are too strict, the backend will fail to connect.
- Replace the current local JWT secret with a strong production value in Render.
- Since your frontend uses Next.js server routes and runtime fetches, deploy it as a **Web Service**, not a Static Site.

## 8. Recommended Render setup summary

### Backend

- Service type: **Web Service**
- Root directory: `backend`
- Build: `npm install`
- Start: `npm start`

### Frontend

- Service type: **Web Service**
- Root directory: `frontend`
- Build: `npm install && npm run build`
- Start: `npm start`

## Official Render references

- Next.js on Render: https://render.com/docs/deploy-nextjs-app
- Express on Render: https://render.com/docs/deploy-node-express-app
- Web services: https://render.com/docs/web-services
- Environment variables: https://render.com/docs/configure-environment-variables
- Default environment variables: https://render.com/docs/environment-variables
