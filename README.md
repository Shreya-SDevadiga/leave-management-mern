# Leave Management System (MERN)

**Live frontend (Vercel):** https://leave-management-mern-ntpz.vercel.app
**Live backend API (Render):** https://leave-management-mern-f63z.onrender.com/api
**Repo:** https://github.com/Shreya-SDevadiga/leave-management-mern

> The backend runs on Render's free tier, so the first request after inactivity can take up to a minute.

## Overview
Employees apply for leave and track balances and history. Admins approve or reject
requests and monitor everything from a dashboard.

## Features
- Employee login (+ registration) and Admin login (JWT, role-based access)
- Apply leave with working-day calculation and balance validation
- Approve / reject leave (admin); balance deducted on approval
- Leave history (employee: own, admin: all)
- Leave balance tracking (Casual 12, Sick 10, Earned 15)
- Admin dashboard: employees, pending/approved/rejected, on leave today, balances

## Architecture
```
React (Vite) on Vercel  --HTTPS/JSON + JWT-->  Express API on Render  --Mongoose-->  MongoDB Atlas
```

```
leave-management-mern/
├── server/   (Express API: models, routes, middleware, seed.js)
└── client/   (React + Vite SPA: pages, api helper, styles)
```

## Tech Stack
MongoDB Atlas, Express.js, React 18 (Vite), Node.js, Mongoose, JWT, bcryptjs.
Hosting: Vercel (frontend), Render (backend), MongoDB Atlas (database).

## Local Setup
Prerequisites: Node.js 18+ and a MongoDB database (local MongoDB or Atlas).
```bash
git clone https://github.com/Shreya-SDevadiga/leave-management-mern.git
cd leave-management-mern

# Backend
cd server
npm install
cp .env.example .env        # Windows: copy .env.example .env, then fill values
npm run seed                # creates admin + demo employee
npm run dev                 # http://localhost:5000

# Frontend (new terminal)
cd client
npm install
cp .env.example .env        # Windows: copy .env.example .env
npm run dev                 # http://localhost:5173
```

## Environment Variables
**server/.env**

| Name | Description | Example |
|---|---|---|
| PORT | API port (default 5000) | 5000 |
| MONGO_URI | MongoDB connection string including database name | mongodb+srv://user:pass@cluster.mongodb.net/leavedb |
| JWT_SECRET | Secret for signing tokens | a-long-random-string |
| CLIENT_URL | Allowed frontend origin(s), comma-separated, no trailing slash | http://localhost:5173 |
| ADMIN_EMAIL / ADMIN_PASSWORD | Used by `npm run seed` to create the admin | admin@company.com / Admin@123 |

**client/.env**

| Name | Description | Example |
|---|---|---|
| VITE_API_URL | Backend base URL including /api | http://localhost:5000/api |

## Demo Credentials
- Admin: admin@company.com / Admin@123
- Employee: asha@company.com / Emp@123
- New employees can register from the login page.

## API Details
Base: `/api`. Protected routes need `Authorization: Bearer <token>`.

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | /health | Public | Health check |
| POST | /auth/register | Public | Register employee `{name,email,password}` |
| POST | /auth/login | Public | Login `{email,password}` → `{token,user}` |
| GET | /auth/me | Auth | Current user with balances |
| POST | /leaves | Employee | Apply `{type,from,to,reason}` |
| GET | /leaves/mine | Employee | My leave history |
| GET | /leaves?status= | Admin | All leaves |
| PATCH | /leaves/:id/status | Admin | `{status: "Approved" or "Rejected"}` |
| GET | /leaves/stats/summary | Admin | Dashboard stats and balances |

Errors return JSON `{ "message": "..." }` with status 400, 401, 403 or 404.

## Deployment
Full details are in the Deployment section of `BRD.md`. Summary:
1. **MongoDB Atlas:** create a free cluster, a database user, allow network access `0.0.0.0/0`, and copy the connection string with `/leavedb` added.
2. **Seed the database once:** put the Atlas URI in `server/.env` locally and run `npm run seed`.
3. **Render (backend):** New Web Service → select the repo → Root Directory `server`, Build `npm install`, Start `npm start`, Free instance. Add env vars `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`.
4. **Vercel (frontend):** Import the repo as a single project → Root Directory `client`, Framework Vite, env var `VITE_API_URL=https://leave-management-mern-f63z.onrender.com/api`.
5. Set Render `CLIENT_URL` to the Vercel URL (no trailing slash) and let it redeploy.
6. **Updates:** `git push` to `main`; Render and Vercel redeploy automatically. After changing an env var on Vercel, redeploy the frontend.