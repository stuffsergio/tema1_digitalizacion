# Tema 1.3: Sistema binario y representación de datos

## Resumen del vídeo: «How Computers Work: Binary & Data»

### 1. El sistema binario y los circuitos eléctricos

Las computadoras procesan información con circuitos eléctricos. En un cable la señal solo tiene dos estados: **encendida (1 / verdadero / sí)** o **apagada (0 / falso / no)**.

* **Bit**: el estado de un cable. Es la unidad de información más pequeña que maneja una computadora.
* Cuantos más cables, más bits, y se puede representar información más compleja mediante el **sistema binario**.

### 2. Conversión entre decimal y binario

* **Sistema decimal**: base 10. Cada posición multiplica por 10. De derecha a izquierda: 1, 10, 100, 1000.
* **Sistema binario**: base 2. Cada posición multiplica por 2. De derecha a izquierda: 1, 2, 4, 8, 16, 32, 64, 128.
* **El número 9 en binario** es `1001`.

Valor = (1 × 8) + (0 × 4) + (0 × 2) + (1 × 1) = 9.

### 3. Cuántos números caben

* **8 bits (1 byte)**: del 0 al 255. Hay 2⁸ = 256 combinaciones.
* **32 bits**: del 0 a más de 4.000 millones. 2³² = 4.294.967.296 combinaciones.

### 4. Texto, imagen y sonido

Cualquier información se puede reducir a números enteros y, por tanto, a binario.

1. **Texto**: cada letra tiene un número (A = 1, B = 2, o un estándar como ASCII). Una palabra es una secuencia de esos números.
2. **Imágenes y vídeo**: la imagen es una matriz de **píxeles**. El color de cada píxel es un número. Un vídeo convencional muestra 30 imágenes por segundo.
3. **Sonido**: una onda se mide en puntos concretos y cada punto se guarda como número. El audio de **32 bits** tiene más rango y más calidad que el de **8 bits**.

---

*Fuente: vídeo «How Computers Work: Binary & Data» (Code.org).*
