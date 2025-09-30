// Minimal API client using fetch, with endpoint constants

export const API_ENDPOINTS = {
  ITEMS: "/api/items",
  FACETS_GLOBAL: "/api/facets-global",
  METADATA: "/api/metadata",
};

const baseURL = (import.meta?.env?.VITE_API_URL || "http://localhost:4000").replace(/\/$/, "");

// TODO: Remove this delay before production - for skeleton testing only
const SKELETON_TEST_DELAY = 5000; // 5 seconds

async function request(method, path, { params, body, headers } = {}) {
  const url = new URL(baseURL + path);
  if (params && method === "GET") {
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") return;
      url.searchParams.set(key, String(value));
    });
  }

  // Add artificial delay for skeleton testing (REMOVE BEFORE PRODUCTION)
  await new Promise(resolve => setTimeout(resolve, SKELETON_TEST_DELAY));

  const res = await fetch(url.toString(), {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(headers || {}),
    },
    body: method === "GET" ? undefined : JSON.stringify(body ?? {}),
    credentials: "omit",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Request failed with ${res.status}`);
  }
  return res.json();
}

export const apiClient = {
  get: (path, options) => request("GET", path, options),
  post: (path, options) => request("POST", path, options),
  put: (path, options) => request("PUT", path, options),
  delete: (path, options) => request("DELETE", path, options),
};


