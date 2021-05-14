// Documentacion de la API:
// https://peerjs.com/docs.html
// https://www.toptal.com/webrtc/taming-webrtc-with-peerjs

// Ejemplos:
// https://github.com/nwah/peerjs-audio-chat
// https://github.com/peers/peerjs/issues/179

var peer = null;

var miID = "";
var otrosIDs = null;
var otrosEstados = null;
var mostrandoID = false;

function iniciarP2P() {
  peer = new Peer(); 
  peer.on('open', function(id) {
    miID = id;
  });

  otrosIDs = new HashMap();
  otrosEstados = new HashMap();

  peer.on('connection', function(conn) {
    conn.on('data', function(data) {
      recibirData(conn, data);
    });
  });
  peer.on('disconnected', function() {
    print("Desconectado del signalling server");
  });
  peer.on('error', function(err) {
    print("Hubo un error", err);
  });
}

function mostrarID() {
  mostrandoID = !mostrandoID;
  if (mostrandoID) {
    div = createDiv(miID);
    div.position(0, 0);
    div.size(300, 20);
  } else {
    removeElements();
  }
}

function leerID() {
  let entrada = window.prompt('Ingresar el codigo del peer');
  if (entrada) {
    // Este peer intenta conectarse a otro peer usando el id ingresado por el usuario,
    // ademas le enviara un mensaje de HOLA para generar el registro inverso.
    conectar(entrada, false, true, false);
  }
}

function conectar(id, compartir = false, primera = false, enviarTrazos = false) {
  if (!otrosIDs.containsKey(id)) {
    if (compartir) compartirNuevoPeer(id);
    let conn = peer.connect(id);
    conn.on('open', function() {
      if (compartir) compartirViejosPeers(conn);
      otrosIDs.put(id, conn);
      otrosEstados.put(id, new Estado(id));
      print("AGREGAR peer", conn.peer, otrosIDs.size());
      if (enviarTrazos) {
        enviarTodosLosTrazos(conn);
      }
      if (primera) {
        print("Enviando mensaje de llegada...")
        conn.send({tipo: "HOLA"});
      }
    });
    conn.on('close', function() {
      otrosIDs.remove(conn.peer);
      print("REMOVER peer", conn.peer, otrosIDs.size());
    });
  } else {
    print("Ya estoy conectado con", id);
  }
}

function compartirNuevoPeer(nuevoID) {
  print("Compartiendo nuevo peer con los demas...");
  for (let id of otrosIDs.keys()) {
    otrosIDs.get(id).send({tipo: "NUEVO_PEER", id : nuevoID});
  }
}

function compartirViejosPeers(conn) {
  print("Compartiendo viejos peers con el nuevo...");
  for (let otroID of otrosIDs.keys()) {
      conn.send({tipo: "VIEJO_PEER", id : otroID});
  }
}

function enviarMouseDragged(mx, my, press, time) {
  for (let id of otrosIDs.keys()) {
    otrosIDs.get(id).send({tipo: "PUNTERO_ARRASTRADO", x : mx, y : my, p: press, t: time});
  }
}

function recibirData(conn, data) {
  if (data["tipo"] === "HOLA") {
    print("Recibiendo mensaje de llegada...")
    print("HOLA", conn.peer);
    // Este peer recibe un mensaje de bienvenida de un nuevo peer, ademas de registrarlo, 
    // le avisa a los peers que ya tiene que tambien lo registren.
    conectar(conn.peer, true, false, true);
  } else if (data["tipo"] === "NUEVO_PEER") {
    let id = data["id"]
    conectar(id, false, false, true);
  } else if (data["tipo"] === "VIEJO_PEER") {
    let id = data["id"]
    conectar(id, false, false, false);
  } else if (data["tipo"] === "INICIAR_TRAZO") {
    if (otrosEstados.containsKey(conn.peer)) {
      let estado = otrosEstados.get(conn.peer);
      estado.iniciarTrazo(data["indice"], data["posx"], data["posy"], data["pres"], data["millis"], false);
    }
  } else if (data["tipo"] === "ACTUALIZAR_TRAZO") {
    if (otrosEstados.containsKey(conn.peer)) {
      let estado = otrosEstados.get(conn.peer);
      estado.actualizarTrazo(data["indice"], data["posx"], data["posy"], data["pres"], data["millis"], false);
    }    
  } else if (data["tipo"] === "TERMINAR_TRAZO") {
    if (otrosEstados.containsKey(conn.peer)) {
      let estado = otrosEstados.get(conn.peer);
      estado.terminarTrazo(data["indice"], data["unico"], false);
    }
  } else if (data["tipo"] === "ENTRADA_TECLADO") {
    if (otrosEstados.containsKey(conn.peer)) {
      let estado = otrosEstados.get(conn.peer);
      estado.procesarTeclado(data["codigo"], data["tecla"], false);
    }    
  } else {
    print("Recibido MENSAJE", data, "from", conn.peer);
  }
}

function enviarTodosLosTrazos(conn) {
  conn.send({tipo: "ENVIANDO TODOS LOS TRAZOS HASTA EL MOMENTO"});
}

function enviarIniciarTrazo(i, x, y, p, t) {
  for (let id of otrosIDs.keys()) {
    otrosIDs.get(id).send({tipo: "INICIAR_TRAZO", indice: i, posx : x, posy: y, pres: p, millis: t});
  }
}

function enviarActualizarTrazo(i, x, y, p, t) {
  for (let id of otrosIDs.keys()) {
    otrosIDs.get(id).send({tipo: "ACTUALIZAR_TRAZO", indice: i, posx : x, posy: y, pres: p, millis: t});
  }  
}

function enviarTerminarTrazo(i, u) {
  for (let id of otrosIDs.keys()) {
    otrosIDs.get(id).send({tipo: "TERMINAR_TRAZO", indice: i, unico: u});
  }
}

function enviarEntradaTeclado(kc, k) {
  for (let id of otrosIDs.keys()) {
    otrosIDs.get(id).send({tipo: "ENTRADA_TECLADO", codigo: keyCode, tecla: k});
  }
}