# Digitalización · Tema 1

Aplicación de estudio para 1.º de DAW, con cuentas, progreso por persona y ranking de la clase.

En local hacen falta dos procesos. El código de clase de desarrollo está en `.env` (`daw2026`).

```bash
npm install
npm run api
npm run dev
```

`npm run dev` abre la web en la red Wi-Fi. `npm run api` es el servidor, solo en este ordenador.

El despliegue en el VPS está en `DESPLIEGUE.md`: Nginx sirve la web y Docker arranca el API.
