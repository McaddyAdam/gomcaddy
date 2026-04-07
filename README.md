# Gomcaddy

This repository is now split into two apps:

- [frontend](C:/Users/adama/mcaddytechsolutions/mcaddytechsolutions/gomcaddy/frontend): Next.js frontend
- [backend](C:/Users/adama/mcaddytechsolutions/mcaddytechsolutions/gomcaddy/backend): Express + MongoDB backend

## Structure

- `frontend/` contains the full Next.js application, frontend env files, and frontend package manifest
- `backend/` contains the API, MongoDB models, backend env sample, and seed script
- `INSTALLATION.md` contains the step-by-step setup guide for both apps

## Run locations

- From the repo root, `npm run dev`, `npm run build`, and `npm start` now forward to the Next.js app in `frontend/`
- Frontend-only commands can still be run inside `frontend/`
- Backend-only commands can still be run inside `backend/`

## Root scripts

- `npm run dev`: start the frontend in development mode
- `npm run build`: build the frontend for production
- `npm start`: build the frontend, then start the production server
- `npm run backend:dev`: run the optional Express backend locally
- `npm run backend:seed`: seed the optional backend database

Use [INSTALLATION.md](/C:/Users/adama/mcaddytechsolutions/mcaddytechsolutions/gomcaddy/INSTALLATION.md) for the full install and startup steps.
