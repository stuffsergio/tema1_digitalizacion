# Despliegue en el VPS

La web y el API van separados, igual que en el resto de proyectos, con un paso más para el backend.

- El puerto 80 y el 443 los ocupa Nginx Proxy Manager (`npm-npm-1`). El Nginx de Ubuntu se queda apagado.
- Un contenedor `digitalizacion-web` sirve la carpeta `dist`. Otro, `digitalizacion-api`, ejecuta `server/index.js`.
- Proxy Manager envía el dominio a `digitalizacion-web`. Ese contenedor reenvía `/api/` a `digitalizacion-api`.
- Las cuentas y el ranking viven en el volumen `digitalizacion-data`. Recrear los contenedores no borra esa base.

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

## 5. Apagar el Nginx de Ubuntu

En este VPS el 80 ya lo publica `npm-npm-1`. El Nginx del sistema se queda instalado y apagado.

```bash
sudo systemctl disable --now nginx
```

## 6. Construir el frontend

```bash
cd /var/www/digitalizacion
npm install
npm run build
```

Tiene que aparecer `dist`.

## 7. Contenedores en la red de Proxy Manager

Mira el nombre de la red que comparten Proxy Manager y el resto de webs:

```bash
docker inspect npm-npm-1 --format '{{range $n, $c := .NetworkSettings.Networks}}{{$n}}{{"\n"}}{{end}}'
```

En los comandos de abajo, cambia `RED` por ese nombre. En este VPS es `proxy-net`.

El API:

```bash
cd /var/www/digitalizacion
docker build -t digitalizacion-api .
docker rm -f digitalizacion-api
docker run -d \
  --name digitalizacion-api \
  --restart unless-stopped \
  --network RED \
  -p 127.0.0.1:3000:3000 \
  --env-file .env \
  -v digitalizacion-data:/app/data \
  digitalizacion-api
```

`-p 127.0.0.1:3000:3000` solo permite probar el API desde el propio VPS. El volumen `digitalizacion-data` guarda `app.db`. Hay que repetir ese mismo nombre cada vez que recrees el contenedor.

La web, con la configuración `despliegue/nginx-proxy.conf`:

```bash
docker rm -f digitalizacion-web
docker run -d \
  --name digitalizacion-web \
  --restart unless-stopped \
  --network RED \
  -v /var/www/digitalizacion/dist:/usr/share/nginx/html:ro \
  -v /var/www/digitalizacion/despliegue/nginx-proxy.conf:/etc/nginx/conf.d/default.conf:ro \
  nginx:alpine
```

Comprueba:

```bash
curl http://127.0.0.1:3000/api/salud
docker ps --filter name=digitalizacion
```

`curl` tiene que responder `{"ok":true}`. Los dos contenedores tienen que estar en marcha. Si uno se cae, `docker logs digitalizacion-api` o `docker logs digitalizacion-web`.

## 8. Proxy Host y HTTPS

Abre Nginx Proxy Manager en el puerto 81, el mismo panel de tus otras webs. Añade un Proxy Host:

- Domain Names: tu dominio
- Scheme: `http`
- Forward Hostname / IP: `digitalizacion-web`
- Forward Port: `80`
- Block Common Exploits: activado

En la pestaña SSL, pide un certificado de Let's Encrypt y activa Force SSL. El registro A del dominio tiene que apuntar ya a la IP del VPS.

Cuando el certificado esté activo, la cookie de sesión puede marcarse segura. Un contenedor ya arrancado no relee el `.env`.

```bash
nano /var/www/digitalizacion/.env
```

Pon `COOKIE_SECURE=1` y recrea solo el API:

```bash
cd /var/www/digitalizacion
docker rm -f digitalizacion-api
docker run -d \
  --name digitalizacion-api \
  --restart unless-stopped \
  --network RED \
  -p 127.0.0.1:3000:3000 \
  --env-file .env \
  -v digitalizacion-data:/app/data \
  digitalizacion-api
```

A partir de aquí entra por `https://tudominio.ejemplo`. Si pones `COOKIE_SECURE=1` antes del certificado, el inicio de sesión deja de funcionar.

## 9. Cortafuegos

Si usas `ufw`, deja abiertos SSH, HTTP y HTTPS. El 3000 se queda cerrado.

```bash
sudo ufw allow OpenSSH
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
sudo ufw status
```

## 10. Comprobar la cuenta

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
  --network RED \
  -p 127.0.0.1:3000:3000 \
  --env-file .env \
  -v digitalizacion-data:/app/data \
  digitalizacion-api
```

`git pull` no toca el `.env` ni el volumen. `digitalizacion-web` lee `dist` del disco, así que un `npm run build` nuevo se ve al recargar. Si cambias `despliegue/nginx-proxy.conf`, recrea ese contenedor con el mismo `docker run`.

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
