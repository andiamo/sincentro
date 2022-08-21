# SINCENTRO

Esta es un webapp escrita en [p5.js](https://p5js.org/es/) para experimentar con ideas de dibujo en vivo peer-to-peer (P2P). La app web utiliza la biblioteca [PeerJS](https://peerjs.com/) para comunicación P2P a través del estándar WebRTC. Basada en [Andiamo](https://github.com/andiamo) y [Trazos.club](http://trazos.club/).

El app web puede ser accedida para dibujar colaborativamente con otros usuarios en [esta página](https://andrescolubri.net/sincentro/). No es necesario ningún servidor central (con la excepción de un servidor de señalización necesario para establecer las conexiones pero que no maneja los datos), ya que WebRTC permite comunicacion P2P decentralizada.

Por el momento, la versión web de SINCENTRO utiliza el servidor de señalización gratuito ofrecido [por PeerJS](https://peerjs.com/peerserver.html) pero es posible usar un servidor de señalización propio, por más detalles ver los recursos referidos a PeerJS más abajo.

## Modificando el código

Este app esta pensada para ser modificada y adaptada sin restricciones. El código es minimal y la idea es que se puedan agregar nuevos pinceles y colores con facilidad. Ver este artículo en la Wiki del proyecto con más información al respecto.

## Algunos recursos

* Estándar WebRTC: https://webrtc.org/
  - Entrada en wikipedia: https://es.wikipedia.org/wiki/WebRTC
  - Artículo en el sitio de Web Docs de Mozilla: https://developer.mozilla.org/es/docs/Web/Guide/API/WebRTC/Peer-to-peer_communications_with_WebRTC
  - ¿Qué es WebRTC y cómo funciona? (artículo en inglés): https://www.innoarchitech.com/blog/what-is-webrtc-and-how-does-it-work

* PeeJS: https://peerjs.com/
  - Repo con el código fuente de la libreria: https://github.com/peers/peerjs
  - Repo con el código fuente del servidor de "señalización": https://github.com/peers/peerjs-server

* Compilación de software de dibujo "raro": https://github.com/REAS/sketchmachine/wiki/Weird-Drawing-Software
