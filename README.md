# Leave Management System (MERN)

**Live frontend (Vercel):** https://<your-app>.vercel.app
**Live backend API (Render):** https://<your-api>.onrender.com/api
**Repo:** https://github.com/<your-username>/leave-management-mern

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

## Local Setup
```bash
git clone https://github.com/<your-username>/leave-management-mern.git
cd leave-management-mern

# Backend
cd server && npm install
cp .env.example .env        # fill values
npm run seed                # creates admin + demo employee
npm run dev                 # http://localhost:5000

# Frontend (new terminal)
cd client && npm install
cp .env.example .env
npm run dev                 # http://localhost:5173
```

## Environment Variables
**server/.env**

| Name | Description |
|---|---|
| PORT | API port (default 5000) |
| MONGO_URI | MongoDB Atlas connection string |
| JWT_SECRET | Secret for signing tokens |
| CLIENT_URL | Allowed frontend origin(s), comma-separated |
| ADMIN_EMAIL / ADMIN_PASSWORD | Used by `npm run seed` |

**client/.env**

| Name | Description |
|---|---|
| VITE_API_URL | Backend base URL, e.g. https://<your-api>.onrender.com/api |

## Demo Credentials (after seeding)
- Admin: admin@company.com / Admin@123
- Employee: asha@company.com / Emp@123

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

## Deployment
See the Deployment section in `BRD.md` for full steps. Summary:
1. MongoDB Atlas: create free cluster, DB user, allow network access 0.0.0.0/0, copy URI.
2. Render: New Web Service → repo → Root `server`, Build `npm install`, Start `npm start`, add env vars. Then run `npm run seed` once (Render shell, or locally with the Atlas URI).
3. Vercel: Import repo → Root `client`, Framework Vite, add `VITE_API_URL`.
4. Set Render `CLIENT_URL` to the Vercel URL and redeploy.
5. Updates: `git push` to `main`; both platforms auto-redeploy.
