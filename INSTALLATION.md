# Gomcaddy Installation Guide

This repository has two separate applications:

- `frontend/` for the Next.js client
- `backend/` for the Express API and MongoDB data layer

## Requirements

- Node.js 18 or newer
- npm
- MongoDB Community Server running locally, or a MongoDB Atlas connection string

## Folder layout

```text
gomcaddy/
  frontend/
  backend/
```

## 1. Install the frontend

Open a terminal in the frontend folder:

```bash
cd frontend
npm install
```

Create `frontend/.env` from `frontend/.env.example` and set:

```env
BACKEND_API_URL=http://127.0.0.1:5000
```

## 2. Install the backend

Open a second terminal in the backend folder:

```bash
cd backend
npm install
```

Create `backend/.env` from `backend/.env.example` and set:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/gomcaddy
NODE_ENV=development
PORT=5000
```

If you use MongoDB Atlas, replace `MONGODB_URI` with your Atlas connection string.

## 3. Start MongoDB

If MongoDB is installed locally, make sure it is running before seeding or starting the backend.

Example on Windows:

```bash
net start MongoDB
```

If you use MongoDB Atlas, skip this step.

## 4. Seed the backend database

From `backend/`:

```bash
npm run seed
```

## 5. Start the backend

From `backend/`:

```bash
npm run dev
```

The backend runs at `http://127.0.0.1:5000`.

## 6. Start the frontend

From `frontend/`:

```bash
npm run dev
```

The frontend runs at `http://127.0.0.1:3000`.

## 7. Verify everything

Check these endpoints:

- Frontend: `http://127.0.0.1:3000`
- Backend: `http://127.0.0.1:5000`
- Categories API: `http://127.0.0.1:5000/api/categories`
- Restaurants API: `http://127.0.0.1:5000/api/restaurants?type=restaurant`
- Store count API: `http://127.0.0.1:5000/api/store-count`

## Notes

- The frontend API routes inside `frontend/app/api/` proxy to the Express backend using `BACKEND_API_URL`.
- The old Supabase migration folder was removed during cleanup because the app now uses MongoDB.
- Install dependencies separately inside `frontend/` and `backend/`.
