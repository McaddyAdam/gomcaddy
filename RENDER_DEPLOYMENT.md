# Gomcaddy Render Deployment Guide

Deploy Gomcaddy to Render as one Node web service using only the [frontend](C:/Users/adama/mcaddytechsolutions/mcaddytechsolutions/gomcaddy/frontend) app.

This works because the Next.js app already handles:

- the website UI
- the `/api/*` routes
- MongoDB access
- registration and login

You do not need to deploy [backend](C:/Users/adama/mcaddytechsolutions/mcaddytechsolutions/gomcaddy/backend) to Render for the current production setup.

**Before You Start**

- Push this repository to GitHub, GitLab, or Bitbucket
- Make sure your MongoDB database is reachable from Render
- Make sure the `frontend` app has valid values for `MONGODB_URI` and `JWT_SECRET`

**What To Deploy**

Deploy only:

- [frontend](C:/Users/adama/mcaddytechsolutions/mcaddytechsolutions/gomcaddy/frontend)

Render should treat it as a Node web service, not a static site.

**Render Settings**

Create a new Web Service in Render and use these values:

- Service type: `Web Service`
- Environment: `Node`
- Root Directory: `frontend`
- Build Command: `npm install && npm run build`
- Start Command: `npm start`

Recommended:

- Branch: your production branch, usually `main`
- Auto-Deploy: enabled

Why these commands:

- `npm run build` creates the Next.js production build
- `npm start` runs `next start` inside `frontend`

**Environment Variables**

Add these in Render under the service Environment tab:

- `MONGODB_URI`
- `JWT_SECRET`
- `NODE_ENV`

Example values:

```env
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/gomcaddy?retryWrites=true&w=majority
JWT_SECRET=replace-with-a-long-random-secret
NODE_ENV=production
```

Notes:

- `MONGODB_URI` must point to a real MongoDB Atlas or MongoDB server
- `JWT_SECRET` should be long and hard to guess
- Do not commit production secrets into the repo

**MongoDB Atlas Checklist**

Because the app connects to MongoDB directly from Render:

1. Open MongoDB Atlas
2. Go to `Network Access`
3. Allow Render to connect
4. Go to `Database Access`
5. Confirm the username and password in `MONGODB_URI` are correct

For testing, many teams temporarily allow:

```text
0.0.0.0/0
```

That is easy for setup, but it is broader than ideal. Tighten it later if you can.

**Deploy Steps**

1. Push your latest code
2. Create the Render Web Service
3. Set the root directory to `frontend`
4. Add the environment variables
5. Start the deploy
6. Wait for the build logs to show `next build` completed
7. Open the generated Render URL

**Verify After Deploy**

Check these in the live app:

- `/` loads
- `/menu` loads restaurants and menu items
- `/api/restaurants?type=restaurant` returns JSON
- `/api/categories` returns JSON
- signup works
- login works

If menu data is missing, confirm your MongoDB database actually contains restaurants and menu records or fallback data.

**Common Problems**

- Build fails with missing env vars:
  Set `MONGODB_URI` and `JWT_SECRET` in Render, then redeploy.
- App deploys but restaurants do not load:
  Check MongoDB Atlas network access and database credentials.
- Render keeps failing on an older cached build:
  redeploy the latest commit and, if needed, use Render's clear cache and deploy option.
- Render points at the wrong folder:
  Make sure `Root Directory` is exactly `frontend`.
- You deployed the backend separately and the app still looks broken:
  The production app uses the Next.js server routes in `frontend`; the old Express backend is not required.
- Images look different from local:
  The app uses unoptimized Next image handling in production, which is expected with the current config.

**Current Production Shape**

- Frontend runtime: Next.js in [frontend](C:/Users/adama/mcaddytechsolutions/mcaddytechsolutions/gomcaddy/frontend)
- Database access: server-side through [mongodb.ts](C:/Users/adama/mcaddytechsolutions/mcaddytechsolutions/gomcaddy/frontend/lib/mongodb.ts)
- Menu and restaurant API: Next.js route handlers under [app/api](C:/Users/adama/mcaddytechsolutions/mcaddytechsolutions/gomcaddy/frontend/app/api)

**Render Summary**

- Deploy folder: `frontend`
- Build command: `npm install && npm run build`
- Start command: `npm start`
- Required env vars: `MONGODB_URI`, `JWT_SECRET`, `NODE_ENV`

**Official Render Docs**

- https://render.com/docs/deploy-nextjs-app
- https://render.com/docs/web-services
- https://render.com/docs/configure-environment-variables
