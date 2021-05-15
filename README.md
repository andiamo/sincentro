# SINCENTRO

Esta es un app en Processing ([proto](https://github.com/codeanticode/sincentro/tree/main/snctr_proto)) y p5.js ([web](https://github.com/codeanticode/sincentro/tree/main/snctr_web)) para experimentar con ideas de dibujo en vivo peer-to-peer (P2P). La app web utiliza la biblioteca PeerJS para comunicación P2P a través del estándar WebRTC.

El app web puede ser accedida para dibujar colaborativamente con otros usuarios en [esta página](https://andrescolubri.net/sincentro/). No es necesario ningún servidor central, ya que WebRTC permite comunicacion P2P decentralizada.

## Modificando el código

Este app esta pensada para ser modificada y adaptada sin restricciones (la licencia es [MIT](https://es.wikipedia.org/wiki/Licencia_MIT)). El código es minimal y la idea es que se puedan agregar nuevos pinceles y colores con facilidad. Ver este artículo en la Wiki del proyecto con más información al respecto.

## Algunos recursos

* Estándar WebRTC: https://webrtc.org/
  - Entrada en wikipedia: https://es.wikipedia.org/wiki/WebRTC
  - Artículo en el sitio de Web Docs de Mozilla: https://developer.mozilla.org/es/docs/Web/Guide/API/WebRTC/Peer-to-peer_communications_with_WebRTC

* PeeJS: https://peerjs.com/
  - Repo con el código fuente de la libreria: https://github.com/peers/peerjs
  - Repo con el código fuente del servidor de "señalización": https://github.com/peers/peerjs-server

* Compilación de software de dibujo "raro": https://github.com/REAS/sketchmachine/wiki/Weird-Drawing-Software
