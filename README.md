# Back-end (NestJS)

This folder contains the NestJS backend for the project (API server).

## Prerequisites

- Node.js (recommended LTS >= 18)
- npm (or another Node package manager)
- PostgreSQL database (local or remote) or set `DATABASE_URL`

## Install

Open a terminal and run:

```powershell
cd back-end
npm install
```

## Configuration / environment

The backend reads database configuration from environment variables. You can either set `DATABASE_URL` or provide the separate DB variables shown below.

Example `.env` values (create `back-end/.env` for local dev):

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=user_db
TYPEORM_SYNC=true
FRONTEND_URL=http://localhost:5173
```

- `DATABASE_URL` (optional): `postgres://user:pass@host:port/dbname` — if present it is preferred over individual vars.
- DB config reading is implemented in `back-end/src/config/database.config.ts`.

## Run

- Development (watch):

```powershell
npm run start:dev
```

- Production (build then run):

```powershell
npm run build
npm run start:prod
```

By default the server listens on port `3001` (see `back-end/src/main.ts`). CORS is enabled for `FRONTEND_URL` (default `http://localhost:5173`).

## Tests

```powershell
npm run test
npm run test:e2e
npm run test:cov
```

## Notes

- For local development it's convenient to set `TYPEORM_SYNC=true` (the default in this project). Turn it off in production.
- If you need to change the frontend origin allowed by CORS, set `FRONTEND_URL`.

### Run both services (from repository root)

If you prefer to start frontend and backend together, from the repository root run:

```powershell
# install root tools and subproject deps (only needed once)
npm install
npm run install:all

# start both dev servers
npm run dev
```

This uses the root `package.json` script `dev` which runs the backend in watch mode and the frontend dev server concurrently.

Make sure to copy `back-end/.env.example` to `back-end/.env` and update values before starting the backend.
