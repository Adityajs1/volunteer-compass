#Volunteer Compass
# Connecting People. Empowering Communities. Creating Impact.

Volunteer Compass is a modern, full-stack volunteering platform that connects individuals with meaningful community service opportunities based on their skills, availability, and geographical location.

The platform simplifies the volunteering experience by helping people discover relevant events, register for opportunities, track their contributions, and stay connected with organizers through real-time notifications.

With intelligent volunteer matching, interactive maps, attendance tracking, and downloadable volunteer-hour certificates, Volunteer Compass makes community engagement more accessible, organized, and impactful.

## 📖 Table of Contents

* [Overview](#-overview)
* [Key Features](#-key-features)
* [How It Works](#-how-it-works)
* [Tech Stack](#️-tech-stack)
* [Project Architecture](#-project-architecture)
* [Getting Started](#-getting-started)
* [Environment Configuration](#-environment-configuration)
* [Installation & Database Setup](#-installation--database-setup)
* [Running Locally](#-running-locally)
* [NPM Scripts](#-npm-scripts)
* [Database Models](#️-database-models)
* [Deployment](#️-deployment)
* [Contributing](#-contributing)
* [License](#-license)

# Overview
Finding the right volunteering opportunity can be challenging. People often struggle to discover events that match their interests, skills, schedules, and location, while organizers face difficulties managing registrations, attendance, and volunteer coordination.

Volunteer Compass bridges this gap.
It provides a centralized platform where volunteers can discover community initiatives and organizers can efficiently manage their events.

The platform uses skill-based compatibility, geographical proximity, and availability to recommend relevant volunteering opportunities. Volunteers can explore events through an interactive map, register with a single click, receive real-time updates, and maintain a record of their contributions.

Organizers can create and schedule events, define skill requirements, manage participant capacity, coordinate registrations, and verify volunteer attendance.

Whether someone wants to contribute a few hours to a local initiative or an organization needs help coordinating a community event, Volunteer Compass brings the entire experience together in one place.

## Key Features

#Volunteer Experience

* Smart Volunteer Matching**

* Discover volunteering opportunities based on skills, geographical proximity, and availability.
* Receive personalized event recommendations.
* View compatibility scores and reasoning behind suggested matches.

* Interactive Map Discovery**

* Explore nearby volunteering opportunities through an interactive Leaflet map.
* Discover events based on their geographical locations.
* Access event details directly from the map.

* RSVP & Waitlist Management**

* Register for events with a simple RSVP workflow.
* Track registration statuses, including pending, confirmed, waitlisted, and cancelled.
* Add notes for event organizers.
* Stay informed about registration changes.

* Volunteer Hours Tracking**

* Maintain a record of volunteering hours.
* Track verified attendance and contributions.
* Export volunteer-hour records and certificates as downloadable PDFs using jsPDF.

* Real-Time Notifications**

* Receive instant updates about RSVP status changes.
* Get notified about relevant volunteering opportunities.
* Receive event reminders and important updates through Socket.IO.

# Organizer Suite

* Event Creation & Scheduling**

* Create and publish community volunteering events.
* Define event dates, schedules, locations, and descriptions.
* Support recurring events using the RFC 5545 RRULE standard.

* Skill Requirements & Capacity Management**

* Specify the skills required for an event.
* Set minimum and maximum participant limits.
* Manage volunteer registrations and waitlists.
* Support both physical and virtual event locations.

* Volunteer Attendance & Check-ins**

* Track registered volunteers.
* Mark volunteer attendance.
* Record verified hours worked.
* Maintain accurate participation records.

* Volunteer Coordination**

* Keep volunteers informed through real-time updates.
* Manage registration statuses and event participation.
* Simplify communication between organizers and volunteers.

---

## How It Works

1. Create an account:** Volunteers and organizers sign up and complete their profiles.
2. Discover opportunities: Volunteers explore available events through personalized recommendations or the interactive map.
3. Find relevant matches: The matching system considers skills, location, and availability to identify suitable opportunities.
4. Register for an event: Volunteers submit an RSVP and track their registration status.
5. Coordinate participation: Organizers manage registrations, participant capacity, and event details.
6. Track contributions: Organizers verify attendance and record completed volunteer hours.
7. Celebrate impact: Volunteers review their contributions and download their volunteer-hour records or certificates.

#Tech Stack

### Frontend — `/client`

| Technology              | Purpose                               |
| ----------------------- | ------------------------------------- |
| React 18                | Component-based user interface        |
| Vite                    | Development server and build tooling  |
| Axios                   | HTTP requests and API communication   |
| Socket.IO Client        | Real-time notifications               |
| Leaflet & React-Leaflet | Interactive map-based event discovery |
| jsPDF                   | Downloadable volunteer-hour PDFs      |
| Vanilla CSS             | Modular styling and responsive UI     |

### Backend — `/server`

| Technology         | Purpose                                            |
| ------------------ | -------------------------------------------------- |
| Node.js            | JavaScript runtime                                 |
| Express.js         | REST API and server-side routing                   |
| TypeScript         | Type-safe backend development                      |
| PostgreSQL         | Relational database                                |
| Prisma ORM         | Database access, schema management, and migrations |
| JWT                | Authentication and authorization                   |
| Firebase Admin SDK | Firebase integration                               |
| Redis              | Caching and background-job infrastructure          |
| Bull               | Background job queues                              |
| Socket.IO          | Real-time communication                            |
| Nodemailer         | Email notifications via SMTP                       |
| Helmet             | HTTP security headers                              |
| Express Rate Limit | Request rate limiting                              |
| Winston & Morgan   | Application and HTTP logging                       |
| CORS               | Cross-origin request configuration                 |

#Project Architecture

Volunteer Compass follows a full-stack architecture with a React frontend, an Express and TypeScript backend, and a PostgreSQL database.

The frontend communicates with the backend through REST APIs, while Socket.IO enables real-time communication. Prisma provides structured database access, and Redis with Bull supports background processing.

```text
volunteer-compass/
│
├── client/                      # React + Vite frontend
│   ├── src/
│   │   ├── api/                 # Axios API client & endpoints
│   │   ├── components/           # Reusable UI components
│   │   ├── context/              # Authentication & app state
│   │   ├── pages/                # Application pages
│   │   │   ├── Dashboard
│   │   │   ├── Home
│   │   │   ├── Events
│   │   │   ├── Hours
│   │   │   ├── Profile
│   │   │   └── Auth
│   │   ├── theme.js              # Design tokens & colors
│   │   └── App.jsx               # Router & providers
│   │
│   └── package.json
│
├── server/                      # Express + TypeScript backend
│   ├── prisma/
│   │   ├── schema.prisma         # Database schema
│   │   └── seed.ts               # Database seeder
│   │
│   ├── src/
│   │   ├── config/               # Environment, DB, Redis, Firebase
│   │   ├── controllers/          # Request handlers
│   │   ├── jobs/                 # Background queues & workers
│   │   ├── middleware/           # Auth, rate limiting, errors
│   │   ├── routes/               # REST API routes
│   │   ├── services/             # Business logic & email services
│   │   ├── socket.ts             # Socket.IO event handlers
│   │   ├── app.ts                # Express application setup
│   │   └── index.ts              # HTTP server entry point
│   │
│   └── package.json
│
├── .env.example                  # Environment template
├── render.yaml                   # Render deployment configuration
├── package.json                 # Root workspace configuration
└── README.md

# Getting Started

Follow these instructions to set up and run Volunteer Compass on your local machine.

### Prerequisites

Make sure you have the following installed:

* **Node.js:** v18.x or higher
* **npm:** v9.x or higher
* **PostgreSQL:** A local installation or cloud database
* **Redis:** v6.x or higher (optional for basic local development, required for background queues)

You can use cloud database providers such as Neon, Supabase, or Render PostgreSQL.

---

# Environment Configuration

### 1. Create the environment file

From the project root, copy the example configuration:

```bash
cp .env.example .env
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

### 2. Configure server environment variables

Create or configure the `.env` file inside the `server/` directory with the following variables:

```env
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
FIREBASE_CLIENT_EMAIL=your-firebase-client-email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."

# Email - Nodemailer
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# CORS
CLIENT_URL=http://localhost:5173
```

**Important:**

* Replace the database credentials with your actual PostgreSQL connection string.
* Use a strong, unique JWT secret.
* For Gmail SMTP, use an appropriate Google App Password rather than your regular account password.
* Configure Firebase credentials only if you are using Firebase Admin functionality.
* Never commit `.env` files, private keys, or other secrets to version control.

---

## 📦 Installation & Database Setup

### 1. Clone the repository

```bash
git clone https://github.com/Adityajs1/volunteer-compass.git

cd volunteer-compass
```

### 2. Install dependencies

Install the root workspace dependencies:

```bash
npm install
```

The root configuration automatically installs dependencies for the client and server through its post-install setup.
#3. Configure PostgreSQL

Make sure your PostgreSQL database is running and your `DATABASE_URL` points to the correct database.

#4. Generate the Prisma Client

```bash
npm run db:generate --prefix server
```

#5. Run database migrations
```bash
npm run db:migrate --prefix server
```

#6. Seed the database (Optional)
Populate the database with initial sample data:
```bash
npm run db:seed --prefix server
```

You can also open Prisma Studio to inspect and manage your database:
```bash
npm run db:studio --prefix server
```

#Running Locally

Start both the frontend and backend concurrently from the project root:
```bash
npm run dev
```

Once the application is running, access the services at:

| Service     | URL                   |
| ----------- | --------------------- |
| Frontend    | http://localhost:5173 |
| Backend API | http://localhost:5000 |

Make sure PostgreSQL is configured and any required Redis services are running before using features that depend on them.

#NPM Scripts
### Root Directory

| Command              | Description                             |
| -------------------- | --------------------------------------- |
| `npm run dev`        | Start frontend and backend concurrently |
| `npm run dev:server` | Start the backend development server    |
| `npm run dev:client` | Start the frontend development server   |
| `npm run build`      | Build the frontend and backend          |

### Server Directory

Run these commands from the project root using `--prefix server`, or navigate into the `server/` directory.

| Command               | Description                                   |
| --------------------- | --------------------------------------------- |
| `npm run dev`         | Start the development server with live reload |
| `npm run build`       | Compile TypeScript into JavaScript            |
| `npm run start`       | Start the compiled production server          |
| `npm run db:migrate`  | Run Prisma development migrations             |
| `npm run db:generate` | Generate Prisma Client                        |
| `npm run db:seed`     | Seed the database                             |
| `npm run db:studio`   | Open Prisma Studio                            |

---

#Database Models
The database is designed around the core entities required to manage volunteers, events, registrations, and community engagement.

#User
Stores volunteer and organizer information, including profile details, roles, skills, location, and availability.
Supported roles:
* `VOLUNTEER`
* `ORGANIZER`
* `ADMIN`

# Event
Represents volunteering opportunities, including descriptions, geographical coordinates, schedules, capacity limits, required skills, and recurrence rules.

# Skill
Maintains the skill taxonomy used to connect volunteer capabilities with event requirements.

# RSVP
Tracks volunteer registrations and participation details.

Supported statuses:
* `PENDING`
* `CONFIRMED`
* `WAITLISTED`
* `CANCELLED`

Also stores check-in information and logged volunteer hours.

# Match
Stores algorithmically generated volunteer-event matches, including compatibility scores between `0.0` and `1.0` and associated reasoning tags.

#Notification
Stores notifications related to RSVP updates, suggested matches, and event reminders.

---

## ☁️ Deployment

Volunteer Compass supports a separate frontend and backend deployment workflow.
### Backend — Render
The repository includes a `render.yaml` configuration for deploying the backend service.

**Build command:**

```bash
npm install --include=dev &&
npx prisma generate &&
npx prisma migrate deploy &&
npm run build
```

**Start command:**

```bash
node dist/index.js
```

Configure the required environment variables in the Render dashboard, including the production PostgreSQL connection string, JWT secret, and client URL.

### Frontend — Vercel / Netlify

Deploy the `client/` directory as the frontend application.

| Setting          | Value           |
| ---------------- | --------------- |
| Root directory   | `client`        |
| Build command    | `npm run build` |
| Output directory | `dist`          |

Configure the following environment variable:

```env
VITE_API_BASE_URL=https://your-backend-api-url
```

Replace the example URL with your deployed backend API URL.

---

# Contributing

Contributions, suggestions, and improvements are welcome!

If you'd like to contribute:

1. Fork the repository.
2. Create a new feature branch.
3. Make your changes.
4. Test your implementation.
5. Submit a pull request with a clear description of your changes.
For major changes, consider opening an issue first to discuss the proposed improvements.

---

# License
This project is distributed under the **MIT License**.
See the [LICENSE](LICENSE) file for more information.

---

#Built for Community Impact
Volunteer Compass brings technology and community service together to make volunteering easier to discover, organize, and track.

Find your skills.Discover opportunities.Make a difference.
[GitHub Repository](https://github.com/Adityajs1/volunteer-compass)

