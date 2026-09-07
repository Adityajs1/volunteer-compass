🧭 Volunteer Compass
A modern, full-stack platform empowering volunteers to connect with impactful community events based on skills, availability, and location.

📖 Table of Contents
Overview
Key Features
Tech Stack
Project Architecture
Getting Started
Prerequisites
Environment Configuration
Installation & Database Setup
Running Locally
NPM Scripts Reference
Database Models
Deployment
License
🌟 Overview
Volunteer Compass simplifies community engagement by intelligently matching volunteers with non-profit events and community service opportunities. Built with a modern TypeScript backend and React frontend, it features automated skill-based matching, real-time notifications, interactive map-based event discovery, attendance tracking, and downloadable volunteer hour certificates.

✨ Key Features
👤 Volunteer Experience
Smart Skill & Location Matching: Get event recommendations computed using user skills, geographical proximity, and availability schedules.
Interactive Map Discovery: Discover nearby opportunities with Leaflet map integrations.
RSVP & Waitlist Management: One-click event registration, status tracking, and notes for organizers.
Volunteer Hours & PDF Export: Track confirmed volunteer hours and export official PDF logs/certificates powered by jspdf.
Real-Time Notifications: Instant updates on RSVP status changes, match suggestions, and event reminders via Socket.IO.
🏛️ Organizer Suite
Event Creation & Scheduling: Publish one-time or recurring events (RFC 5545 RRULE standard).
Skill Requirements & Capacity Control: Specify required volunteer skills, minimum/maximum participant bounds, and virtual/physical locations.
Volunteer Check-Ins: Mark volunteer attendance and record verified hours worked.
🛠️ Tech Stack
Frontend (/client)
Core: React 18, Vite
Networking & Real-Time: Axios, Socket.IO Client
Maps: Leaflet, React-Leaflet
Export & Utilities: jsPDF
Styling: Modern Modular Vanilla CSS
Backend (/server)
Runtime & Framework: Node.js, Express, TypeScript
Database & ORM: PostgreSQL, Prisma ORM
Authentication: JWT & Firebase Admin SDK integration
Queues & Caching: Redis, Bull (background jobs)
Real-Time Engine: Socket.IO
Security & Logging: Helmet, CORS, Express Rate Limit, Winston, Morgan
Email Services: Nodemailer (SMTP integration)
📁 Project Architecture
volunteer-compass/
├── client/                     # React Frontend (Vite)
│   ├── src/
│   │   ├── api/                # Axios API client & endpoints
│   │   ├── components/         # Reusable UI components & layouts
│   │   ├── context/            # Auth & Application State context
│   │   ├── pages/              # Dashboard, Home, Events, Hours, Profile, Auth
│   │   ├── theme.js            # Design tokens & color palette
│   │   └── App.jsx             # Main Router & Provider wrapper
│   └── package.json
├── server/                     # Express + TypeScript Backend
│   ├── prisma/
│   │   ├── schema.prisma       # Database models & relationships
│   │   └── seed.ts             # Database seeder script
│   ├── src/
│   │   ├── config/             # Environment, Database, Redis & Firebase config
│   │   ├── controllers/        # Request handlers (Auth, Events, Matching, etc.)
│   │   ├── jobs/               # Background queues & Bull workers
│   │   ├── middleware/         # Auth verification, rate limiting, error handling
│   │   ├── routes/             # RESTful API route definitions
│   │   ├── services/           # Business logic & email services
│   │   ├── socket.ts           # Socket.IO event handlers
│   │   ├── app.ts              # Express application setup
│   │   └── index.ts            # HTTP server entry point
│   └── package.json
├── .env.example                # Sample environment configuration template
├── render.yaml                 # Infrastructure-as-code config for Render deployment
├── package.json                # Root monorepo workspace configuration
└── README.md                   # Project documentation
🚀 Getting Started
Prerequisites
Ensure you have the following installed on your local machine:

Node.js: v18.x or higher
npm: v9.x or higher
PostgreSQL: Local instance or cloud database (e.g. Neon, Supabase, Render Postgres)
Redis (Optional for local dev, required for background queues): v6.x or higher
Environment Configuration
Copy .env.example to create a .env file in the root directory:

cp .env.example .env
Also create a .env inside the server/ folder or set the variables as listed below:

# Server
NODE_ENV=development
PORT=5000

# Database
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"

# Authentication
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Firebase Admin SDK (Optional)
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_CLIENT_EMAIL=your-firebase-client-email@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."

# Email (Nodemailer)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# CORS Settings
CLIENT_URL=http://localhost:5173
Installation & Database Setup
Install dependencies for all workspaces:

npm install
(This automatically triggers postinstall to install dependencies in both server/ and client/ directories).

Run Prisma Migrations & Generate Client:

npm run db:migrate --prefix server
npm run db:generate --prefix server
(Optional) Seed initial data:

npm run db:seed --prefix server
Running Locally
Start both backend server and frontend client concurrently with a single command from the project root:

npm run dev
Frontend Client: Runs at http://localhost:5173
Backend API Server: Runs at http://localhost:5000
📜 NPM Scripts Reference
Root Directory Commands
Command	Description
npm run dev	Runs both client (:5173) and server (:5000) concurrently.
npm run dev:server	Starts only the Express development server with live reload.
npm run dev:client	Starts only the Vite frontend dev server.
npm run build	Builds production artifacts for both client and server.
Server Directory (/server) Commands
Command	Description
npm run dev	Starts server using ts-node-dev.
npm run build	Compiles TypeScript source to JavaScript (dist/).
npm run start	Executes compiled production server (dist/index.js).
npm run db:migrate	Runs Prisma development migrations.
npm run db:generate	Generates Prisma client types.
npm run db:seed	Seeds database with initial sample data.
npm run db:studio	Opens Prisma Studio GUI in browser.
🗄️ Database Models
Key entities in the Prisma Schema (server/prisma/schema.prisma):

User: Volunteers & Organizers (roles: VOLUNTEER, ORGANIZER, ADMIN). Stores profile, location, skills, and availability.
Event: Volunteer events featuring location coords, schedule, capacity limits, skill requirements, and recurrence (rrule).
Skill: Skill taxonomy attached to volunteers and events for intelligent matching.
Rsvp: Volunteer registrations (PENDING, CONFIRMED, WAITLISTED, CANCELLED), check-in status, and logged hours.
Match: Algorithm-computed match records with compatibility scores (0.0 – 1.0) and match reasoning tags.
Notification: Alerts dispatched for RSVP updates, match suggestions, and event reminders.
☁️ Deployment
Render (Backend API)
The repository includes a ready-to-use render.yaml blueprint for deploying the server service:

Build Command: npm install --include=dev && npx prisma generate && npx prisma migrate deploy && npm run build
Start Command: node dist/index.js
Vercel / Netlify (Frontend Client)
Deploy the /client directory:

Build Command: npm run build
Output Directory: dist
Environment Variables: Configure VITE_API_BASE_URL pointing to your backend production URL.
📄 License
Distributed under the MIT License. See LICENSE for more information.
