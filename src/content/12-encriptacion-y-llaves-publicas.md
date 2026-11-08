# Vídeo 12: Cifrado y Criptografía de Llave Pública

## Resumen Ejecutivo
Estudio de los principios de cifrado y descifrado de información en canales abiertos de Internet, analizando la evolución desde métodos simétricos antiguos hasta la criptografía asimétrica moderna de clave pública.

## 1. Conceptos Fundamentales
- **Cifrado (Encryption)**: Alterar o codificar el texto plano original mediante un algoritmo para convertirlo en un mensaje ilegible (criptograma).
- **Descifrado (Decryption)**: Proceso inverso de convertir el criptograma en el texto original mediante el uso de una clave.

## 2. Evolución Histórica y Cifrado Simétrico
- **Cifrado de César**: Sustitución con desplazamiento fijo. Inseguro (solo 26 claves posibles en el alfabeto).
- **Cifrado por sustitución multidigito**: Aumenta el número de combinaciones a 10,000 millones, pero una computadora moderna lo rompe en segundos.
- **Cifrado Simétrico Moderno**:
  - Emisor y receptor comparten exactamente la **misma clave secreta**.
  - Claves de **256 bits**: Requieren $2^{256}$ combinaciones (trillones de años de cómputo para fuerza bruta).
  - *Problema en Internet*: ¿Cómo acuerdan dos desconocidos una clave secreta a través de una red pública sin que nadie la intercepte?

## 3. Criptografía Asimétrica (Llave Pública y Privada)
- **Solución al intercambio de claves**: Utiliza un par de claves matemáticamente vinculadas:
  - **Llave Pública (Public Key)**: Compartida abiertamente con todo el mundo. Se usa exclusivamente para **cifrar** mensajes.
  - **Llave Privada (Private Key)**: Guardada en secreto por el propietario. Es la única capaz de **descifrar** los mensajes cifrados con su llave pública correspondiente.
- **Analogía del buzón**: Cualquiera puede introducir una carta por la ranura (llave pública), pero solo el dueño con su llave física (llave privada) puede abrir el buzón para leer las cartas.
- **Aplicación Práctica**: Constituye la base fundamental de protocolos como SSL/TLS, HTTPS y firmas digitales.

---

> **Concepto Clave para DAW**: El cifrado simétrico usa una sola clave compartida, mientras que la criptografía asimétrica (llave pública/privada) permite intercambiar información confidencial en redes abiertas sin compartir claves secretas previamente.
