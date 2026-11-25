# Business Requirements Document – Leave Management System

## 1. Purpose
Replace manual leave requests with a simple online system for employees and admins.

## 2. Scope
Included: login, apply leave, approve or reject, history, balance, admin dashboard.
Not included: payroll, email alerts, holiday calendar.

## 3. Users
- **Employee:** applies for leave and views history and balance.
- **Admin:** approves or rejects leave and views the dashboard.

## 4. Requirements
1. Employees and admins can log in securely.
2. Employees can apply for leave with type, dates and reason.
3. The system counts only working days (Monday to Friday).
4. A request is blocked if the balance is not enough.
5. Admins can approve or reject pending requests.
6. Approved leave reduces the balance. Rejected leave does not.
7. Employees can see their leave history.
8. Admins can see a dashboard with totals, pending requests, who is on leave today, and balances.

## 5. Rules
Yearly leave: Casual 12, Sick 10, Earned 15.
Only pending requests can be approved or rejected.

## 6. Deployment

**Where it is hosted**

| Part | Platform | Link |
|---|---|---|
| Frontend | Vercel | https://leave-management-mern-ntpz.vercel.app |
| Backend | Render (free plan) | https://leave-management-mern-f63z.onrender.com/api |
| Database | MongoDB Atlas (free) | database name: leavedb |
| Code | GitHub | https://github.com/Shreya-SDevadiga/leave-management-mern |

**Approach**
The website (Vercel) talks to the API (Render), and the API stores data in MongoDB Atlas.
Vercel and Render deploy automatically whenever code is pushed to the `main` branch on GitHub.

**Required services**
GitHub, MongoDB Atlas, Render and Vercel accounts (all free).

**Steps to deploy**
1. Push the code to GitHub.
2. In MongoDB Atlas, create a free cluster and a database user. Under Network Access, allow `0.0.0.0/0`. Copy the connection string and add `/leavedb` at the end.
3. Put the Atlas string in `server/.env` and run `npm run seed` once. This creates the admin and demo employee.
4. In Render, create a Web Service from the repo. Set Root Directory `server`, Build Command `npm install`, Start Command `npm start`, and the Free plan. Add these variables: MONGO_URI, JWT_SECRET, CLIENT_URL, ADMIN_EMAIL, ADMIN_PASSWORD.
5. In Vercel, import the repo. Set Root Directory `client` and Framework Vite. Add the variable `VITE_API_URL` with the Render URL followed by `/api`.
6. In Render, set CLIENT_URL to the Vercel URL (no trailing slash) and save.
7. Open the Vercel link and log in to check that it works.

**Steps to update**
1. Change the code and test it locally.
2. Run `git add .`, `git commit -m "message"` and `git push`.
3. Vercel and Render redeploy automatically in 1 to 3 minutes.
4. If you change an environment variable, edit it in the Render or Vercel dashboard. Vercel needs a manual redeploy after a change.

**Note:** On the free plan, the backend sleeps when idle. The first request can take up to a minute.

## 7. Risks
Free hosting can be slow after idle time. Leave quotas are fixed in the code.