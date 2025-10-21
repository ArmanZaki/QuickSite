# QuickSite Backend

Node.js + Express + PostgreSQL (Sequelize) backend for QuickSite.

## Features
- Role-based authentication (student, owner, admin) using JWT
- OTP verification scaffold (mocked email sender)
- PostgreSQL models & migrations via Sequelize
- Clean route-controller separation
- Global error handling, CORS, and environment-based config

## Folder Structure

```
/backend
├── config/             # Sequelize CLI config
├── controllers/        # Route handlers (auth, jobs, applications, admin)
├── middlewares/        # JWT auth, role check, email validation, error handler
├── migrations/         # Sequelize migrations
├── models/             # Sequelize models and associations
├── routes/             # API routes
├── utils/              # Helpers: OTP store, email service (mock)
├── .env                # Environment variables (local)
├── .env.example        # Sample env file
├── package.json        # NPM scripts & deps
└── server.js           # Express app entry
```

## Environment
Copy `.env.example` to `.env` and fill in values.

```
cp .env.example .env
```

Important variables:
- `PORT` (default: 4000)
- `DATABASE_URL` or `DB_HOST/DB_PORT/DB_NAME/DB_USER/DB_PASS`
- `JWT_SECRET`, `JWT_EXPIRES_IN`
- `EMAIL_*` (mocked; used for future real emails)
- `OTP_TTL_SECONDS` (default: 600)

## Install & Run

From the `backend` directory:

```
npm install
```

Run migrations:

```
npx sequelize-cli db:migrate --config ./config/config.js
```

Start in dev mode:

```
npm run dev
```

Health check:

```
curl http://localhost:4000/health
```

## API Overview
- `POST /api/auth/signup-student`
- `POST /api/auth/signup-owner`
- `POST /api/auth/verify-otp`
- `POST /api/auth/login`
- `GET /api/jobs/all`
- `POST /api/jobs/create` (owner only)
- `GET /api/jobs/applied/:studentId`
- `POST /api/applications/apply/:jobId` (student only)
- `PATCH /api/applications/update/:applicationId` (owner only)
- `GET /api/admin/users` (admin only)
- `DELETE /api/admin/remove/:userId` (admin only)

## Notes
- OTP delivery is mocked via console log in `utils/emailService.js`.
- Use the provided middlewares for auth and role-based access.
- Models and migrations are set up for future features (chat, reviews, ML integration).
