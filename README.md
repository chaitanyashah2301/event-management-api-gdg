Tech Stack

GATHER is a full-stack TypeScript project. I picked each technology for a specific reason, and the choices were also meant to work well together.

### Frontend

| Technology | Why I chose it |
|---|---|
| **Next.js (App Router)** |It deploys to Vercel with no configuration, and its `rewrites()` feature let me proxy `/api/*` to the backend, which removed the need for CORS setup. |
| **React 19** | The model suits the interactive parts of the app: live search, category filters, and a register/unregister button that changes with the user's state. |
| **TypeScript** | Event, user and registration data have clear shapes. Types catch mistakes at compile time,|
| **Tailwind CSS 4** | Utility classes keep styling next to the markup, so I could iterate on a custom visual design quickly without maintaining separate stylesheets. |

### Backend

| Technology | Why I chose it |
|---|---|
| **Node.js** | One language across the whole stack, so I could share concepts and tooling between frontend and backend. |
| **Express 5** | It made the layered structure (routes, controllers, services, middleware) explicit, which made the design easy to learn, explain and extend. |
| **Prisma 6 (ORM)** | Queries are checked by TypeScript. It also handles migrations and supports transactions, which I needed for capacity-safe registration. |
| **JWT (jsonwebtoken)** | The frontend and API are hosted on different platforms, so the server verifies each request from the token alone. |
| **bcrypt** | easy to use generator for hashed-passwords |

### Database

| Technology | Why I chose it |
|---|---|
| **PostgreSQL** | The data is relational and simple enough to implement. |
| **Neon** | Managed, serverless Postgres with a free tier and an instant setup. It has no server to maintain, and it separates dev and production databases easily through branches. |

### Hosting

| Technology | Why I chose it |
|---|---|
| **Vercel (frontend)** | Built by the Next.js team, with Git-based deploys, preview builds and a global CDN. |
| **Render (backend)** | A simple home for a long-running Node service, with environment-variable management and automatic deploys from GitHub. |

### Why this combination works

- **One language end to end.** TypeScript runs from the React components to the Express services to the Prisma schema, so the same data shapes appear everywhere.
- **Independent deployment.** The frontend and backend are separate apps with separate `package.json` files, so each can be built, deployed and scaled on its own.
- **Skills worth building.** These are widely used in industry, so the project doubles as practice with tools commonly found in real teams.

  ## Screenshots
Landing Page
<img width="1918" height="834" alt="image" src="https://github.com/user-attachments/assets/d79eafec-353c-4cc5-97af-a34c2875572c" />

Events View 
<img width="1644" height="956" alt="image" src="https://github.com/user-attachments/assets/9e56e4ba-c57f-402f-be2d-5258aaa409e8" />

Admin Dashboard (To add,edit and delete events)
<img width="1264" height="779" alt="image" src="https://github.com/user-attachments/assets/8a4ca3a1-0dda-4377-96f7-41226f71ec95" />


## 🛠️ Installation Guide (for Reviewers)


This repository contains **two separate apps**, each with its **own `package.json`**. Dependencies are installed in `server/` and `client/` independently. There is no root-level install.

### 1. System requirements

| Requirement | Version | Check with | Download |
|---|---|---|---|
| Node.js | 20.9+ (22 LTS recommended) | `node -v` | https://nodejs.org |
| npm | Comes with Node.js | `npm -v` | n/a |
| Git | Any recent version | `git --version` | https://git-scm.com |
| PostgreSQL database | Free Neon project (or any PostgreSQL) | n/a | https://neon.tech |
| Free ports | `5000` (API) and `3000` (web) | n/a | n/a |

Commands below are for **Windows PowerShell**. macOS/Linux equivalents are noted where they differ.

### 2. Dependencies

`npm install` installs everything below automatically. You do **not** need to install these by hand; the lists are for reference.

#### Backend (`server/package.json`)

