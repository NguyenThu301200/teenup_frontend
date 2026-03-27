# TeenUp Frontend

Professional Frontend application built for the **TeenUp Product Builder** test.

## Tech Stack
- **Framework**: React 18 + Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS v3
- **State Management**: TanStack React Query + Axios
- **Routing**: React Router v6
- **Dates**: dayjs
- **Icons**: Heroicons

## Features
- **Dashboard**: Weekly view of class schedules and capacities.
- **Parents & Students**: Full CRUD management linking students to parents.
- **Classes**: Class schedule management with Day of Week and timings.
- **Subscriptions**: Assign subscriptions to students to track available sessions.
- **Class Registrations**: Smart registration system that handles limits, schedule conflicts, class capacities, and validations. Cancelling a registration refunds the session if cancelled >24 hours before the class starts.

## Running Locally (Dev Mode)

1. Make sure the backend is running on `http://localhost:3000`.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite dev server:
   ```bash
   npm run dev
   ```
4. Access the app at `http://localhost:5173`.

## Running with Docker (Full Stack)

This frontend contains a multi-stage Dockerfile that builds the static artifacts and serves them via an Nginx alpine container.

The `docker-compose.yml` in the `teenup_backend` directory has been updated to include this frontend.

1. Navigate to the backend directory:
   ```bash
   cd ../teenup_backend
   ```
2. Run Docker Compose to build and start Database, Backend, and Frontend:
   ```bash
   docker-compose up --build -d
   ```
3. Access the frontend app at `http://localhost:8080`.
   Nginx automatically proxies `/api` requests to the internal backend container.
