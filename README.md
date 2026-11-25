# Leave Management System (MERN)

- **Live app:** https://leave-management-mern-ntpz.vercel.app
- **Backend API:** https://leave-management-mern-f63z.onrender.com/api
- **GitHub:** https://github.com/Shreya-SDevadiga/leave-management-mern

> The backend is on a free plan, so the first load may take up to a minute.

## Overview
A web app where employees apply for leave and admins approve or reject it.
It tracks leave balance and history, and gives admins a dashboard.

## Features
- Employee login and admin login
- Apply leave
- Approve or reject leave (admin)
- Leave history
- Leave balance tracking (Casual 12, Sick 10, Earned 15)
- Admin dashboard

## Architecture
```
React (Vercel)  →  Express API (Render)  →  MongoDB Atlas
```
- `client/` – React frontend
- `server/` – Node and Express backend

## Tech Stack
MongoDB, Express, React (Vite), Node.js, JWT, Vercel, Render.

## Setup
You need Node.js and a MongoDB database.

```bash
git clone https://github.com/Shreya-SDevadiga/leave-management-mern.git
cd leave-management-mern

# Backend
cd server
npm install
copy .env.example .env     # then fill in the values
npm run seed               # creates admin and demo employee
npm run dev                # runs on http://localhost:5000

# Frontend (new terminal)
cd client
npm install
copy .env.example .env
npm run dev                # runs on http://localhost:5173
```

## Environment Variables

**server/.env**

| Name | Meaning |
|---|---|
| PORT | Server port (5000) |
| MONGO_URI | MongoDB connection string |
| JWT_SECRET | Secret text for login tokens |
| CLIENT_URL | Frontend URL (no trailing slash) |
| ADMIN_EMAIL, ADMIN_PASSWORD | Admin account created by seed |

**client/.env**

| Name | Meaning |
|---|---|
| VITE_API_URL | Backend URL ending in /api |

## Demo Login
- Admin: admin@company.com / Admin@123
- Employee: asha@company.com / Emp@123

## API Details
Base path: `/api`. Protected routes need the header `Authorization: Bearer <token>`.

| Method | Endpoint | Who | What it does |
|---|---|---|---|
| GET | /health | Anyone | Check server |
| POST | /auth/register | Anyone | Register employee |
| POST | /auth/login | Anyone | Login, returns token |
| GET | /auth/me | Logged in | Current user |
| POST | /leaves | Employee | Apply leave |
| GET | /leaves/mine | Employee | My leave history |
| GET | /leaves | Admin | All leaves |
| PATCH | /leaves/:id/status | Admin | Approve or reject |
| GET | /leaves/stats/summary | Admin | Dashboard numbers |

## Deployment
- Frontend: Vercel (root folder `client`)
- Backend: Render (root folder `server`)
- Database: MongoDB Atlas

To update: push to the `main` branch on GitHub. Vercel and Render redeploy automatically.
See `BRD.md` for the full deployment steps.