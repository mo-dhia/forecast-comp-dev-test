# Accessible Data Explorer – Coding Test Repo

This repository is set up for a **frontend-focused** coding test. It includes a fully working **Node.js + Express** backend and a **React (Vite)** frontend scaffold where the candidate will do most of the work.

> **Scenario**  
> Given a JSON dataset (10–20k rows), build an **Accessible Data Explorer** with:
>
> - Searchable, **virtualized** table with column filters
> - **Server‑style pagination** adapter, **debounced** search
> - A **mini chart view** (Chart.js) reflecting the current filters
> - **A11y must‑haves**: keyboard nav, ARIA labels, color‑contrast pass
> - **Error/empty states**, **skeleton loading**, **suspense boundary**
> - **State kept in the URL** (shareable deep links)
>
> **Live (30 min):** Add a **Saved Views** feature with `localStorage` + share‑link.

The backend here is intentionally complete and well‑documented so the test can focus on the frontend.

---

## Quick Start

### 1) Install

```bash
# from the repo root:
cd backend && npm install
cd ../frontend && npm install
```

### 2) Run

In one terminal:
```bash
cd backend
npm run dev
```

In another terminal:
```bash
cd frontend
npm run dev
```

- Backend runs on **http://localhost:4000**
- Frontend runs on **http://localhost:5173** (Vite)

You can change ports in `backend/.env` and `frontend/vite.config.js` if needed.

---

## What You’ll Build (Frontend)

Implement the **Data Explorer** at `src/pages/DataExplorer.jsx`:
- Hook up the **server-style pagination** to `/api/items` on the backend
- Implement **virtualized table** (react-window) at `src/components/VirtualTable.jsx`
- Add **filters** in `src/components/FiltersBar.jsx` (category/tax, price min/max, in stock, etc.)
- Implement **debounced search** (`src/hooks/useDebouncedValue.js`)
- Reflect the current filtered result in a **mini chart** (`src/components/ChartPanel.jsx`) using Chart.js
- Provide **keyboard navigation** (arrow up/down to move row focus), ARIA labels, good contrast
- Implement **loading skeleton** (`src/components/SkeletonRow.jsx`) and **error/empty states**
- Keep **state in the URL** (`src/hooks/useUrlState.js`) so the page is **shareable**

> **Live 30-min exercise:** Add **Saved Views** (`src/features/savedViews/`) with `localStorage` persistence + “Share Link”. A starter slice is included with TODOs.

---

## Backend Overview

- Framework: **Express**
- Endpoints: `GET /api/items`
- Dataset: `backend/data/items.json`
- Server supports **filtering**, **search**, **sorting**, **pagination**, and returns a **shape** ideal for a server‑paginated grid.

See `backend/README.md` for full API docs.

---

## Testing (Frontend)

```bash
cd frontend
npm test
```

Uses **Vitest** + **@testing-library/react**. Basic tests are scaffolded for you.

---

## Notes for Reviewers

- The instructions and TODOs are inline and in comments.  
- The code emphasizes **accessibility** and **performance**.  
- The backend is intentionally simple but realistic for paging/filtering/search demos.

Good luck & have fun!
