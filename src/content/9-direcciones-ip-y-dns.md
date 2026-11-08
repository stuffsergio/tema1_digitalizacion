# Vídeo 9: Direcciones IP y Sistema de Nombres de Dominio (DNS)

## Resumen Ejecutivo
Estudio del direccionamiento en Internet y el protocolo DNS, los mecanismos que permiten identificar de manera única cada dispositivo en la red y traducir nombres legibles por humanos en direcciones numéricas.

## 1. El Protocolo IP (Internet Protocol)
Creado por Vint Cerf y Bob Kahn, el protocolo IP asigna a cada dispositivo una dirección lógica única, equivalente a una dirección postal o número telefónico.

- **IPv4 (1973 - 1980s)**:
  - Estructura de **32 bits** dividida en 4 octetos de 8 bits (ej. `174.129.14.120`).
  - Capacidad: Aprox. **4,300 millones** de direcciones únicas.
  - Jerarquía: Contiene identificación de país/región, red, subred y dispositivo específico.
- **IPv6 (El nuevo estándar)**:
  - Estructura de **128 bits**.
  - Capacidad: Aprox. **340 trillones de trillones** ($3.4 \times 10^{38}$) de direcciones (más granos que las arenas del planeta).

## 2. Sistema de Nombres de Dominio (DNS)
- **Función**: Mapear dominios textuales (ej. `www.code.org`) a sus correspondientes direcciones IP numéricas.
- **Arquitectura Jerárquica**: Al ser imposible que un solo servidor procese billones de peticiones, el DNS se organiza jerárquicamente en zonas jerárquicas por dominios de nivel superior (TLD: `.com`, `.org`, `.net`, `.es`).
- **Flujo de Resolución**:
  1. El cliente solicita la IP de un dominio a su servidor DNS local/ISP.
  2. Si no la posee en caché, el servidor consulta la jerarquía hasta obtener la IP final.
  3. Devuelve la IP al cliente y la almacena temporalmente en caché.

## 3. Amenazas de Seguridad en DNS
- **DNS Spoofing (Envenenamiento de Caché)**: Ataque donde un ciberdelincuente altera los registros de un servidor DNS para asociar un dominio legítimo con una IP maliciosa, redirigiendo a los usuarios a sitios web falsos para robar credenciales.

---

> **Concepto Clave para DAW**: Las Direcciones IP identifican numéricamente las máquinas en la red (IPv4/IPv6), mientras que el DNS traduce nombres de dominio amigables a direcciones IP mediante una jerarquía distribuida.
