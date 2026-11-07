# Despliegue en el VPS

La web y el API van separados, igual que en el resto de proyectos, con un paso más para el backend.

- Nginx sirve el frontend: la carpeta `dist` que genera `npm run build`.
- Docker arranca el API con el `Dockerfile`. El contenedor solo ejecuta `server/index.js`.
- Nginx reenvía `/api/` a `127.0.0.1:3000`. Ese puerto queda en el propio VPS. Desde internet solo entran el 80 y el 443.
- Las cuentas y el ranking viven en `data/app.db`, dentro de un volumen de Docker. Recrear el contenedor no borra esa base.

Sustituye `USUARIO`, `TU_USUARIO/TU_REPO` y `tudominio.ejemplo` por los tuyos. Los comandos del VPS se ejecutan en Termius.

El `package.json`, `src/`, `server/` y el `Dockerfile` tienen que estar en la raíz del repo. Si al clonar quedan dentro de una subcarpeta, entra en ella y usa esa ruta también en Nginx.

## 1. Dominio

En el panel del dominio, crea un registro A con el nombre que vas a usar y la IP pública del VPS. Desde Termius:

```bash
ping -c 3 tudominio.ejemplo
```

Tiene que responder la IP del VPS.

## 2. Subir el código a GitHub

En el PC, el `.env` y la carpeta `data/` no se suben: ya están en `.gitignore`. El código de clase del ordenador (`daw2026`) se queda aquí. En el VPS se crea otro `.env`.

Cuando el repo esté en GitHub, en Termius:

```bash
sudo mkdir -p /var/www/digitalizacion
sudo chown -R $USER:$USER /var/www/digitalizacion
git clone https://github.com/TU_USUARIO/TU_REPO.git /var/www/digitalizacion
cd /var/www/digitalizacion
```

`/var/www` permite que Nginx lea `dist`. Si clonas en tu home, Nginx suele quedarse sin permiso.

## 3. Comprobar Node y Docker

El frontend se construye en el VPS, como en los otros proyectos. Hace falta Node 22 o superior:

```bash
node -v
docker --version
```

Si Node no existe o es más antiguo:

```bash
curl -fsSL https://deb.nodesource.com/setup_24.x | sudo -E bash -
sudo apt install -y nodejs
node -v
```

El API no usa el Node del VPS. La imagen `node:24-bookworm-slim` trae el suyo, porque el servidor usa `node:sqlite`.

## 4. Crear el entorno del API

Este archivo solo existe en el VPS.

```bash
cd /var/www/digitalizacion
cp .env.example .env
nano .env
```

Inventa un código de clase largo y dáselo solo al grupo. `COOKIE_SECURE` se queda en 0 hasta tener HTTPS.

```env
PORT=3000
CODIGO_CLASE=un-codigo-largo-que-eliges-tu
COOKIE_SECURE=0
```

Guarda con Ctrl+O y sal con Ctrl+X.

El `Dockerfile` ya fija `NODE_ENV=production`, `HOST=0.0.0.0` y `TRUST_PROXY=1`. En este ordenador el API sigue escuchando solo en `127.0.0.1`. Dentro del contenedor escucha en todas las interfaces, y Docker publica ese puerto únicamente en el `127.0.0.1` del VPS.

## 5. Frontend con Nginx

```bash
cd /var/www/digitalizacion
npm install
npm run build
```

Tiene que aparecer `dist`.

```bash
sudo cp /var/www/digitalizacion/despliegue/nginx.conf /etc/nginx/sites-available/digitalizacion
sudo nano /etc/nginx/sites-available/digitalizacion
```

Sustituye `tudominio.ejemplo` en `server_name`. `root` ya apunta a `/var/www/digitalizacion/dist`. El bloque `/api/` apunta a `http://127.0.0.1:3000`.

