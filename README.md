# FDP Management System (MERN)

Production-ready Faculty Development Program (FDP) Management System for colleges/universities with role-based workflows, attendance, analytics, certificate generation, file management, and email notifications.

## Features

- JWT Auth (Signup/Login), RBAC (Super Admin / Faculty / Participant)
- FDP creation/management with banner & brochure upload
- Participant registration with auto/manual approval
- Attendance marking and Excel export
- Certificate generation with unique ID + QR and downloadable PDF
- Dashboard analytics with Recharts
- Email notifications for registration updates and certificates

## Tech Stack

- **Frontend:** React (Vite), TypeScript, Tailwind CSS, Shadcn-style UI components, Recharts, React Hook Form + Zod
- **Backend:** Node.js, Express, MongoDB, Mongoose, JWT, Multer, Nodemailer, PDFKit

## Project Structure

- `backend/` - REST APIs, business logic, database models
- `frontend/` - React app with role-specific dashboards and module pages

## Backend Setup

```bash
cd backend
cp .env.example .env
npm install
npm run seed:admin
npm run dev
```

Backend runs on `http://localhost:5000`.

### Important Environment Variables

- `MONGO_URI`
- `JWT_SECRET`
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `EMAIL_FROM`
- `AUTO_APPROVE_REGISTRATIONS=true|false`

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`.

Set API URL if needed:

```bash
# frontend/.env
VITE_API_URL=http://localhost:5000/api
```

## Sample Admin Login

After running `npm run seed:admin` in backend:

- **Email:** `admin@fdp.local`
- **Password:** `Admin@123`

## API Overview

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/faculty`
- `GET/PATCH /api/auth/me`
- `GET /api/fdps/public/list`
- `POST /api/fdps` / `GET /api/fdps` / `GET /api/fdps/:id` / `PATCH /api/fdps/:id`
- `POST /api/fdps/:id/register`
- `GET /api/fdps/my-registrations`
- `GET /api/fdps/:id/registrations`
- `PATCH /api/fdps/registrations/:registrationId`
- `POST /api/attendance`
- `GET /api/attendance/:fdpId`
- `GET /api/attendance/:fdpId/export/excel`
- `POST /api/certificates/generate`
- `GET /api/certificates/mine`
- `GET /api/certificates/:id/download`
- `GET /api/analytics/admin`
- `GET /api/analytics/faculty`
- `GET /api/analytics/participant`

## Notes

- Uploaded files are stored in `backend/uploads/`.
- Certificates are generated under `backend/uploads/certificates/`.
- Configure SMTP for real email delivery; otherwise, API skips send with warning.
