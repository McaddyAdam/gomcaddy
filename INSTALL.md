# GoMcaddy Delivery System Installation Guide

Welcome to the installation and setup guide for the **GoMcaddy Delivery System**. This document provides step-by-step instructions to get your development environment up and running.

---

## 🛠 Prerequisites

Ensure you have the following installed on your machine:
- **Node.js** (v18.0.0 or higher recommended)
- **npm** (comes with Node.js)
- **MongoDB** (Local instance or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) URI)

---

## 🏗 Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Configuration:**
   - Create a `.env` file in the `backend/` directory (if it doesn't already exist).
   - Use the template below for your `.env` settings:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/gomcaddy
   JWT_SECRET=your_jwt_secret_here
   ```

4. **Launch the Backend:**
   - For development (with auto-reload):
     ```bash
     npm run dev
     ```
   - For production:
     ```bash
     npm start
     ```
   The backend should now be running on [http://localhost:5000](http://localhost:5000).

---

## 🎨 Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Launch the Frontend:**
   - Dev mode with Vite:
     ```bash
     npm run dev
     ```
   The frontend will be available at [http://localhost:5173](http://localhost:5173) (or whichever port Vite assigns).

---

## 🚀 Running Everything Together

To run the full application, open two separate terminal instances:

- **Terminal 1:** `cd backend && npm run dev`
- **Terminal 2:** `cd frontend && npm run dev`

---

## ✅ Post-Installation Checks

- Ensure your MongoDB server is running.
- Verify the backend console says "Connected to MongoDB".
- Open the frontend in your browser and check if the menu/items are loading from the backend API.
