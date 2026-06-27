// Prefer runtime-injected value (window._env_), then Vite build-time vars, then fallback
const runtimeBase = typeof window !== 'undefined' && (window._env_ || window.__RUNTIME__) && (window._env_.VITE_BASE_URL || window.__RUNTIME__.VITE_BASE_URL || window._env_.VITE_API_BASE_URL || window.__RUNTIME__.VITE_API_BASE_URL);
export const BASE_URL = runtimeBase || import.meta.env.VITE_BASE_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/';