| Package | Version | Purpose |
|---|---|---|
| `express` | ^5.2.1 | HTTP server and routing |
| `@prisma/client` | ^6.19.3 | Type-safe database client |
| `jsonwebtoken` | ^9.0.3 | Issue and verify JWTs |
| `bcrypt` | ^6.0.0 | Password hashing |
| `dotenv` | ^18.0.6 | Load `.env` variables |
| `cors` | ^2.8.6 | CORS middleware (installed; not currently wired in) |
| `bcryptjs` | ^3.0.3 | Installed but unused (code uses `bcrypt`) |

| Dev package | Version | Purpose |
|---|---|---|
| `typescript` | 5.9 | Compiler |
| `prisma` | ^6.19.3 | Schema, migrations, client generation |
| `tsx` | ^4.23.15 | Runs TypeScript directly in dev (`npm run dev`) |
| `nodemon` | ^3.1.14 | Dev tooling |
| `@types/node` | ^26.6.4 | Node typings |
| `@types/express` | ^5.0.6 | Express typings |
| `@types/jsonwebtoken` | ^9.0.10 | JWT typings |
| `@types/bcrypt` | ^6.0.0 | bcrypt typings |

#### Frontend (`client/package.json`)

| Package | Version | Purpose |
|---|---|---|
| `next` | 16.4.0 | Framework (App Router) |
| `react` | 19.3.0 | UI library |
| `react-dom` | 19.3.0 | React DOM renderer |

| Dev package | Version | Purpose |
|---|---|---|
| `tailwindcss` | ^4 | Styling |
| `@tailwindcss/turbopack` | ^4 | Tailwind loader for Turbopack |
| `typescript` | ^5 | Compiler |
| `eslint` | ^9 | Linting |
| `eslint-config-next` | 16.4.0 | Next.js lint rules |
| `@types/node` | ^20 | Node typings |
| `@types/react` | ^19 | React typings |
| `@types/react-dom` | ^19 | React DOM typings |

### 3. Create a free database (Neon)

1. Sign up at https://neon.tech and create a project.
2. Copy the **connection string** (it ends with `?sslmode=require`).
3. Keep it handy for `DATABASE_URL` in the next step.

### 4. Clone the repository

```powershell
git clone https://github.com/chaitanyashah2301/event-management-api-gdg.git
cd event-management-api-gdg
```

### 5. Install and start the backend

```powershell
cd server
npm install
New-Item .env -ItemType File
notepad .env
```

Paste into `.env` (use your own values) and save:

```env
DATABASE_URL="postgresql://<USER>:<PASSWORD>@<NEON_HOST>/<DATABASE>?sslmode=require"
JWT_SECRET="<ANY_LONG_RANDOM_STRING>"
PORT=5000
```

Generate a secret if you want one:

```powershell
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Create the tables and start the API:

```powershell
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

Expected output: `Server running on port 5000`. Leave this window open.

### 6. Install and start the frontend

Open a **second** PowerShell window at the repository root:

```powershell
cd client
npm install
New-Item .env.local -ItemType File
notepad .env.local
```

Paste and save:

```env
BACKEND_URL=http://localhost:5000
```

Start the app:

```powershell
npm run dev
```

Open **http://localhost:3000**.

### 7. Verify the installation

```powershell
# Should return an object with an empty "events" list on a fresh database
Invoke-RestMethod -Uri "http://localhost:5000/api/events"
```

| Check | Expected |
|---|---|
| `http://localhost:3000` | Landing page loads with the GATHER lineup (empty on a fresh database) |
| `http://localhost:5000/api/events` | JSON with `events` and `pagination` |

### 8.  Try the admin dashboard!

New accounts are always regular users. To promote one:

1. Register an account in the app.
2. In the Neon **SQL Editor**, run:
```sql
   UPDATE "User" SET role = 'ADMIN' WHERE email = 'you@example.com';
```
3. Sign out and back in, then open **http://localhost:3000/admin** to create events.



### How a request flows through the code

```text
Browser -> client/next.config.ts (rewrite) -> server/src/routes -> middlewares
        -> controllers -> services -> Prisma -> PostgreSQL (Neon)
```


## Demo Video



---










**macOS / Linux:** replace `New-Item .env -ItemType File` with `touch .env`, `notepad` with `nano` or your editor, and `Invoke-RestMethod -Uri "..."` with `curl "..."`. Everything else is identical.


