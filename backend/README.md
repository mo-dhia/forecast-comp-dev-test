# Backend (Express)

A small, documented API to power the frontend test. Replace `data/items.json` with a large dataset (10–20k rows) for realism.

## Run

```bash
npm install
npm run dev
# http://localhost:4000
```

## Env

Create `.env` (optional):

```
PORT=4000
```

## API

### GET `/api/items`

**Query Params**
- `page` (number, default 1): One-based
- `pageSize` (number, default 25)
- `q` (string): Full-text search over `name` and `description`
- `taxCategory` (string): e.g. `standard`, `reduced`, `exempt`
- `category` (string): product category (e.g., `grocery`, `household`)
- `inStock` (boolean): `true`/`false`
- `priceMin`, `priceMax` (number)
- `sortBy` (string): `name|price|sold|createdAt`
- `sortDir` (string): `asc|desc`

**Response**
```json
{
  "page": 1,
  "pageSize": 25,
  "total": 1234,
  "items": [ { /* row */ } ],
  "facets": {
    "taxCategory": { "standard": 100, "reduced": 20 },
    "category": { "grocery": 300, "household": 70 }
  }
}
```

### GET `/api/facets-global`

**Response**
```json
{
  "facets": {
    "taxCategory": { "standard": 100, "reduced": 20 },
    "category": { "grocery": 300, "household": 70 }
  }
}
```

The `facets` object is handy for filter UIs & charts.

### GET `/api/metadata`

**Response**
```json
{
  "priceRange": {
    "min": 0,
    "max": 200,
    "step": 1
  }
}
```

Provides metadata for filter inputs (e.g., dynamic price range from actual data).