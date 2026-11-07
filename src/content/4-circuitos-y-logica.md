# Tema 1.4: Circuitos eléctricos y puertas lógicas

## Resumen del vídeo: «How Computers Work: Circuits & Logic»

### 1. Combinar señales

Para pasar de una entrada a una salida, la computadora modifica señales de encendido (1) y apagado (0). Lo hace con millones de piezas microscópicas organizadas en **circuitos**.

### 2. Puertas lógicas

* **Puerta NO (NOT)**: recibe una señal y la invierte. Si entra 1, sale 0. Si entra 0, sale 1.
* **Puerta Y (AND)**: recibe dos señales. Devuelve 1 **solo si las dos entradas son 1**. Si alguna es 0, la salida es 0.

### 3. Sumadores

Uniendo puertas simples se construyen circuitos que suman.

* **Sumador de 1 bit**:
  * 0 + 0 = 0, salida `00`
  * 0 + 1 = 1, salida `01`
  * 1 + 1 = 2, salida de dos bits `10`
* **Sumador de 8 bits**: conecta varios sumadores de 1 bit. Para sumar dos números de 8 bits, por ejemplo 25 + 20, entran 16 señales (8 + 8) a la vez.

### 4. Tamaño y velocidad

* Antes, un sumador de 8 bits ocupaba lo que un frigorífico y tardaba minutos en un cálculo sencillo.
* Hoy esos circuitos son microscópicos.
* La electricidad viaja a una velocidad cercana a la de la luz. Si el circuito es más pequeño, la señal recorre menos distancia y la máquina puede hacer **miles de millones de cálculos por segundo**.

---

*Fuente: vídeo «How Computers Work: Circuits & Logic» (Code.org).*
