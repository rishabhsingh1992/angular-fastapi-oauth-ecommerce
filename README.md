# Angular FastAPI OAuth E-Commerce

A full-stack e-commerce application built with Angular 20 on the frontend and FastAPI on the backend, featuring OAuth authentication and a modern, responsive UI.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Angular 20, TypeScript 5.9, Tailwind CSS 4 |
| Backend | FastAPI 0.135, Python, Uvicorn |
| Validation | Pydantic v2 |
| Auth | OAuth 2.0 |
| Error Tracking | Sentry |

## Project Structure

```
.
├── apps/
│   ├── frontend/        # Angular 20 SPA
│   │   ├── src/
│   │   │   ├── app/     # Root component, routes, config
│   │   │   ├── main.ts
│   │   │   └── styles.css
│   │   ├── angular.json
│   │   └── package.json
│   │
│   └── backend/         # FastAPI application
│       ├── .env         # Environment variables (see .env.example)
│       └── requirements.txt
```

## Getting Started

### Prerequisites

- Node.js 20+
- Python 3.11+
- npm

### Frontend

```bash
cd apps/frontend
npm install
npm start
```

The app runs at `http://localhost:4200`.

| Script | Description |
|---|---|
| `npm start` | Dev server with hot reload |
| `npm run build` | Production build to `dist/` |
| `npm test` | Unit tests via Karma |

### Backend

```bash
cd apps/backend

# Create and activate virtual environment
python -m venv .venv
source .venv/bin/activate        # macOS/Linux
.venv\Scripts\activate           # Windows

# Install dependencies
pip install -r requirements.txt

# Copy and configure environment
cp .env.example .env

# Start development server
fastapi dev main.py
```

The API runs at `http://localhost:8000`. Interactive docs at `/docs`.

### Environment Variables

Create `apps/backend/.env` from `.env.example`:

```env
# Application
APP_ENV=development
SECRET_KEY=your-secret-key

# OAuth
OAUTH_CLIENT_ID=
OAUTH_CLIENT_SECRET=

# Database
DATABASE_URL=

# Sentry (optional)
SENTRY_DSN=
```

## Architecture

### Frontend

- **Standalone components** — no NgModules
- **Angular Signals** — reactive state management
- **OnPush change detection** — performance optimized
- **Lazy-loaded routes** — feature-based code splitting
- **Reactive Forms** — for all user input

### Backend

- **FastAPI** — async-first REST API with automatic OpenAPI docs
- **Pydantic v2** — request/response validation and settings management
- **python-dotenv** — environment configuration
- **Sentry** — error tracking and performance monitoring

## Contributing

1. Branch from `main`
2. Follow the Angular conventions in [apps/frontend/.claude/CLAUDE.md](apps/frontend/.claude/CLAUDE.md)
3. Ensure `npm test` passes before opening a PR
