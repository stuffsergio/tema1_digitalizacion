# Vídeo 10: Paquetes, Enrutamiento y Confiabilidad (TCP/IP)

## Resumen Ejecutivo
Explicación de la conmutación de paquetes, el funcionamiento de los routers como gestores de tráfico y el papel esencial del protocolo TCP para garantizar una transmisión confiable de datos sobre redes físicamente inestables.

## 1. División en Paquetes (Packet Switching)
- **Inviabilidad de conexiones dedicadas**: Mantener líneas físicas directas por cada usuario sería imposible de escalar.
- **Paquetización**: Archivos grandes (canciones, vídeos, fotos) se dividen en miles de pequeñas unidades digitales denominadas **paquetes**.
- **Cabecera del paquete**: Cada paquete incluye la IP de origen, la IP de destino y su número de secuencia para el reensamblado.

## 2. Enrutadores (Routers) y Tolerancia a Fallos
- **Routers**: Computadoras especializadas que actúan como gestores de tráfico. Leen la IP de destino de cada paquete y eligen la ruta más "barata" (evaluando tiempo, congestión, costes y políticas).
- **Rutas dinámicas y desorden**: Los paquetes de un mismo mensaje pueden viajar por caminos distintos y llegar desordenados.
- **Tolerancia a fallos (Fault Tolerance)**: Si un router o cable cae, la red redirige automáticamente los paquetes por rutas alternativas sin interrumpir el servicio.

## 3. Protocolo de Control de Transmisión (TCP)
- **Función de TCP**: Capa de transporte encargada de garantizar que la información se entregue al 100% sin errores ni pérdidas.
- **Proceso de Abarco e Inventario**:
  1. El receptor registra cada paquete que llega.
  2. Envía confirmaciones (ACKs) de recepción al emisor.
  3. Si faltan paquetes o llegan corruptos, TCP solicita la **retransmisión** de los paquetes perdidos.
  4. Reordena la secuencia de paquetes para entregar el archivo completo y perfecto a la aplicación.
- **Escalabilidad**: El modelo TCP/IP escala fluidamente desde 8 hasta miles de millones de dispositivos.

---

> **Concepto Clave para DAW**: IP enruta fragmentos de información (paquetes) por múltiples caminos, mientras que TCP gestiona el inventario, reordena las piezas y exige retransmisiones para asegurar la entrega fiable.
