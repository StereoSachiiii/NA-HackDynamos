# Nutrition Advisor (MERN)

Full-stack MERN application tailored for Sri Lankan nutrition guidance. The project is split into a Node.js/Express backend and a Vite-powered React frontend.

## Stack

- **Backend:** Node.js, Express, MongoDB (Mongoose)
- **Frontend:** React, Vite, TailwindCSS, TanStack Query
- **Tooling:** ESLint, Prettier, Git hooks ready

## Workspaces

- `backend/` – REST API, database models, controllers, and utilities.
- `frontend/` – Vite application with routing, global state, and UI components.

## Getting Started

1. Copy `.env.example` to `.env` inside `backend/` and fill in credentials.
2. Install dependencies in both folders:
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```
3. Run backend and frontend in separate terminals using `npm run dev`.

## Scripts

- `backend`: `npm run dev` (nodemon), `npm run start`, `npm run lint`
- `frontend`: `npm run dev`, `npm run build`, `npm run preview`, `npm run lint`

## Folder Highlights

- `backend/config` – central configuration (database, constants).
- `backend/middleware` – auth, error handling, rate limiting, etc.
- `backend/routes` – modular route definitions (mounted under `/api/v1`).
- `frontend/src` – React components, hooks, services, styles, and assets.

## Contributing

1. Create a feature branch.
2. Ensure linting passes.
3. Open a pull request with context and screenshots if applicable.

## License

MIT

