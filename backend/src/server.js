import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

const PORT = process.env.PORT || 4000;
const DATA_PATH = path.resolve(
  path.dirname(new URL(import.meta.url).pathname),
  '../data/items.json'
);

// Load dataset once at boot
let DATA = JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8'));

// ---- Helpers ----

// Coerce truthy boolean strings
function toBool(val) {
  if (val === true) return true;
  if (val === false) return false;
  if (typeof val === 'string') {
    return ['true', '1', 'yes', 'y'].includes(val.toLowerCase());
  }
  return undefined;
}

// Filtering & search
function applyFilters(rows, q, filters) {
  let out = rows;

  if (q) {
    const needle = q.toLowerCase();
    out = out.filter(
      (r) =>
        String(r.name || '').toLowerCase().includes(needle) ||
        String(r.description || '').toLowerCase().includes(needle)
    );
  }
  if (filters.taxCategory) {
    out = out.filter((r) => String(r.taxCategory) === String(filters.taxCategory));
  }
  if (filters.category) {
    out = out.filter((r) => String(r.category) === String(filters.category));
  }
  if (typeof filters.inStock === 'boolean') {
    out = out.filter((r) => Boolean(r.inStock) === filters.inStock);
  }
  if (filters.priceMin != null) {
    out = out.filter((r) => Number(r.price) >= Number(filters.priceMin));
  }
  if (filters.priceMax != null) {
    out = out.filter((r) => Number(r.price) <= Number(filters.priceMax));
  }
  return out;
}

// Facets
function buildFacets(rows) {
  const counts = (key) =>
    rows.reduce((acc, r) => {
      const k = r[key] ?? 'unknown';
      acc[k] = (acc[k] || 0) + 1;
      return acc;
    }, {});

  return {
    taxCategory: counts('taxCategory'),
    category: counts('category'),
    inStock: rows.reduce((acc, r) => {
      const k = r.inStock ? 'true' : 'false';
      acc[k] = (acc[k] || 0) + 1;
      return acc;
    }, {}),
  };
}

// Comparators
const comparators = {
  name: (a, b) => String(a.name).localeCompare(String(b.name)),
  price: (a, b) => Number(a.price) - Number(b.price),
  sold: (a, b) => Number(a.sold) - Number(b.sold),
  createdAt: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
};

// ---- Routes ----

// Items (with filters, search, facets)
app.get('/api/items', (req, res) => {
  const {
    page = '1',
    pageSize = '25',
    q,
    taxCategory,
    category,
    inStock,
    priceMin,
    priceMax,
    sortBy = 'createdAt',
    sortDir = 'desc',
  } = req.query;

  const filters = {
    taxCategory,
    category,
    inStock: toBool(inStock),
    priceMin: priceMin != null ? Number(priceMin) : undefined,
    priceMax: priceMax != null ? Number(priceMax) : undefined,
  };

  // 1) filter
  let rows = applyFilters(DATA, q, filters);

  // 2) facets (based on filtered results)
  const facets = buildFacets(rows);

  // 3) sort
  const cmp = comparators[sortBy] || comparators.createdAt;
  rows = rows.slice().sort(cmp);
  if (String(sortDir).toLowerCase() === 'desc') rows.reverse();

  // 4) paginate
  const total = rows.length;
  const p = Math.max(1, Number(page));
  const s = Math.max(1, Math.min(250, Number(pageSize))); // hard cap
  const start = (p - 1) * s;
  const items = rows.slice(start, start + s);

  res.json({
    page: p,
    pageSize: s,
    total,
    items,
    facets, // contextual (filtered) facets
  });
});

// Global facets (ignores search/filters)
app.get('/api/facets-global', (_req, res) => {
  const facets = buildFacets(DATA);
  res.json({ scope: 'global', facets });
});

// Root
app.get('/', (_req, res) => {
  res.send('Accessible Data Explorer API. See /api/items');
});

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
