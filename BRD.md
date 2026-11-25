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
Passwords hashed (bcrypt), JWT expiry 7 days, CORS restricted to frontend URL, responsive UI, HTTPS in production.

## 6. Business Rules
Annual quota: Casual 12, Sick 10, Earned 15. Pending requests are held against availability. Rejected leave does not reduce balance. Only pending leave can be decided.

## 7. Data Model
- User: name, email, password (hash), role, balance {Casual, Sick, Earned}
- Leave: user, type, from, to, days, reason, status, decidedBy, timestamps

## 8. Deployment
**Where hosted**
- Frontend: Vercel (static React build)
- Backend: Render Web Service (Node/Express)
- Database: MongoDB Atlas (free M0 cluster)

**Approach**
Three-tier split deployment. The frontend calls the API over HTTPS using `VITE_API_URL`. The API talks to Atlas using `MONGO_URI`. Continuous deployment from the GitHub `main` branch.

**Required services**
GitHub account, MongoDB Atlas account, Render account, Vercel account.

**Steps to deploy**
1. Push the repo to GitHub (`server/` and `client/` folders at the root).
2. Atlas: create cluster, database user, Network Access 0.0.0.0/0, copy the connection string.
3. Render: New → Web Service → select repo. Root Directory `server`, Build Command `npm install`, Start Command `npm start`. Add env vars `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL` (set after step 5), `ADMIN_EMAIL`, `ADMIN_PASSWORD`. Deploy and check `/api/health`.
4. Seed the admin once: `npm run seed` in the Render shell, or locally with the Atlas URI in `.env`.
5. Vercel: Add New Project → select repo. Root Directory `client`, Framework Vite, add `VITE_API_URL=https://<your-api>.onrender.com/api`. Deploy.
6. Update Render `CLIENT_URL` to the Vercel URL and redeploy. Verify login.

**Steps to update**
Commit and push to `main`. Render and Vercel redeploy automatically. For environment changes, edit the variable in the platform dashboard and redeploy.

**Notes**
Render's free tier sleeps after inactivity, so the first request can take about 30–60 seconds.

## 9. Assumptions & Risks
Single-level approval. Free-tier cold starts. Quotas are fixed in code and can later move to a settings collection.
