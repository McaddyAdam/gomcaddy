# Gomcaddy Installation Guide

This repository contains:

- `frontend/` as the main Next.js app
- `backend/` as a separate Express backend kept for local/reference use

The current app flow can run directly from the Next.js app in `frontend/`, including API routes, MongoDB access, and authentication.

## Requirements

- Node.js 18 or newer
- npm
- MongoDB Atlas connection string or local MongoDB

## 1. Install the frontend

Open a terminal in the frontend folder:

```bash
cd frontend
npm install
```

Create `frontend/.env` from `frontend/.env.example` and set:

```env
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-secret
```

## 2. Start the frontend

From `frontend/`:

```bash
npm run dev
```

The app runs at `http://127.0.0.1:3000`.

## 3. Optional backend folder

The `backend/` folder still exists, but it is not required for the current single-app Next.js flow.

Use it only if you specifically want to run the separate Express backend locally.

## 4. Verify everything

Check:

- Frontend: `http://127.0.0.1:3000`
- Categories API: `http://127.0.0.1:3000/api/categories`
- Restaurants API: `http://127.0.0.1:3000/api/restaurants?type=restaurant`
- Store count API: `http://127.0.0.1:3000/api/store-count`

## Notes

- The frontend now connects directly to MongoDB through Next.js server routes.
- `BACKEND_API_URL` is no longer needed for the main app flow.
- Keep `JWT_SECRET` private.