```bash
sudo ln -s /etc/nginx/sites-available/digitalizacion /etc/nginx/sites-enabled/digitalizacion
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

## 6. Backend con Docker

Desde la raíz del repo, donde está el `Dockerfile`:

```bash
cd /var/www/digitalizacion
docker build -t digitalizacion-api .
docker rm -f digitalizacion-api 2>/dev/null || true
docker run -d \
  --name digitalizacion-api \
  --restart unless-stopped \
  -p 127.0.0.1:3000:3000 \
  --env-file .env \
  -v digitalizacion-data:/app/data \
  digitalizacion-api
```

`-p 127.0.0.1:3000:3000` deja el API fuera de internet. El volumen `digitalizacion-data` guarda `app.db`. Hay que repetir ese mismo nombre cada vez que recrees el contenedor.

Comprueba:

```bash
docker ps
curl http://127.0.0.1:3000/api/salud
```

`docker ps` tiene que mostrar `digitalizacion-api` en marcha, y `curl` tiene que responder `{"ok":true}`. Si el contenedor se cae:

```bash
docker logs digitalizacion-api
```

Abre `http://tudominio.ejemplo`. La web carga por Nginx. El registro, en este paso, va por HTTP.

## 7. HTTPS

Hazlo antes de que la clase entre con contraseñas.

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d tudominio.ejemplo
```

Certbot pide un email y reescribe Nginx para el puerto 443.

Después cambia la cookie y recrea el contenedor. Un contenedor ya arrancado no relee el `.env`.

```bash
nano /var/www/digitalizacion/.env
```

Pon `COOKIE_SECURE=1`. Luego:

```bash
cd /var/www/digitalizacion
docker rm -f digitalizacion-api
docker run -d \
  --name digitalizacion-api \
  --restart unless-stopped \
  -p 127.0.0.1:3000:3000 \
  --env-file .env \
  -v digitalizacion-data:/app/data \
  digitalizacion-api
```

A partir de aquí entra por `https://tudominio.ejemplo`. Si pones `COOKIE_SECURE=1` antes del certificado, el inicio de sesión deja de funcionar.

## 8. Cortafuegos

Si usas `ufw`, deja abiertos SSH, HTTP y HTTPS. El 3000 se queda cerrado.

```bash
sudo ufw allow OpenSSH
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
sudo ufw status
```

## 9. Comprobar la cuenta

1. Entra en `https://tudominio.ejemplo/registro`.
2. Crea una cuenta con el `CODIGO_CLASE` del `.env` del VPS.
3. Abre una lección y mira el perfil: el hito tiene que seguir ahí al recargar.
4. Haz el nivel 1 del cuestionario. En el perfil, ese intento sale como «Primer intento».
5. Ábrelo en el móvil, con otra cuenta, y mira `/ranking`.

## Cuando cambies el código

En el PC, sube los cambios a GitHub. En Termius:

```bash
cd /var/www/digitalizacion
git pull
npm install
npm run build
docker build -t digitalizacion-api .
docker rm -f digitalizacion-api
docker run -d \
  --name digitalizacion-api \
  --restart unless-stopped \
  -p 127.0.0.1:3000:3000 \
  --env-file .env \
  -v digitalizacion-data:/app/data \
  digitalizacion-api
```

`git pull` no toca el `.env` ni el volumen. Si también cambiaste `despliegue/nginx.conf`, vuelve a copiarlo a `sites-available`, pasa `sudo nginx -t` y recarga Nginx.

## Copia de seguridad

Antes de actualizar, para el contenedor, copia la base y vuelve a arrancarlo:

```bash
docker stop digitalizacion-api
docker cp digitalizacion-api:/app/data /var/www/digitalizacion/copia-datos
docker start digitalizacion-api
```

La copia queda en `/var/www/digitalizacion/copia-datos`. Para traerla al PC, desde PowerShell:

```powershell
scp -r USUARIO@IP_DEL_VPS:/var/www/digitalizacion/copia-datos .
```
