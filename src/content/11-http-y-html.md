# Vídeo 11: Protocolos de la Web (HTTP, HTML y Seguridad SSL/TLS)

## Resumen Ejecutivo
Análisis detallado de las capas de aplicación de la Web: cómo los navegadores solicitan y reciben contenido usando HTTP y HTML, la gestión de estado mediante cookies y el cifrado mediante HTTPS (SSL/TLS).

## 1. Funcionamiento de HTTP (HyperText Transfer Protocol)
HTTP es el protocolo de capa de aplicación utilizado por los clientes (navegadores) para comunicarse con los servidores web.
- **Petición GET**: El navegador solicita un documento o recurso al servidor (ej. `GET /login`).
- **Petición POST**: El navegador envía datos introducidos por el usuario (formularios de registro, credenciales, compras) adjuntos al cuerpo de la petición.
- **Archivos e imágenes independientes**: Cada recurso (imágenes, hojas de estilo, vídeos) requiere su propia petición HTTP independiente.

## 2. Lenguaje HTML y Estado (Cookies)
- **HTML (HyperText Markup Language)**: Lenguaje de marcado que indica al navegador cómo estructurar y presentar visualmente la página web (títulos, negritas, enlaces, imágenes).
- **Gestión de Estado mediante Cookies**:
  - Como HTTP es un protocolo *stateless* (sin estado), los servidores envían encabezados `Set-Cookie` con identificadores de sesión tras un inicio de sesión válido.
  - El navegador almacena la **cookie** y la adjunta automáticamente en cada petición posterior, permitiendo al servidor identificar al usuario.

## 3. Seguridad en la Web: HTTPS, SSL/TLS y Certificados Digitales
- **Riesgo en HTTP**: Las transmisiones HTTP viajan en texto plano y pueden ser interceptadas por terceros.
- **HTTPS (HTTP Secure)**: Encapsula el tráfico HTTP dentro de una capa de cifrado segura **SSL (Secure Sockets Layer)** o **TLS (Transport Layer Security)**.
- **Certificados Digitales**: Emitidos por **Autoridades Certificadoras (CAs)** independientes. Validan la identidad del sitio web y proveen las claves públicas para iniciar el canal cifrado (indicado con el icono del candado en el navegador).

---

> **Concepto Clave para DAW**: HTTP define las peticiones cliente-servidor (GET/POST), HTML estructura la interfaz visual, las cookies mantienen el estado de sesión y HTTPS (SSL/TLS) protege la confidencialidad mediante certificados digitales.
