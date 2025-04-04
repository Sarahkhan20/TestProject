# futureKonnect - Network Management Dashboard

A modern network management dashboard application for managing tenants, fleets, routers, and hotspot users.

## Project Setup Instructions

Follow these steps to run the project on your local computer after downloading the zip file:

### Prerequisites

- Node.js (v16 or higher)
- npm (usually comes with Node.js)
- PostgreSQL database

### Step 1: Extract the zip file

Extract the downloaded zip file to a directory of your choice.

### Step 2: Install dependencies

Open a terminal or command prompt, navigate to the project directory, and run:

```bash
npm install
```

### Step 3: Set up the database

1. Create a PostgreSQL database for the project
2. Set up the following environment variables with your database connection details:

Create a .env file in the root directory with the following:

```
DATABASE_URL=postgresql://username:password@localhost:5432/futureKonnect
PGHOST=localhost
PGPORT=5432
PGUSER=your_username
PGPASSWORD=your_password
PGDATABASE=futureKonnect
SESSION_SECRET=your_session_secret
```

Replace the values with your actual PostgreSQL connection details.

### Step 4: Initialize the database schema

Run the following command to create the database tables:

```bash
npm run db:push
```

### Step 5: Start the application

Run the following command to start the application:

```bash
npm run dev
```

The application should now be running on http://localhost:5000

## Default Admin Login

- Email: admin@futureKonnect.com
- Password: password123

## Technologies Used

- Frontend: React, Vite, Tailwind CSS, shadcn/ui
- Backend: Express.js, Drizzle ORM
- Database: PostgreSQL
- Authentication: Passport.js with session-based auth

## Features

- User authentication (login, signup, forgot password)
- Dashboard with network statistics
- Tenant management
- Router monitoring
- Hotspot user management
- Audit trail for system events
- Responsive design for desktop and mobile

## Project Structure

- /client - Frontend React application
- /server - Backend Express.js API
- /shared - Shared types and schemas