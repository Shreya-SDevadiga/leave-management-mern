# Business Requirements Document – Leave Management System

## 1. Purpose
Digitise leave requests, approvals and tracking for employees and HR/admin.

## 2. Scope
In scope: authentication, apply leave, approve/reject, history, balances, admin dashboard.
Out of scope: payroll, email notifications, holiday calendar, multi-level approval.

## 3. Stakeholders
Employees (apply and view), Admin/HR (decide and monitor).

## 4. Functional Requirements
| ID | Requirement |
|---|---|
| FR1 | Employee and admin login with JWT and role-based access |
| FR2 | Employee applies leave (type, dates, reason) |
| FR3 | System counts Mon–Fri working days and blocks requests above available balance |
| FR4 | Admin approves or rejects pending requests; approval deducts balance |
| FR5 | Employees view their leave history with status |
| FR6 | System tracks balance per leave type |
| FR7 | Admin dashboard shows totals, pending, on-leave-today, per-employee balances |

## 5. Non-Functional Requirements
Passwords hashed (bcrypt), JWT expiry 7 days, CORS restricted to the frontend URL, responsive UI, HTTPS in production.

## 6. Business Rules
Annual quota: Casual 12, Sick 10, Earned 15. Pending requests are held against availability. Rejected leave does not reduce balance. Only pending leave can be decided.

## 7. Data Model
- User: name, email, password (hash), role, balance {Casual, Sick, Earned}
- Leave: user, type, from, to, days, reason, status, decidedBy, timestamps

## 8. Deployment

**Where the application is hosted**
| Layer | Platform | URL |
|---|---|---|
| Frontend (React + Vite) | Vercel | https://leave-management-mern-ntpz.vercel.app |
| Backend (Node/Express API) | Render Web Service (Free) | https://leave-management-mern-f63z.onrender.com/api |
| Database | MongoDB Atlas (M0 Free) | database `leavedb` |
| Source code | GitHub | https://github.com/Shreya-SDevadiga/leave-management-mern |

**Deployment approach**
Three-tier split deployment. The browser loads the React app from Vercel. The app calls the Render API over HTTPS using `VITE_API_URL`. The API connects to MongoDB Atlas using `MONGO_URI`. Vercel and Render both deploy automatically from the GitHub `main` branch (continuous deployment).

**Required services**
GitHub account, MongoDB Atlas account, Render account, Vercel account.

**Environment variables**
- Render (backend): `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL` (the Vercel URL, no trailing slash), `ADMIN_EMAIL`, `ADMIN_PASSWORD`
- Vercel (frontend): `VITE_API_URL` (the Render URL ending in `/api`)

**Steps to deploy**
1. Push the repository to GitHub, with `server/` and `client/` folders at the root. `.env` files are excluded by `.gitignore`.
2. MongoDB Atlas: create a free cluster, create a database user with read/write access, add `0.0.0.0/0` under Network Access, and copy the connection string with `/leavedb` as the database name.
3. Seed the admin and demo employee once: put the Atlas URI in `server/.env` locally and run `npm run seed`.
4. Render: New → Web Service → select the repo. Root Directory `server`, Build Command `npm install`, Start Command `npm start`, Instance Type Free. Add the backend environment variables above (use a temporary `CLIENT_URL`). Deploy and verify `https://<render-url>/api/health` returns `{"ok":true}`.
5. Vercel: Add New Project → select the repo → Import single project for `client`. Root Directory `client`, Framework Vite. Add `VITE_API_URL=https://<render-url>/api`. Deploy.
6. Render: set `CLIENT_URL` to the Vercel URL (no trailing slash), save, and let Render redeploy.
7. Open the Vercel URL and verify admin and employee login.

**Steps to update the application**
1. Make changes locally and test with `npm run dev`.
2. Commit and push to `main`:
   `git add . && git commit -m "message" && git push`
3. Render and Vercel redeploy automatically (about 1 to 3 minutes).
4. For environment variable changes, edit them in the platform dashboard. Render redeploys after saving. Vercel needs a manual redeploy for changes to `VITE_API_URL`.

**Notes**
- Render's free tier sleeps after inactivity, so the first request can take 30 to 60 seconds.
- Demo credentials: admin@company.com / Admin@123 and asha@company.com / Emp@123.

## 9. Assumptions & Risks
Single-level approval. Free-tier cold starts. Quotas are fixed in code and can later move to a settings collection.