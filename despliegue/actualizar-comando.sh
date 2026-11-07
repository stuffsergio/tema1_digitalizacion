#!/bin/bash
set -euo pipefail

if [[ "${1:-}" != "digitalizacion" ]]; then
  echo "Uso: actualizar digitalizacion" >&2
  exit 1
fi

cd /var/www/digitalizacion
git pull
exec bash /var/www/digitalizacion/despliegue/actualizar.sh
