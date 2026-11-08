export const puntos = {
  1: [
    "Una computadora trata información con señales eléctricas de encendido y apagado.",
    "El temario sigue cinco pilares: definición, datos, circuitos, arquitectura y software.",
    "Entender ese mecanismo es la base para usar y para programar los dispositivos.",
  ],
  2: [
    "Toda computadora hace cuatro tareas: entrada, almacenamiento, procesamiento y salida.",
    "El procesamiento sigue un algoritmo: instrucciones paso a paso.",
    "Han cambiado el tamaño y la velocidad. Esas cuatro tareas siguen igual.",
  ],
  3: [
    "Un bit es un cable encendido (1) o apagado (0).",
    "En binario cada posición vale el doble que la de su derecha: 1, 2, 4, 8, 16…",
    "8 bits representan del 0 al 255. Texto, imagen y sonido también acaban en números.",
  ],
  4: [
    "NOT invierte la señal. AND solo devuelve 1 si las dos entradas son 1.",
    "1 + 1 en binario es 10: hacen falta dos bits para escribir el 2.",
    "Un circuito más pequeño es más rápido porque la señal recorre menos distancia.",
  ],
  5: [
    "Entrada, memoria, CPU y salida se pasan el dato en ese orden.",
    "La tecla B se convierte en binario, la CPU calcula sus píxeles y la pantalla los enciende.",
    "Gráficos 3D o vídeo HD piden varias CPU y gigabytes de memoria.",
  ],
  6: [
    "Hardware es lo físico. Software son los programas que le dicen qué hacer.",
    "Un comando de alto nivel se traduce a miles de instrucciones binarias.",
    "El sistema operativo reparte la CPU entre programas, tan rápido que parecen simultáneos.",
  ],
  7: [
    "Internet nace en ARPANET, con Vint Cerf y Bob Kahn entre sus diseñadores.",
    "Es una red de redes independientes, sin un ordenador central que la controle.",
    "Los mensajes se parten y pueden tomar cualquier camino de la malla.",
  ],
  8: [
    "Un byte son 8 bits. Un megabyte son, en esta cuenta, un millón de bytes.",
    "La fibra lleva bits como luz. El cobre se degrada a pocas decenas de metros.",
    "La latencia es el tiempo de viaje. El Wi-Fi acaba en un cable porque la radio no llega lejos.",
  ],
  9: [
    "IPv4 usa 32 bits. IPv6 usa 128 y abre una cantidad enorme de direcciones.",
    "El DNS traduce un nombre, como code.org, a una dirección IP.",
    "En el DNS spoofing, la caché apunta un nombre legítimo a una IP maliciosa.",
  ],
  10: [
    "Un archivo grande viaja partido en paquetes, no de una pieza.",
    "El router elige un camino. Si uno falla, los paquetes toman otro.",
    "TCP numera los paquetes, los reordena y pide de nuevo el que se perdió.",
  ],
  11: [
    "GET pide una página. POST envía datos, como un formulario.",
    "La cookie guarda un identificador para que el sitio recuerde la sesión.",
    "HTTP va en texto claro. HTTPS añade SSL o TLS y un certificado de una autoridad.",
  ],
  12: [
    "El cifrado de César solo tiene 26 claves y se prueba en minutos.",
    "La llave pública cifra. Solo la llave privada del destinatario abre el mensaje.",
    "Así se puede hablar en secreto sin haber compartido antes una clave.",
  ],
  13: [
    "Cerca del 90 % de los ataques salen de un error humano, no de un fallo del programa.",
    "Una botnet es una red de máquinas infectadas. Un DDoS las usa para saturar un servidor.",
    "El phishing imita un correo o una web para que entregues una contraseña.",
  ],
  14: [
    "Las arañas siguen enlaces y guardan las páginas en un índice ya preparado.",
    "PageRank mira cuántas webs, y de qué calidad, enlazan a una página.",
    "La búsqueda no recorre toda la web en ese instante: tardaría demasiado.",
  ],
};

export const citas = {
  1: {
    texto:
      "Comprender el funcionamiento interno de las computadoras es el primer paso tanto para entender los dispositivos cotidianos como para diseñar y programar las innovaciones tecnológicas del futuro.",
    fuente: "Introducing How Computers Work",
  },
  2: {
    texto:
      "En lugar de manipular tierra o piedras, estas máquinas se diseñaron para manipular información.",
    fuente: "What Makes a Computer, a Computer?",
  },
  3: {
    texto:
      "Cualquier información se puede reducir a números enteros y, por tanto, a binario.",
    fuente: "Binary & Data",
  },
  4: {
    texto:
      "Si el circuito es más pequeño, la señal recorre menos distancia y la máquina puede hacer miles de millones de cálculos por segundo.",
    fuente: "Circuits & Logic",
  },
  5: {
    texto:
      "La CPU ejecuta esas instrucciones, calcula los píxeles y guarda el resultado en la memoria.",
    fuente: "CPU, Memory, Input & Output",
  },
  6: {
    texto:
      "Parece que hay decenas de programas a la vez. En realidad el sistema operativo cambia de uno a otro en fracciones de segundo y comparten la misma CPU.",
    fuente: "Hardware and Software",
  },
  7: {
    texto:
      "Internet es una arquitectura distribuida, sin un punto único de fallo, donde redes independientes se interconectan con protocolos comunes.",
    fuente: "What is the Internet?",
  },
  8: {
    texto:
      "La fibra manda los bits como luz. El cobre se estropea enseguida, y el Wi-Fi tiene que volver a un cable.",
    fuente: "Wires, Cables & WiFi",
  },
  9: {
    texto:
      "El DNS es la guía que convierte un nombre que puedes leer en la dirección numérica de una máquina.",
    fuente: "IP Addresses and DNS",
  },
  10: {
    texto:
      "IP elige el camino de cada paquete. TCP comprueba que no falte ninguno y pide otra vez el que se perdió.",
    fuente: "Packets, Routing and Reliability",
  },
  11: {
    texto:
      "HTTP pide y envía. HTTPS, con un certificado, evita que esa conversación viaje en texto claro.",
    fuente: "HTTP and HTML",
  },
  12: {
    texto:
      "Con una llave pública se puede cifrar para alguien sin haber quedado antes en un secreto compartido.",
    fuente: "Encryption and Public Keys",
  },
  13: {
    texto:
      "La mayoría de los ataques no rompen el programa: convencen a una persona.",
    fuente: "Cybersecurity and Crime",
  },
  14: {
    texto:
      "El buscador no recorre la web cuando preguntas. Consulta un índice que las arañas han ido llenando.",
    fuente: "How Search Works",
  },
};
