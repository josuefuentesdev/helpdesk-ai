# Helpdesk AI

A modern, full-stack automated helpdesk system built with the [T3 Stack](https://create.t3.gg/) (Next.js, TypeScript, tRPC, Prisma, Tailwind CSS, NextAuth, and more).

## Overview
Helpdesk AI is designed to streamline IT and business support operations, providing asset management, ticketing, team collaboration, and analytics in a single web application.

## Features
- User authentication and role management
- Asset management (hardware, software, SaaS, etc.)
- Ticketing system with priorities, statuses, comments, and notes
- Team and department organization
- Dashboard with statistics and analytics
- Internationalization (English, Spanish)
- Responsive, modern UI (shadcn/ui, Tailwind CSS)
- tRPC API for type-safe backend/frontend communication

## Tech Stack
- [Next.js](https://nextjs.org/) (App Router)
- [TypeScript](https://www.typescriptlang.org/)
- [tRPC](https://trpc.io/)
- [Prisma ORM](https://www.prisma.io/) (PostgreSQL)
- [Tailwind CSS](https://tailwindcss.com/)
- [NextAuth.js](https://next-auth.js.org/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Radix UI](https://www.radix-ui.com/)

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm (v10+ recommended)
- Docker or Podman (for local database)

### Setup
1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd web
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy and configure your environment variables:
   ```bash
   cp .env.example .env
   # Edit .env as needed (see .env.example for required variables)
   ```
4. Start the local PostgreSQL database (Docker/Podman required):
   ```bash
   ./start-database.sh
   ```
5. Push the database schema and seed sample data:
   ```bash
   npm run db:push
   npm run db:generate
   npx prisma db seed
   ```
6. Start the development server:
   ```bash
   npm run dev
   ```
7. Visit [http://localhost:3000](http://localhost:3000) in your browser.

## Development
- **Build:** `npm run build`
- **Start:** `npm run start`
- **Lint:** `npm run lint` / `npm run lint:fix`
- **Type Check:** `npm run typecheck`
- **Format:** `npm run format:check` / `npm run format:write`
- **Prisma Studio:** `npm run db:studio`

## Database
- Schema defined in [`web/prisma/schema.prisma`](web/prisma/schema.prisma)
- Seed script: [`web/prisma/seed.ts`](web/prisma/seed.ts)
- Local DB managed via [`web/start-database.sh`](web/start-database.sh)
- Uses PostgreSQL by default (see `.env.example`)

## Project Structure
- `web/` — Main web application ([see web/README.md](web/README.md))
  - `src/` — Source code (app, components, hooks, services, etc.)
  - `prisma/` — Database schema and seed
  - `public/` — Static assets
- `.vscode/`, `.windsurf/` — Editor and project configs

## License
[MIT](LICENSE) (or specify your license here)