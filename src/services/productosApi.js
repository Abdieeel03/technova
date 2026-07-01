const buildQueryString = (params = {}) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
};

const CACHE_TTL = 5 * 60 * 1000;
const memoryCache = new Map();
const pendingRequests = new Map();

const getCachedData = (url) => {
  const memoryEntry = memoryCache.get(url);
  if (memoryEntry && Date.now() - memoryEntry.createdAt < CACHE_TTL) {
    return memoryEntry.data;
  }

  try {
    const storedEntry = sessionStorage.getItem(`productos:${url}`);
    if (!storedEntry) return null;

    const parsedEntry = JSON.parse(storedEntry);
    if (Date.now() - parsedEntry.createdAt >= CACHE_TTL) {
      sessionStorage.removeItem(`productos:${url}`);
      return null;
    }

    memoryCache.set(url, parsedEntry);
    return parsedEntry.data;
  } catch {
    return null;
  }
};

const setCachedData = (url, data) => {
  const entry = { createdAt: Date.now(), data };
  memoryCache.set(url, entry);

  try {
    sessionStorage.setItem(`productos:${url}`, JSON.stringify(entry));
  } catch {
    // Ignore storage limits or private mode restrictions.
  }
};

const createAbortError = () => new DOMException("Aborted", "AbortError");

const withAbortSignal = (request, signal) => {
  if (!signal) {
    return request;
  }

  if (signal.aborted) {
    return Promise.reject(createAbortError());
  }

  return Promise.race([
    request,
    new Promise((_, reject) => {
      signal.addEventListener("abort", () => reject(createAbortError()), {
        once: true,
      });
    }),
  ]);
};

const requestJson = async (url, signal, forceRefresh = false) => {
  if (forceRefresh) {
    memoryCache.delete(url);
    try {
      sessionStorage.removeItem(`productos:${url}`);
    } catch {
      // Ignore
    }
  } else {
    const cachedData = getCachedData(url);
    if (cachedData) {
      return cachedData;
    }
  }

  const pendingRequest = pendingRequests.get(url);
  if (pendingRequest) {
    return withAbortSignal(pendingRequest, signal);
  }

  const fetchUrl = forceRefresh
    ? (url.includes("?") ? `${url}&_t=${Date.now()}` : `${url}?_t=${Date.now()}`)
    : url;

  const fetchOptions = forceRefresh ? { cache: "no-store" } : {};

  const request = fetch(fetchUrl, fetchOptions)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      return response.json();
    })
    .then((data) => {
      setCachedData(url, data);
      return data;
    })
    .finally(() => {
      pendingRequests.delete(url);
    });

  pendingRequests.set(url, request);
  return withAbortSignal(request, signal);
};

const getProductoFromListCache = (id) => {
  const numericId = Number(id);
  if (!Number.isInteger(numericId)) return null;

  for (const entry of memoryCache.values()) {
    const producto = entry.data?.productos?.find((item) => item.id === numericId);
    if (producto) return producto;
  }

  try {
    for (let index = 0; index < sessionStorage.length; index += 1) {
      const key = sessionStorage.key(index);
      if (!key?.startsWith("productos:/api/productos")) continue;

      const parsedEntry = JSON.parse(sessionStorage.getItem(key));
      if (Date.now() - parsedEntry.createdAt >= CACHE_TTL) continue;

      const producto = parsedEntry.data?.productos?.find((item) => item.id === numericId);
      if (producto) return producto;
    }
  } catch {
    return null;
  }

  return null;
};

export async function fetchProductos(params, signal, forceRefresh = false) {
  const data = await requestJson(`/api/productos${buildQueryString(params)}`, signal, forceRefresh);
  return data.productos || [];
}

export async function fetchProductoById(id, signal) {
  const cachedProducto = getProductoFromListCache(id);
  if (cachedProducto) {
    return cachedProducto;
  }

  const data = await requestJson(`/api/productos/${id}`, signal);
  return data.producto || null;
}
