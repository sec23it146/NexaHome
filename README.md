# Smart Home Automation System

A complete MERN smart home automation project with JWT authentication, role-based access, device control, automation rules, real-time notifications, activity logs, responsive dashboards, dark/light mode, charts, and CSV export.

## Tech Stack

- Frontend: React, Vite, React Router, Axios, Context API, Socket.IO client
- Backend: Node.js, Express, MongoDB, Mongoose, JWT, bcrypt
- Roles: Admin, Homeowner, Guest

## Run Locally

1. Install MongoDB and start it locally, or use a MongoDB Atlas connection string.
2. Copy the server environment file:

```bash
cd server
cp .env.example .env
```

3. Install dependencies from the project root:

```bash
npm install
npm run install:all
```

4. Seed demo data:

```bash
npm run seed
```

5. Start both apps:

```bash
npm run dev
```

Frontend: http://localhost:5173

Backend: http://localhost:5000/api

## Demo Accounts

| Role | Email | Password |
| --- | --- | --- |
| Admin | admin@smarthome.com | Admin123 |
| Homeowner | owner@smarthome.com | Owner123 |
| Guest | guest@smarthome.com | Guest123 |

## Main API Routes

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET/POST /api/users`
- `PUT/DELETE /api/users/:id`
- `GET/POST /api/devices`
- `PUT/DELETE /api/devices/:id`
- `PATCH /api/devices/:id/toggle`
- `GET/POST /api/automations`
- `PUT/DELETE /api/automations/:id`
- `GET /api/notifications`
- `PATCH /api/notifications/:id/read`
- `GET /api/activity-logs`
- `GET /api/activity-logs/export`
- `GET /api/dashboard/admin`
- `GET /api/dashboard/homeowner`

## Folder Structure

```text
client/src/
  assets/
  components/
  context/
  layouts/
  pages/
  routes/
  services/

server/src/
  config/
  controllers/
  middleware/
  models/
  routes/
  services/
```
