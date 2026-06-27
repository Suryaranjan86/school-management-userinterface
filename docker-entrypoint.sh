#!/bin/sh
set -e

# Determine base URL: prefer VITE_BASE_URL, then VITE_API_BASE_URL, then default
VITE_BASE=${VITE_BASE_URL:-${VITE_API_BASE_URL:-http://localhost:8080/}}

cat > /usr/share/nginx/html/env-config.js <<EOF
window._env_ = {
  VITE_BASE_URL: "${VITE_BASE}"
};
EOF

# Start nginx in foreground
exec nginx -g 'daemon off;'

