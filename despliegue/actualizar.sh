#!/bin/bash
set -euo pipefail

cd /var/www/digitalizacion

echo "Construyendo la web..."
npm install
npm run build

echo "Construyendo el API..."
docker build -t digitalizacion-api .

RED="$(docker inspect npm-npm-1 --format '{{range $n, $c := .NetworkSettings.Networks}}{{println $n}}{{end}}' | head -n 1)"
if [[ -z "${RED}" ]]; then
  echo "No encuentro la red de Nginx Proxy Manager." >&2
  exit 1
fi

echo "Reiniciando el API en la red ${RED}..."
docker rm -f digitalizacion-api >/dev/null 2>&1 || true
docker run -d \
  --name digitalizacion-api \
  --restart unless-stopped \
  --network "${RED}" \
  -p 127.0.0.1:3000:3000 \
  --env-file .env \
  -v digitalizacion-data:/app/data \
  digitalizacion-api

echo "Reiniciando la web..."
docker rm -f digitalizacion-web >/dev/null 2>&1 || true
docker run -d \
  --name digitalizacion-web \
  --restart unless-stopped \
  --network "${RED}" \
  -v /var/www/digitalizacion/dist:/usr/share/nginx/html:ro \
  -v /var/www/digitalizacion/despliegue/nginx-proxy.conf:/etc/nginx/conf.d/default.conf:ro \
  nginx:alpine

echo "Comprobando el API..."
for _ in 1 2 3 4 5 6 7 8 9 10; do
  if curl -fsS http://127.0.0.1:3000/api/salud; then
    echo
    echo "Listo."
    exit 0
  fi
  sleep 0.5
done

echo "El API no ha respondido." >&2
docker logs digitalizacion-api --tail 40 >&2
exit 1
