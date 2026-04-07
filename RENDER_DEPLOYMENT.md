# Gomcaddy Render Deployment Guide

You can deploy this project to Render as **one single Web Service** by deploying only the `frontend/` app.

That works because the Next.js app now handles:

- frontend pages
- API routes
- MongoDB database access
- login and signup logic

So for Render, you do **not** need to deploy `backend/` separately.

## What to deploy

Deploy only:

- [frontend](C:/Users/adama/mcaddytechsolutions/mcaddytechsolutions/gomcaddy/frontend)

The `backend/` folder can remain in the repo for local development or reference, but it is not required for the one-service Render deployment flow.

## 1. Push your code to GitHub

Render deploys from a Git provider, so first push this repository to GitHub, GitLab, or Bitbucket.

## 2. Create one Render Web Service

In Render:

1. Click **New**
2. Select **Web Service**
3. Connect your repository

Use these settings:

- **Name**: `gomcaddy`
- **Root Directory**: `frontend`
- **Environment**: `Node`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`

## 3. Add environment variables in Render

In the Render service, open **Environment** and add:

- `MONGODB_URI`
- `JWT_SECRET`
- `NODE_ENV`

Recommended values:

```env
MONGODB_URI=your-mongodb-atlas-connection-string
JWT_SECRET=your-long-random-secret
NODE_ENV=production
```

## 4. MongoDB Atlas setup

Since Render will connect directly to MongoDB Atlas:

1. Open MongoDB Atlas
2. Go to **Network Access**
3. Make sure Atlas allows your Render service to connect

For testing, some people temporarily allow:

```text
0.0.0.0/0
```

For production, restrict access properly if possible.

## 5. Deploy

After the environment variables are added, Render will build and start the service.

Your live app will serve:

- the frontend pages
- the API endpoints under `/api/...`

from the same Render web service.

## 6. Verify deployment

After deployment:

1. Open your Render app URL
2. Confirm the homepage loads
3. Confirm restaurants and menu items load
4. Test signup and login
5. Test adding items to cart

## 7. Important notes

- Do not set `BACKEND_API_URL` for the one-service Render deployment. It is no longer needed.
- The `frontend/` app now talks directly to MongoDB through Next.js server routes.
- Keep `JWT_SECRET` private and set it only in Render and your local env file.
- Deploy this as a **Web Service**, not a Static Site.

## 8. Render summary

- Service type: **Web Service**
- Root directory: `frontend`
- Build: `npm install && npm run build`
- Start: `npm start`

## Official Render references

- Next.js on Render: https://render.com/docs/deploy-nextjs-app
- Web services: https://render.com/docs/web-services
- Environment variables: https://render.com/docs/configure-environment-variables
