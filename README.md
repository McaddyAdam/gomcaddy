# GoMcaddy - Nigeria Food Delivery Website

GoMcaddy is a full-stack food delivery web application inspired by Swiggy, tailored for Nigerian cuisine and restaurants.

## Tech Stack

- Frontend: React + Vite + CSS
- Backend: Node.js + Express
- Auth: JWT + bcrypt
- Database: MongoDB + Mongoose

## Project Structure

- `client/` - React frontend
- `server/` - Express backend

## Quick Start

### 1) Backend

```bash
cd server
npm install
cp .env.example .env
npm run dev
```

### 2) Frontend

```bash
cd client
npm install
npm run dev
```

Frontend runs on `http://localhost:5173` and backend on `http://localhost:5000`.

## API Endpoints

- `POST /api/register` - Register user
- `POST /api/login` - Login user
- `GET /api/restaurants` - List restaurants
- `GET /api/menu` - List menu items

## Features Implemented

- Home page with search bar
- Nigerian restaurant listings
- Menu page with food items and prices
- Add-to-cart functionality
- Login/Signup with validation
- JWT authentication backend

